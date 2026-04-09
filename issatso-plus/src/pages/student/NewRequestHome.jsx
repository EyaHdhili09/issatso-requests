import { useMemo, useState } from 'react'
import {
  Search,
  Briefcase,
  FileText,
  Users,
  ScrollText,
  GraduationCap,
  FileBadge,
  CircleHelp,
  ChevronRight,
  X,
} from 'lucide-react'

function NewRequestHome({ onSelectRequest }) {
  const [search, setSearch] = useState('')

  const requestTypes = [
    {
      id: 'new-stage-request',
      title: "Demande de stage d'été",
      description:
        "Soumettre une demande liée au stage d'été avec les informations étudiant, entreprise d'accueil et détail du stage.",
      icon: Briefcase,
      disabled: false,
      category: 'Stages',
    },
    {
      id: 'group-change-request',
      title: 'Demande de changement de groupe',
      description:
        "Formuler une demande de changement de groupe avec justification et suivi administratif.",
      icon: Users,
      disabled: true,
      category: 'Scolarité',
    },
    {
      id: 'certificate-request',
      title: "Demande d'attestation",
      description:
        "Demander une attestation administrative ou académique depuis l'espace étudiant.",
      icon: FileBadge,
      disabled: true,
      category: 'Documents',
    },
    {
      id: 'claim-request',
      title: 'Réclamation administrative',
      description:
        "Déposer une réclamation liée à une situation administrative nécessitant traitement ou vérification.",
      icon: ScrollText,
      disabled: true,
      category: 'Réclamations',
    },
    {
      id: 'internship-letter-request',
      title: "Demande de lettre d'appui",
      description:
        "Préparer une demande liée à l'obtention d'une lettre d'appui pour un stage ou une démarche académique.",
      icon: GraduationCap,
      disabled: true,
      category: 'Stages',
    },
    {
      id: 'other-request',
      title: 'Autre demande administrative',
      description:
        "Espace réservé aux futurs types de demandes : documents, requêtes diverses et autres traitements.",
      icon: FileText,
      disabled: true,
      category: 'Divers',
    },
  ]

  const filteredRequests = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return requestTypes
    return requestTypes.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      )
    })
  }, [search])

  return (
    <div className="ml-[240px] min-h-screen bg-[#f3f3f3]">
      <div className="h-[60px] border-b border-[#e8e8e8] bg-white" />
      <main className="px-8 pb-10 pt-8">
        <div className="mb-8 rounded-sm border border-[#e5e5e5] bg-white px-5 py-4">
          <h1 className="text-[16px] font-medium text-[#222222]">Nouvelle demande</h1>
          <p className="mt-2 text-[13px] text-[#6b7280]">
            Choisissez le type de demande que vous souhaitez soumettre.
          </p>
          <div className="mt-5">
            <div className="relative">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6f7b88]"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un type de demande..."
                className="w-full rounded-sm border border-[#d6dbe1] bg-[#fcfcfd] py-3 pl-10 pr-11 text-[14px] text-[#222] outline-none transition placeholder:text-[#9aa3ad] focus:border-[#4479a3] focus:bg-white"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b96a3] transition hover:text-[#4479a3]"
                  aria-label="Effacer la recherche"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <p className="mt-2 text-[12px] text-[#7b8794]">
              Recherchez par nom, catégorie ou type de demande.
            </p>
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="rounded-sm border border-[#e5e5e5] bg-white px-6 py-10 text-center">
            <p className="text-[14px] text-[#6b7280]">
              Aucun type de demande ne correspond à votre recherche.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {filteredRequests.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => !item.disabled && onSelectRequest(item.id)}
                  className={`rounded-sm border bg-white p-6 text-left transition ${
                    item.disabled
                      ? 'cursor-not-allowed border-[#e5e5e5] opacity-85'
                      : 'border-[#e5e5e5] hover:border-[#4479a3] hover:bg-[#fafcff]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#eef4fa] text-[#4479a3]">
                        <Icon size={22} />
                      </div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h2 className="text-[18px] font-medium text-[#222222]">
                          {item.title}
                        </h2>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                            item.disabled
                              ? 'bg-[#f3f4f6] text-[#7b8794]'
                              : 'bg-[#eaf4ec] text-[#2f7a45]'
                          }`}
                        >
                          {item.disabled ? 'Bientôt disponible' : 'Disponible'}
                        </span>
                      </div>
                      <p className="text-[14px] leading-7 text-[#5f6470]">
                        {item.description}
                      </p>
                      <p className="mt-4 text-[12px] font-medium uppercase tracking-wide text-[#7b8794]">
                        {item.category}
                      </p>
                    </div>
                    {!item.disabled ? (
                      <ChevronRight size={18} className="mt-1 shrink-0 text-[#4479a3]" />
                    ) : (
                      <CircleHelp size={18} className="mt-1 shrink-0 text-[#9ca3af]" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default NewRequestHome
