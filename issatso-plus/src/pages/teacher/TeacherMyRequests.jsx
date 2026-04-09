import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getMyTeacherRequests } from '../../services/requestApi'
import {
  Search, Filter, Loader2, Eye,
  Plane, Monitor, FileCheck, AlertCircle, FileText,
} from 'lucide-react'
import { formatStatus, getStatusStyle, getStatusIcon } from '../../components/common/StatusBadge'

const TYPE_LABELS = {
  CONGE_FORMATION: 'Congé / Mission de formation',
  DEMANDE_MATERIEL: 'Demande de matériel',
  ATTESTATION_SERVICE: 'Attestation de service',
  RECLAMATION_ADMIN: 'Réclamation administrative',
  AUTRE: 'Autre demande',
}

const TYPE_ICONS = {
  CONGE_FORMATION: Plane,
  DEMANDE_MATERIEL: Monitor,
  ATTESTATION_SERVICE: FileCheck,
  RECLAMATION_ADMIN: AlertCircle,
  AUTRE: FileText,
}

function TeacherMyRequests({ onOpenDetails }) {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tous')
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        setErrorMessage('')
        const data = await getMyTeacherRequests(user.cin)
        setRequests(data)
      } catch (err) {
        setErrorMessage(err.message || 'Erreur lors du chargement.')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [user])

  const filtered = useMemo(() => {
    return requests.filter((item) => {
      const matchSearch =
        item.intitule?.toLowerCase().includes(search.toLowerCase()) ||
        item.reference?.toLowerCase().includes(search.toLowerCase()) ||
        item.justification?.toLowerCase().includes(search.toLowerCase())
      const matchStatus =
        statusFilter === 'Tous' ? true : formatStatus(item.status) === statusFilter
      return matchSearch && matchStatus
    })
  }, [requests, search, statusFilter])

  return (
    <div className="ml-[240px] min-h-screen bg-[#f3f3f3]">
      <div className="h-[60px] border-b border-[#e8e8e8] bg-white" />
      <main className="px-8 pb-10 pt-8">
        <div className="mb-8 rounded-sm border border-[#e5e5e5] bg-white px-5 py-4">
          <h1 className="text-[16px] font-medium text-[#222222]">Mes demandes</h1>
          <p className="mt-2 text-[13px] text-[#6b7280]">
            Consultez l'état d'avancement de vos demandes administratives.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6f7b88]" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une demande..."
                className="w-full rounded-sm border border-[#d6dbe1] bg-[#fcfcfd] py-3 pl-10 pr-4 text-[14px] text-[#222] outline-none transition placeholder:text-[#9aa3ad] focus:border-[#4479a3] focus:bg-white" />
            </div>
            <div className="relative">
              <Filter size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6f7b88]" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-sm border border-[#d6dbe1] bg-[#fcfcfd] py-3 pl-10 pr-4 text-[14px] text-[#222] outline-none transition focus:border-[#4479a3] focus:bg-white">
                <option>Tous</option>
                <option>En attente</option>
                <option>En cours</option>
                <option>Validée</option>
                <option>Refusée</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-sm border border-[#e5e5e5] bg-white px-6 py-10 text-center">
            <div className="inline-flex items-center gap-2 text-[14px] text-[#6b7280]">
              <Loader2 size={18} className="animate-spin" />
              Chargement des demandes...
            </div>
          </div>
        ) : errorMessage ? (
          <div className="rounded-sm border border-[#f3caca] bg-[#fdecec] px-6 py-4 text-[14px] text-[#b83232]">
            {errorMessage}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-sm border border-[#e5e5e5] bg-white px-6 py-10 text-center">
            <p className="text-[14px] text-[#6b7280]">Aucune demande ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((item) => {
              const prettyStatus = formatStatus(item.status)
              const Icon = TYPE_ICONS[item.type] || FileText
              return (
                <article key={item.id} className="rounded-sm border border-[#e4e4e4] bg-white px-6 py-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef4fa] text-[#4479a3]">
                          <Icon size={18} />
                        </div>
                        <div>
                          <h2 className="text-[17px] font-medium text-[#222222]">
                            {TYPE_LABELS[item.type] || item.type}
                          </h2>
                          <p className="mt-1 text-[12px] text-[#7b8794]">Référence : {item.reference}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-[14px] font-medium text-[#333]">{item.intitule}</p>
                      <p className="mt-2 text-[13px] leading-6 text-[#5f6470] line-clamp-2">
                        {item.justification}
                      </p>
                      <div className="mt-3 space-y-1 text-[13px] text-[#7b8794]">
                        {item.lieu && <p>Lieu : {item.lieu}</p>}
                        {item.dateDebut && <p>Période : {item.dateDebut} → {item.dateFin}</p>}
                        <p>Date de soumission : {item.createdAt?.replace('T', ' ').slice(0, 16)}</p>
                      </div>
                      {item.adminComment && (
                        <div className="mt-3 rounded-sm border border-[#ececec] bg-[#fafafa] px-3 py-2 text-[13px] text-[#5f6470]">
                          <span className="font-medium text-[#333]">Commentaire admin :</span> {item.adminComment}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-start gap-3 lg:items-end">
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-medium ${getStatusStyle(prettyStatus)}`}>
                        {getStatusIcon(prettyStatus)}
                        {prettyStatus}
                      </span>
                      <button type="button" onClick={() => onOpenDetails(item.id)}
                        className="inline-flex items-center gap-2 rounded-sm border border-[#d7d7d7] bg-white px-4 py-2 text-[14px] font-medium text-[#333] transition hover:bg-[#f7f7f7]">
                        <Eye size={16} />
                        Voir détail
                      </button>
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

export default TeacherMyRequests
