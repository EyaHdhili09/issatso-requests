import { useState } from 'react'
import { MOCK_TEACHER_MODULES } from '../../services/mockData'
import { BookOpen, Users, Clock, Search } from 'lucide-react'

function TeacherModules() {
  const [search, setSearch] = useState('')

  const filtered = MOCK_TEACHER_MODULES.filter((m) =>
    m.nom.toLowerCase().includes(search.toLowerCase()) ||
    m.code.toLowerCase().includes(search.toLowerCase()) ||
    m.niveau.toLowerCase().includes(search.toLowerCase())
  )

  const typeColors = {
    CM: 'bg-[#eef4fa] text-[#4479a3]',
    TD: 'bg-[#fff7e6] text-[#b7791f]',
    TP: 'bg-[#edf8f0] text-[#2f7a45]',
  }

  return (
    <div className="ml-[240px] min-h-screen bg-[#f3f3f3]">
      <div className="h-[60px] border-b border-[#e8e8e8] bg-white" />
      <main className="px-8 pb-10 pt-8">
        <div className="mb-8 rounded-sm border border-[#e5e5e5] bg-white px-5 py-4">
          <h1 className="text-[16px] font-medium text-[#222222]">Mes modules</h1>
          <p className="mt-2 text-[13px] text-[#6b7280]">
            Année universitaire 2024-2025 — {MOCK_TEACHER_MODULES.length} modules assignés.
          </p>
          <div className="relative mt-5">
            <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6f7b88]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un module..."
              className="w-full rounded-sm border border-[#d6dbe1] bg-[#fcfcfd] py-3 pl-10 pr-4 text-[14px] text-[#222] outline-none transition placeholder:text-[#9aa3ad] focus:border-[#4479a3] focus:bg-white"
            />
          </div>
        </div>

        <div className="space-y-6">
          {filtered.map((mod) => (
            <div key={mod.id} className="rounded-sm border border-[#e4e4e4] bg-white px-6 py-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef4fa] text-[#4479a3]">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-[17px] font-medium text-[#222222]">{mod.nom}</h2>
                        <span className="rounded-full bg-[#eef4fa] px-2.5 py-0.5 text-[11px] font-medium text-[#4479a3]">
                          {mod.semestre}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#7b8794]">Code : {mod.code} · {mod.niveau}</p>
                    </div>
                  </div>

                  {/* Groupes */}
                  <div className="mt-4 flex items-center gap-2 flex-wrap">
                    <Users size={14} className="text-[#9aa3ad]" />
                    {mod.groupes.map((g) => (
                      <span key={g} className="rounded-sm bg-[#f3f4f6] px-2.5 py-0.5 text-[12px] text-[#5f6470]">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Volume horaire */}
                <div className="flex gap-3">
                  {mod.heuresCM > 0 && (
                    <div className={`flex flex-col items-center rounded-sm px-4 py-3 ${typeColors.CM}`}>
                      <span className="text-[18px] font-bold">{mod.heuresCM}h</span>
                      <span className="text-[11px] font-medium">CM</span>
                    </div>
                  )}
                  {mod.heuresTD > 0 && (
                    <div className={`flex flex-col items-center rounded-sm px-4 py-3 ${typeColors.TD}`}>
                      <span className="text-[18px] font-bold">{mod.heuresTD}h</span>
                      <span className="text-[11px] font-medium">TD</span>
                    </div>
                  )}
                  {mod.heuresTP > 0 && (
                    <div className={`flex flex-col items-center rounded-sm px-4 py-3 ${typeColors.TP}`}>
                      <span className="text-[18px] font-bold">{mod.heuresTP}h</span>
                      <span className="text-[11px] font-medium">TP</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="mt-4 flex items-center gap-2 text-[13px] text-[#7b8794] border-t border-[#f0f0f0] pt-4">
                <Clock size={14} />
                <span>
                  Volume total : <strong className="text-[#333]">{mod.heuresCM + mod.heuresTD + mod.heuresTP}h</strong>
                  {' '}· Année : <strong className="text-[#333]">{mod.anneeUniv}</strong>
                </span>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="rounded-sm border border-[#e5e5e5] bg-white px-6 py-10 text-center">
              <p className="text-[14px] text-[#6b7280]">Aucun module ne correspond à votre recherche.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default TeacherModules
