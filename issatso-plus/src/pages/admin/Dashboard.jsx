import { useAuth } from '../../contexts/AuthContext'
import { MOCK_REQUESTS, MOCK_STATS } from '../../services/mockData'
import { formatStatus, getStatusStyle, getStatusIcon } from '../../components/common/StatusBadge'
import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  XCircle,
  Briefcase,
  TrendingUp,
  UserRound,
  Settings,
  Users,
  FileText,
} from 'lucide-react'

function AdminDashboard({ onNavigate }) {
  const { user } = useAuth()

  const recentRequests = MOCK_REQUESTS.slice(0, 6)
  const pendingRequests = MOCK_REQUESTS.filter(r => r.status === 'EN_ATTENTE')

  const formatType = (type) => {
    switch (type) {
      case 'STAGE_ETE': return "Stage d'été"
      case 'ATTESTATION': return 'Attestation'
      case 'RECLAMATION': return 'Réclamation'
      case 'CHANGEMENT_GROUPE': return 'Chgt. groupe'
      default: return type || 'Demande'
    }
  }

  return (
    <div className="ml-[240px] min-h-screen bg-[#f3f3f3]">
      <div className="h-[60px] border-b border-[#e8e8e8] bg-white" />
      <main className="px-8 pb-10 pt-8">

        {/* Header */}
        <div className="mb-8 rounded-sm border border-[#e5e5e5] bg-white px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eef4fa] text-[#4479a3]">
                <Settings size={22} strokeWidth={1.7} />
              </div>
              <div>
                <h1 className="text-[16px] font-medium text-[#222]">
                  Tableau de bord administrateur
                </h1>
                <p className="text-[13px] text-[#6b7280]">
                  Vue d'ensemble de l'activité — ISSATSo+
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('admin-requests')}
              className="inline-flex items-center gap-2 rounded-sm bg-[#4479a3] px-4 py-2 text-[13px] font-medium text-white transition hover:bg-[#3d6d92]"
            >
              <ClipboardList size={15} />
              Gérer les demandes
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
          {[
            { label: 'Total', value: MOCK_STATS.total, color: 'text-[#4479a3]', bg: 'bg-[#eef4fa]', icon: ClipboardList },
            { label: 'En attente', value: MOCK_STATS.enAttente, color: 'text-[#b7791f]', bg: 'bg-[#fff7e6]', icon: Clock3 },
            { label: 'En cours', value: MOCK_STATS.enCours, color: 'text-[#2b5fb8]', bg: 'bg-[#eaf2ff]', icon: TrendingUp },
            { label: 'Validées', value: MOCK_STATS.validees, color: 'text-[#2f7a45]', bg: 'bg-[#ebf8ef]', icon: CheckCircle2 },
            { label: 'Refusées', value: MOCK_STATS.refusees, color: 'text-[#b83232]', bg: 'bg-[#fdecec]', icon: XCircle },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="rounded-sm border border-[#e4e4e4] bg-white px-5 py-5">
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${stat.bg} ${stat.color}`}>
                  <Icon size={18} />
                </div>
                <p className={`text-[26px] font-semibold ${stat.color}`}>{stat.value}</p>
                <p className="text-[13px] text-[#6b7280]">{stat.label}</p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Demandes récentes */}
          <section className="col-span-12 xl:col-span-8">
            <div className="mb-4 flex items-center justify-between rounded-sm border border-[#e5e5e5] bg-white px-4 py-3">
              <h2 className="text-[15px] font-medium text-[#222222]">Toutes les demandes récentes</h2>
              <button
                type="button"
                onClick={() => onNavigate('admin-requests')}
                className="text-[13px] text-[#4479a3] transition hover:underline"
              >
                Voir & traiter →
              </button>
            </div>
            <div className="space-y-3">
              {recentRequests.map((item) => {
                const prettyStatus = formatStatus(item.status)
                return (
                  <article key={item.id} className="rounded-sm border border-[#e4e4e4] bg-white px-5 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef4fa] text-[#4479a3]">
                          <Briefcase size={14} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] font-medium text-[#222] truncate">
                              {formatType(item.type)}
                            </span>
                            <span className="text-[12px] text-[#9aa3ad] shrink-0">— {item.reference}</span>
                          </div>
                          <p className="text-[12px] text-[#7b8794]">
                            {item.studentNom} · {item.groupe || '-'} · {item.createdAt?.replace('T', ' ').slice(0, 10)}
                          </p>
                        </div>
                      </div>
                      <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium ${getStatusStyle(prettyStatus)}`}>
                        {getStatusIcon(prettyStatus)}
                        {prettyStatus}
                      </span>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          {/* Aside */}
          <aside className="col-span-12 xl:col-span-4 space-y-8">
            {/* En attente */}
            <div className="rounded-sm border border-[#e4e4e4] bg-white px-5 py-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[15px] font-medium text-[#222]">À traiter en priorité</h3>
                <span className="rounded-full bg-[#fff7e6] px-2 py-0.5 text-[12px] font-medium text-[#b7791f]">
                  {pendingRequests.length}
                </span>
              </div>
              {pendingRequests.length === 0 ? (
                <p className="text-[13px] text-[#6b7280]">Aucune demande en attente.</p>
              ) : (
                <div className="space-y-3">
                  {pendingRequests.slice(0, 4).map((req) => (
                    <div key={req.id} className="rounded-sm border border-[#f0f0f0] bg-[#fafafa] px-3 py-2.5">
                      <p className="text-[13px] font-medium text-[#333]">{req.studentNom}</p>
                      <p className="text-[12px] text-[#7b8794]">{formatType(req.type)} — {req.reference}</p>
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => onNavigate('admin-requests')}
                className="mt-4 w-full rounded-sm border border-[#d7d7d7] bg-white py-2 text-[13px] font-medium text-[#333] transition hover:bg-[#f7f7f7]"
              >
                Traiter les demandes
              </button>
            </div>

            {/* Répartition */}
            <div className="rounded-sm border border-[#e4e4e4] bg-white px-5 py-5">
              <h3 className="mb-5 text-[15px] font-medium text-[#222]">Répartition par type</h3>
              <div className="space-y-4">
                {MOCK_STATS.parType.map((item, i) => (
                  <div key={i}>
                    <div className="mb-1 flex items-center justify-between text-[13px]">
                      <span className="text-[#5f6470]">{item.type}</span>
                      <span className="font-medium text-[#333]">{item.count}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#f0f0f0]">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${(item.count / MOCK_STATS.total) * 100}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Évolution */}
            <div className="rounded-sm border border-[#e4e4e4] bg-white px-5 py-5">
              <h3 className="mb-4 text-[15px] font-medium text-[#222]">Évolution mensuelle</h3>
              <div className="flex items-end justify-between gap-1 h-[80px]">
                {MOCK_STATS.evolution.map((item, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-[10px] text-[#9aa3ad]">{item.count}</span>
                    <div
                      className="w-full rounded-t-sm bg-[#4479a3] opacity-80 transition-all hover:opacity-100"
                      style={{ height: `${(item.count / 10) * 60}px` }}
                    />
                    <span className="text-[10px] text-[#9aa3ad]">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
