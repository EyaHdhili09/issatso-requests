import { useState, useMemo } from 'react'
import { MOCK_TEACHER_STAGES } from '../../services/mockData'
import { Briefcase, Search, Filter, Star, FileCheck, Calendar } from 'lucide-react'

const statusMap = {
  EN_ATTENTE_VALIDATION: { label: 'En attente validation', style: 'bg-[#fff7e6] text-[#b7791f]' },
  EN_COURS: { label: 'En cours', style: 'bg-[#eaf2ff] text-[#2b5fb8]' },
  TERMINE: { label: 'Terminé', style: 'bg-[#ebf8ef] text-[#2f7a45]' },
}

function TeacherStages() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tous')

  const filtered = useMemo(() => {
    return MOCK_TEACHER_STAGES.filter((s) => {
      const matchSearch =
        s.etudiantNom.toLowerCase().includes(search.toLowerCase()) ||
        s.entreprise.toLowerCase().includes(search.toLowerCase()) ||
        s.sujet.toLowerCase().includes(search.toLowerCase())
      const matchStatus =
        statusFilter === 'Tous' ? true : s.statut === statusFilter
      return matchSearch && matchStatus
    })
  }, [search, statusFilter])

  return (
    <div className="ml-[240px] min-h-screen bg-[#f3f3f3]">
      <div className="h-[60px] border-b border-[#e8e8e8] bg-white" />
      <main className="px-8 pb-10 pt-8">
        <div className="mb-8 rounded-sm border border-[#e5e5e5] bg-white px-5 py-4">
          <h1 className="text-[16px] font-medium text-[#222222]">Stages encadrés</h1>
          <p className="mt-2 text-[13px] text-[#6b7280]">
            Suivi des stagiaires dont vous êtes encadreur — {MOCK_TEACHER_STAGES.length} stage(s).
          </p>

          {/* Filtres */}
          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6f7b88]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par étudiant, entreprise, sujet..."
                className="w-full rounded-sm border border-[#d6dbe1] bg-[#fcfcfd] py-3 pl-10 pr-4 text-[14px] text-[#222] outline-none transition placeholder:text-[#9aa3ad] focus:border-[#4479a3] focus:bg-white"
              />
            </div>
            <div className="relative">
              <Filter size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6f7b88]" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-sm border border-[#d6dbe1] bg-[#fcfcfd] py-3 pl-10 pr-4 text-[14px] text-[#222] outline-none transition focus:border-[#4479a3] focus:bg-white"
              >
                <option value="Tous">Tous</option>
                <option value="EN_ATTENTE_VALIDATION">En attente validation</option>
                <option value="EN_COURS">En cours</option>
                <option value="TERMINE">Terminé</option>
              </select>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-sm border border-[#e5e5e5] bg-white px-6 py-10 text-center">
            <p className="text-[14px] text-[#6b7280]">Aucun stage ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((stage) => {
              const s = statusMap[stage.statut] || { label: stage.statut, style: 'bg-[#f3f4f6] text-[#6b7280]' }
              return (
                <article key={stage.id} className="rounded-sm border border-[#e4e4e4] bg-white px-6 py-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef4fa] text-[#4479a3]">
                          <Briefcase size={18} />
                        </div>
                        <div>
                          <h2 className="text-[17px] font-medium text-[#222222]">
                            {stage.etudiantNom}
                          </h2>
                          <p className="text-[12px] text-[#7b8794]">{stage.groupe}</p>
                        </div>
                      </div>

                      <p className="text-[14px] font-medium text-[#333] leading-6">{stage.sujet}</p>
                      <p className="mt-2 text-[13px] text-[#5f6470]">
                        <span className="font-medium text-[#333]">Entreprise :</span> {stage.entreprise}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-4 text-[13px] text-[#7b8794]">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar size={13} />
                          Du {stage.dateDebut} au {stage.dateFin}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <FileCheck size={13} />
                          Rapport : {stage.rapport ? (
                            <span className="text-[#2f7a45] font-medium">Déposé</span>
                          ) : (
                            <span className="text-[#b83232] font-medium">Non déposé</span>
                          )}
                        </span>
                        {stage.soutenance && (
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar size={13} />
                            Soutenance : {stage.soutenance}
                          </span>
                        )}
                      </div>

                      {stage.noteFinale && (
                        <div className="mt-3 inline-flex items-center gap-2 rounded-sm bg-[#ebf8ef] px-3 py-1.5 text-[13px] font-medium text-[#2f7a45]">
                          <Star size={14} />
                          Note finale : {stage.noteFinale}/20
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-start gap-3 lg:items-end">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium ${s.style}`}>
                        {s.label}
                      </span>
                      <p className="text-[12px] text-[#9aa3ad]">Réf : {stage.id}</p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default TeacherStages
