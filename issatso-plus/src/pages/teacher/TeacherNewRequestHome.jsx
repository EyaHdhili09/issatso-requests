import { useMemo, useState } from 'react'
import {
  Search, X, ChevronRight, CircleHelp,
  Plane, Monitor, FileCheck, AlertCircle, FileText,
} from 'lucide-react'

function TeacherNewRequestHome({ onSelectRequest }) {
  const [search, setSearch] = useState('')

  const requestTypes = [
    {
      id: 'teacher-conge-formation',
      title: 'Congé / Mission de formation',
      description: 'Demande de congé pour participation à une conférence, formation, séminaire ou mission pédagogique à l\'extérieur.',
      icon: Plane,
      disabled: false,
      category: 'Formation & Mobilité',
    },
    {
      id: 'teacher-materiel',
      title: 'Demande de matériel',
      description: 'Solliciter du matériel pédagogique, informatique ou de bureau nécessaire à vos activités d\'enseignement ou de recherche.',
      icon: Monitor,
      disabled: false,
      category: 'Équipement',
    },
    {
      id: 'teacher-attestation',
      title: 'Attestation de service',
      description: 'Obtenir une attestation administrative de votre statut, grade ou ancienneté pour des démarches personnelles ou professionnelles.',
      icon: FileCheck,
      disabled: false,
      category: 'Documents administratifs',
    },
    {
      id: 'teacher-reclamation',
      title: 'Réclamation administrative',
      description: 'Déposer une réclamation concernant le calcul des heures, les conditions d\'enseignement ou tout autre sujet administratif.',
      icon: AlertCircle,
      disabled: false,
      category: 'Réclamations',
    },
    {
      id: 'teacher-autre',
      title: 'Autre demande',
      description: 'Toute autre demande administrative ne correspondant pas aux catégories ci-dessus.',
      icon: FileText,
      disabled: false,
      category: 'Divers',
    },
  ]

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return requestTypes
    return requestTypes.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    )
  }, [search])

  return (
    <div className="ml-[240px] min-h-screen bg-[#f3f3f3]">
      <div className="h-[60px] border-b border-[#e8e8e8] bg-white" />
      <main className="px-8 pb-10 pt-8">
        <div className="mb-8 rounded-sm border border-[#e5e5e5] bg-white px-5 py-4">
          <h1 className="text-[16px] font-medium text-[#222222]">Nouvelle demande</h1>
          <p className="mt-2 text-[13px] text-[#6b7280]">
            Choisissez le type de demande administrative que vous souhaitez soumettre.
          </p>
          <div className="relative mt-5">
            <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6f7b88]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un type de demande..."
              className="w-full rounded-sm border border-[#d6dbe1] bg-[#fcfcfd] py-3 pl-10 pr-11 text-[14px] text-[#222] outline-none transition placeholder:text-[#9aa3ad] focus:border-[#4479a3] focus:bg-white"
            />
            {search && (
              <button type="button" onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b96a3] transition hover:text-[#4479a3]">
                <X size={16} />
              </button>
            )}
          </div>
          <p className="mt-2 text-[12px] text-[#7b8794]">
            Recherchez par nom, catégorie ou type de demande.
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-sm border border-[#e5e5e5] bg-white px-6 py-10 text-center">
            <p className="text-[14px] text-[#6b7280]">
              Aucun type de demande ne correspond à votre recherche.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {filtered.map((item) => {
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
                        <h2 className="text-[18px] font-medium text-[#222222]">{item.title}</h2>
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                          item.disabled ? 'bg-[#f3f4f6] text-[#7b8794]' : 'bg-[#eaf4ec] text-[#2f7a45]'
                        }`}>
                          {item.disabled ? 'Bientôt disponible' : 'Disponible'}
                        </span>
                      </div>
                      <p className="text-[14px] leading-7 text-[#5f6470]">{item.description}</p>
                      <p className="mt-4 text-[12px] font-medium uppercase tracking-wide text-[#7b8794]">
                        {item.category}
                      </p>
                    </div>
                    {!item.disabled
                      ? <ChevronRight size={18} className="mt-1 shrink-0 text-[#4479a3]" />
                      : <CircleHelp size={18} className="mt-1 shrink-0 text-[#9ca3af]" />
                    }
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

export default TeacherNewRequestHome
