import { useAuth } from '../../contexts/AuthContext'
import {
  MOCK_TEACHER_STAGES,
  MOCK_TEACHER_ACTUALITES,
} from '../../services/mockData'
import {
  UserRound,
  BadgeCheck,
  Briefcase,
  ChevronRight,
  Building2,
  GraduationCap,
  FileText,
  Compass,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Send,
  FilePlus,
} from 'lucide-react'

function TeacherDashboard({ onNavigate }) {
  const { user } = useAuth()

  const stagesEnCours = MOCK_TEACHER_STAGES.filter(
    (s) => s.statut === 'EN_COURS' || s.statut === 'EN_ATTENTE_VALIDATION'
  ).length
  const stagesTermines = MOCK_TEACHER_STAGES.filter((s) => s.statut === 'TERMINE').length

  const liensUtiles = [
    { name: "Ministère de l'Enseignement Supérieur", icon: Building2 },
    { name: 'Université de Sousse', icon: GraduationCap },
    { name: 'Plateforme ENT ISSATSo', icon: FileText },
    { name: 'Orientation.tn', icon: Compass },
  ]

  const getActuIcon = (type) => {
    switch (type) {
      case 'reunion': return <UserRound size={14} className="text-[#2b5fb8]" />
      case 'deadline': return <AlertCircle size={14} className="text-[#b83232]" />
      case 'formation': return <FileText size={14} className="text-[#2f7a45]" />
      default: return <Clock3 size={14} className="text-[#b7791f]" />
    }
  }

  return (
    <div className="ml-[240px] min-h-screen bg-[#f3f3f3]">
      <div className="h-[60px] border-b border-[#e8e8e8] bg-white" />
      <main className="px-8 pb-10 pt-8">

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Stages en cours', value: stagesEnCours, color: 'text-[#2b5fb8]', bg: 'bg-[#eaf2ff]', icon: Briefcase },
            { label: 'Stages terminés', value: stagesTermines, color: 'text-[#2f7a45]', bg: 'bg-[#ebf8ef]', icon: CheckCircle2 },
            { label: 'Demandes soumises', value: 4, color: 'text-[#4479a3]', bg: 'bg-[#eef4fa]', icon: Send },
            { label: 'En attente réponse', value: 2, color: 'text-[#b7791f]', bg: 'bg-[#fff7e6]', icon: Clock3 },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="rounded-sm border border-[#e4e4e4] bg-white px-5 py-5">
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${stat.bg} ${stat.color}`}>
                  <Icon size={18} />
                </div>
                <p className={`text-[24px] font-semibold ${stat.color}`}>{stat.value}</p>
                <p className="text-[13px] text-[#6b7280]">{stat.label}</p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Colonne principale */}
          <section className="col-span-12 xl:col-span-9 space-y-8">

            {/* Stages encadrés récents */}
            <div>
              <div className="mb-4 flex items-center justify-between rounded-sm border border-[#e5e5e5] bg-white px-4 py-3">
                <h2 className="text-[15px] font-medium text-[#222222]">Stages encadrés</h2>
                <button type="button" onClick={() => onNavigate('teacher-stages')}
                  className="flex items-center gap-1 text-[13px] text-[#4479a3] transition hover:underline">
                  Voir tout <ChevronRight size={14} />
                </button>
              </div>
              <div className="space-y-4">
                {MOCK_TEACHER_STAGES.slice(0, 3).map((stage) => {
                  const statusMap = {
                    EN_ATTENTE_VALIDATION: { label: 'En attente', style: 'bg-[#fff7e6] text-[#b7791f]' },
                    EN_COURS: { label: 'En cours', style: 'bg-[#eaf2ff] text-[#2b5fb8]' },
                    TERMINE: { label: 'Terminé', style: 'bg-[#ebf8ef] text-[#2f7a45]' },
                  }
                  const s = statusMap[stage.statut] || { label: stage.statut, style: 'bg-[#f3f4f6] text-[#6b7280]' }
                  return (
                    <article key={stage.id} className="rounded-sm border border-[#e4e4e4] bg-white px-5 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef4fa] text-[#4479a3]">
                              <Briefcase size={14} />
                            </div>
                            <span className="text-[15px] font-medium text-[#222]">{stage.etudiantNom}</span>
                            <span className="text-[12px] text-[#9aa3ad]">{stage.groupe}</span>
                          </div>
                          <p className="mt-1 text-[13px] text-[#5f6470]">{stage.sujet}</p>
                          <p className="mt-1 text-[12px] text-[#7b8794]">
                            {stage.entreprise} · {stage.dateDebut} → {stage.dateFin}
                          </p>
                          {stage.noteFinale && (
                            <p className="mt-1 text-[12px] font-medium text-[#2f7a45]">
                              Note : {stage.noteFinale}/20
                            </p>
                          )}
                        </div>
                        <span className={`shrink-0 inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium ${s.style}`}>
                          {s.label}
                        </span>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>

            {/* Actualités */}
            <div>
              <div className="mb-4 rounded-sm border border-[#e5e5e5] bg-white px-4 py-3">
                <h2 className="text-[15px] font-medium text-[#222222]">Actualités</h2>
              </div>
              <div className="space-y-3">
                {MOCK_TEACHER_ACTUALITES.map((actu, i) => (
                  <div key={i} className="flex items-start gap-4 rounded-sm border border-[#e4e4e4] bg-white px-5 py-4">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center">
                      {getActuIcon(actu.type)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] leading-6 text-[#222]">{actu.titre}</p>
                      <p className="mt-1 text-[12px] text-[#9aa3ad]">{actu.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Sidebar droite */}
          <aside className="col-span-12 space-y-8 xl:col-span-3">

            {/* Profil enseignant */}
            <div className="rounded-sm border border-[#e4e4e4] bg-white px-7 py-8">
              <div className="flex flex-col items-center text-center">
                <div className="mb-7 flex h-[106px] w-[106px] items-center justify-center overflow-hidden rounded-full bg-[#efefef] text-[#666666]">
                  <UserRound size={46} strokeWidth={1.7} />
                </div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-[16px] font-medium uppercase text-[#2b2b2b]">
                    {user?.nom || 'ENSEIGNANT'}
                  </h3>
                  <BadgeCheck size={17} className="text-[#3b82f6]" strokeWidth={2} />
                </div>
                <p className="mt-3 text-[13px] text-[#6f6f6f]">{user?.grade || 'Enseignant'}</p>
                <p className="mt-2 text-[13px] font-medium text-[#5e93bf]">
                  {user?.departement || 'Département'}
                </p>
                {user?.specialite && (
                  <p className="mt-2 text-[12px] text-[#7b8794]">{user.specialite}</p>
                )}
                <div className="mt-5 w-full space-y-2 text-[13px] text-[#5f6470]">
                  {user?.bureau && (
                    <p className="flex items-center justify-center gap-2">
                      <span className="text-[#9aa3ad]">Bureau :</span>
                      <span className="font-medium text-[#333]">{user.bureau}</span>
                    </p>
                  )}
                  {user?.email && (
                    <p className="truncate text-[12px] text-[#4479a3]">{user.email}</p>
                  )}
                </div>
                <button type="button"
                  className="mt-7 inline-flex items-center gap-2 text-[14px] font-medium text-[#1f1f1f] transition-colors hover:text-[#4479a3]">
                  Visiter votre profil
                  <ChevronRight size={16} strokeWidth={2.2} />
                </button>
              </div>
            </div>

            {/* Accès rapide */}
            <div className="rounded-sm border border-[#e4e4e4] bg-white">
              <div className="border-b border-[#ececec] px-5 py-4">
                <h3 className="text-[15px] font-medium text-[#222222]">Accès rapide</h3>
              </div>
              <div className="px-5 py-4 space-y-2">
                {[
                  { label: 'Nouvelle demande', key: 'teacher-new-request', icon: FilePlus },
                  { label: 'Mes demandes', key: 'teacher-my-requests', icon: Send },
                  { label: 'Stages encadrés', key: 'teacher-stages', icon: Briefcase },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <button key={item.key} type="button" onClick={() => onNavigate(item.key)}
                      className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left text-[14px] text-[#333] transition hover:bg-[#f5f7f9]">
                      <Icon size={16} className="text-[#4479a3]" strokeWidth={1.9} />
                      {item.label}
                      <ChevronRight size={14} className="ml-auto text-[#c0c0c0]" />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Liens utiles */}
            <div className="rounded-sm border border-[#e4e4e4] bg-white">
              <div className="border-b border-[#ececec] px-5 py-4">
                <h3 className="text-[15px] font-medium text-[#222222]">Liens utiles</h3>
              </div>
              <div className="space-y-4 px-5 py-5">
                {liensUtiles.map((lien, idx) => {
                  const Icon = lien.icon
                  return (
                    <a key={idx} href="#"
                      className="group flex items-start gap-3 text-[14px] leading-9 text-[#5a79a0] transition-colors hover:text-[#4479a3]">
                      <span className="mt-[9px] shrink-0 text-[#6b7280] group-hover:text-[#4479a3]">
                        <Icon size={15} strokeWidth={2} />
                      </span>
                      <span>{lien.name}</span>
                    </a>
                  )
                })}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default TeacherDashboard
