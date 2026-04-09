import { useAuth } from '../../contexts/AuthContext'
import {
  ChevronRight,
  Building2,
  GraduationCap,
  FileText,
  Compass,
  UserRound,
  BadgeCheck,
  Clock3,
  CheckCircle2,
  XCircle,
  FilePlus,
  Send,
} from 'lucide-react'
import { MOCK_REQUESTS } from '../../services/mockData'
import { formatStatus, getStatusStyle, getStatusIcon } from '../../components/common/StatusBadge'

function StudentDashboard({ onNavigate }) {
  const { user } = useAuth()

  const myRequests = MOCK_REQUESTS.filter(r => r.studentCin === user?.cin).slice(0, 3)

  const stats = {
    total: MOCK_REQUESTS.filter(r => r.studentCin === user?.cin).length,
    enAttente: MOCK_REQUESTS.filter(r => r.studentCin === user?.cin && r.status === 'EN_ATTENTE').length,
    enCours: MOCK_REQUESTS.filter(r => r.studentCin === user?.cin && r.status === 'EN_COURS').length,
    validees: MOCK_REQUESTS.filter(r => r.studentCin === user?.cin && r.status === 'VALIDEE').length,
  }

  const actualites = [
    {
      month: 'MAR',
      day: '27',
      title: "Appel à candidature – Programme d'échange ISSAT Sousse / IUT de Poitiers",
      time: '10:13',
    },
    {
      month: 'MAR',
      day: '17',
      title: 'Prix Abdelhamid Chouman 2026',
      time: '15:39',
    },
    {
      month: 'MAR',
      day: '17',
      title: 'Appel à candidature - bourse Dakka',
      time: '15:37',
    },
    {
      month: 'FEB',
      day: '13',
      title: 'Horaire Ramadan',
      time: '09:12',
    },
    {
      month: 'FEB',
      day: '07',
      title: 'بالغ - دفع القسط الثاني من معاليم التسجيل 2026-2025',
      time: '16:29',
    },
  ]

  const liensUtiles = [
    { name: "Ministère de l'Enseignement Supérieur et de la Recherche Scientifique", icon: Building2 },
    { name: 'Université de Sousse', icon: GraduationCap },
    { name: 'Inscription.tn', icon: FileText },
    { name: 'Orientation.tn', icon: Compass },
  ]

  const formatType = (type) => {
    switch (type) {
      case 'STAGE_ETE': return "Stage d'été"
      case 'ATTESTATION': return 'Attestation'
      case 'RECLAMATION': return 'Réclamation'
      case 'CHANGEMENT_GROUPE': return 'Changement groupe'
      default: return type || 'Demande'
    }
  }

  return (
    <div className="ml-[240px] min-h-screen bg-[#f3f3f3]">
      <div className="h-[60px] border-b border-[#e8e8e8] bg-white" />
      <main className="px-8 pb-10 pt-8">

        {/* Stats rapides */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Total demandes', value: stats.total, color: 'text-[#4479a3]', bg: 'bg-[#eef4fa]' },
            { label: 'En attente', value: stats.enAttente, color: 'text-[#b7791f]', bg: 'bg-[#fff7e6]' },
            { label: 'En cours', value: stats.enCours, color: 'text-[#2b5fb8]', bg: 'bg-[#eaf2ff]' },
            { label: 'Validées', value: stats.validees, color: 'text-[#2f7a45]', bg: 'bg-[#ebf8ef]' },
          ].map((stat, i) => (
            <div key={i} className="rounded-sm border border-[#e4e4e4] bg-white px-5 py-4">
              <div className={`mb-2 inline-flex h-9 w-9 items-center justify-center rounded-full ${stat.bg}`}>
                <span className={`text-[16px] font-bold ${stat.color}`}>{stat.value}</span>
              </div>
              <p className="text-[13px] text-[#6b7280]">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Colonne principale */}
          <section className="col-span-12 xl:col-span-9 space-y-8">

            {/* Demandes récentes */}
            <div>
              <div className="mb-4 flex items-center justify-between rounded-sm border border-[#e5e5e5] bg-white px-4 py-3">
                <h1 className="text-[15px] font-medium text-[#222222]">Mes demandes récentes</h1>
                <button
                  type="button"
                  onClick={() => onNavigate('my-requests')}
                  className="flex items-center gap-1 text-[13px] text-[#4479a3] transition hover:underline"
                >
                  Voir tout <ChevronRight size={14} />
                </button>
              </div>

              {myRequests.length === 0 ? (
                <div className="rounded-sm border border-[#e5e5e5] bg-white px-6 py-8 text-center">
                  <FileText size={32} className="mx-auto mb-3 text-[#c8d5e0]" />
                  <p className="text-[14px] text-[#6b7280]">Aucune demande pour le moment.</p>
                  <button
                    type="button"
                    onClick={() => onNavigate('new-request')}
                    className="mt-4 inline-flex items-center gap-2 rounded-sm bg-[#4479a3] px-4 py-2 text-[13px] font-medium text-white transition hover:bg-[#3d6d92]"
                  >
                    <FilePlus size={15} />
                    Créer une demande
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myRequests.map((item) => {
                    const prettyStatus = formatStatus(item.status)
                    return (
                      <article key={item.id} className="rounded-sm border border-[#e4e4e4] bg-white px-5 py-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[15px] font-medium text-[#222]">
                                {formatType(item.type)}
                              </span>
                            </div>
                            <p className="text-[12px] text-[#7b8794]">Réf : {item.reference}</p>
                            {item.nomEntreprise && (
                              <p className="mt-1 text-[13px] text-[#5f6470]">{item.nomEntreprise}</p>
                            )}
                            <p className="mt-1 text-[12px] text-[#9aa3ad]">
                              {item.createdAt?.replace('T', ' ').slice(0, 16)}
                            </p>
                          </div>
                          <div className="shrink-0">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium ${getStatusStyle(prettyStatus)}`}>
                              {getStatusIcon(prettyStatus)}
                              {prettyStatus}
                            </span>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Accès rapide */}
            <div>
              <div className="mb-4 rounded-sm border border-[#e5e5e5] bg-white px-4 py-3">
                <h2 className="text-[15px] font-medium text-[#222222]">Accès rapide</h2>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[
                  { label: 'Nouvelle demande', icon: FilePlus, key: 'new-request', color: 'text-[#4479a3]', bg: 'bg-[#eef4fa]' },
                  { label: 'Mes demandes', icon: Send, key: 'my-requests', color: 'text-[#2f7a45]', bg: 'bg-[#ebf8ef]' },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => onNavigate(item.key)}
                      className="flex items-center gap-3 rounded-sm border border-[#e4e4e4] bg-white px-4 py-4 text-left transition hover:border-[#4479a3] hover:bg-[#fafcff]"
                    >
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${item.bg} ${item.color}`}>
                        <Icon size={17} />
                      </span>
                      <span className="text-[14px] font-medium text-[#222]">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Actualités */}
            <div>
              <div className="mb-4 rounded-sm border border-[#e5e5e5] bg-white px-4 py-3">
                <h2 className="text-[15px] font-medium text-[#222222]">Actualités</h2>
              </div>
              <div className="space-y-4">
                {actualites.map((actu, idx) => (
                  <article
                    key={idx}
                    className="rounded-sm border border-[#e4e4e4] bg-white px-7 py-3"
                  >
                    <div className="flex items-start gap-10">
                      <div className="mt-1 flex shrink-0 overflow-hidden">
                        <div className="w-[48px] border border-[#e5e5e5]">
                          <div className="flex h-[31px] items-center justify-center bg-[#5f93bf] text-[12px] font-semibold text-white">
                            {actu.month}
                          </div>
                          <div className="flex h-[39px] items-center justify-center bg-[#f7f7f7] text-[12px] text-[#666666]">
                            {actu.day}
                          </div>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1 pt-1">
                        <h3 className="text-[17px] font-medium leading-[1.45] text-[#222222]">
                          {actu.title}
                        </h3>
                        <p className="mt-3 text-[13px] text-[#6d6d6d]">{actu.time}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Sidebar droite */}
          <aside className="col-span-12 space-y-8 xl:col-span-3">
            {/* Profil */}
            <div className="rounded-sm border border-[#e4e4e4] bg-white px-7 py-8">
              <div className="flex flex-col items-center text-center">
                <div className="mb-7 flex h-[106px] w-[106px] items-center justify-center overflow-hidden rounded-full bg-[#efefef] text-[#666666]">
                  <UserRound size={46} strokeWidth={1.7} />
                </div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-[18px] font-medium uppercase text-[#2b2b2b]">
                    {user?.nom || 'ÉTUDIANT'}
                  </h3>
                  <BadgeCheck size={17} className="text-[#3b82f6]" strokeWidth={2} />
                </div>
                <p className="mt-4 text-[14px] text-[#6f6f6f]">Etudiant(e)</p>
                <p className="mt-5 text-[14px] font-medium text-[#5e93bf]">
                  {user?.groupe || '-'}
                </p>
                <button
                  type="button"
                  className="mt-9 inline-flex items-center gap-2 text-[14px] font-medium text-[#1f1f1f] transition-colors hover:text-[#4479a3]"
                >
                  Visiter votre profil
                  <ChevronRight size={16} strokeWidth={2.2} />
                </button>
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
                    <a
                      key={idx}
                      href="#"
                      className="group flex items-start gap-3 text-[14px] leading-9 text-[#5a79a0] transition-colors hover:text-[#4479a3]"
                    >
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

export default StudentDashboard
