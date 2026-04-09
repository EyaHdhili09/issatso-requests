import { useEffect, useState } from 'react'
import { getRequestById } from '../../services/requestApi'
import {
  ArrowLeft, Loader2, FileText,
  Plane, Monitor, FileCheck, AlertCircle, UserRound, CalendarDays,
} from 'lucide-react'
import { formatStatus, getStatusStyle, getStatusIcon } from '../../components/common/StatusBadge'

const TYPE_LABELS = {
  CONGE_FORMATION: 'Congé / Mission de formation',
  DEMANDE_MATERIEL: 'Demande de matériel',
  ATTESTATION_SERVICE: 'Attestation de service',
  RECLAMATION_ADMIN: 'Réclamation administrative',
  AUTRE: 'Autre demande administrative',
}

const TYPE_ICONS = {
  CONGE_FORMATION: Plane,
  DEMANDE_MATERIEL: Monitor,
  ATTESTATION_SERVICE: FileCheck,
  RECLAMATION_ADMIN: AlertCircle,
  AUTRE: FileText,
}

function TeacherRequestDetails({ requestId, onBack }) {
  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        setErrorMessage('')
        const data = await getRequestById(requestId)
        setRequest(data)
      } catch (err) {
        setErrorMessage(err.message || 'Erreur lors du chargement.')
      } finally {
        setLoading(false)
      }
    }
    if (requestId) fetch()
  }, [requestId])

  const prettyStatus = request ? formatStatus(request.status) : ''
  const Icon = request ? (TYPE_ICONS[request.type] || FileText) : FileText

  const getTimeline = (req) => {
    const events = []
    if (req.createdAt) events.push({ date: req.createdAt.replace('T', ' ').slice(0, 16), label: 'Demande soumise', color: 'bg-[#4479a3]' })
    if (req.status === 'EN_COURS' || req.status === 'VALIDEE' || req.status === 'REFUSEE')
      events.push({ date: req.updatedAt?.replace('T', ' ').slice(0, 16) || '-', label: 'Prise en charge', color: 'bg-[#2b5fb8]' })
    if (req.status === 'VALIDEE')
      events.push({ date: req.updatedAt?.replace('T', ' ').slice(0, 16) || '-', label: 'Demande validée', color: 'bg-[#2f7a45]' })
    if (req.status === 'REFUSEE')
      events.push({ date: req.updatedAt?.replace('T', ' ').slice(0, 16) || '-', label: 'Demande refusée', color: 'bg-[#b83232]' })
    return events
  }

  return (
    <div className="ml-[240px] min-h-screen bg-[#f3f3f3]">
      <div className="h-[60px] border-b border-[#e8e8e8] bg-white" />
      <main className="px-8 pb-10 pt-8">
        <div className="mb-8 rounded-sm border border-[#e5e5e5] bg-white px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-[16px] font-medium text-[#222222]">Détail de la demande</h1>
              <p className="mt-2 text-[13px] text-[#6b7280]">Informations complètes de votre demande.</p>
            </div>
            <button type="button" onClick={onBack}
              className="inline-flex items-center gap-2 rounded-sm border border-[#d7d7d7] bg-white px-4 py-2 text-[14px] font-medium text-[#333] transition hover:bg-[#f7f7f7]">
              <ArrowLeft size={16} />
              Retour
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-sm border border-[#e5e5e5] bg-white px-6 py-10 text-center">
            <div className="inline-flex items-center gap-2 text-[14px] text-[#6b7280]">
              <Loader2 size={18} className="animate-spin" />
              Chargement...
            </div>
          </div>
        ) : errorMessage ? (
          <div className="rounded-sm border border-[#f3caca] bg-[#fdecec] px-6 py-4 text-[14px] text-[#b83232]">
            {errorMessage}
          </div>
        ) : request ? (
          <div className="grid grid-cols-12 gap-8">
            <section className="col-span-12 xl:col-span-8 space-y-8">

              {/* En-tête */}
              <div className="rounded-sm border border-[#e4e4e4] bg-white px-6 py-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef4fa] text-[#4479a3]">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h2 className="text-[17px] font-medium text-[#222]">
                      {TYPE_LABELS[request.type] || request.type}
                    </h2>
                    <p className="mt-1 text-[12px] text-[#7b8794]">Référence : {request.reference}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-[14px] text-[#5f6470]">
                  <p><span className="font-medium text-[#333]">Nom :</span> {request.submitterNom}</p>
                  <p><span className="font-medium text-[#333]">Grade :</span> {request.grade || '-'}</p>
                  <p><span className="font-medium text-[#333]">Département :</span> {request.departement || '-'}</p>
                  <p><span className="font-medium text-[#333]">Date de soumission :</span> {request.createdAt?.replace('T', ' ').slice(0, 16)}</p>
                </div>
              </div>

              {/* Détails demande */}
              <div className="rounded-sm border border-[#e4e4e4] bg-white px-6 py-6">
                <h3 className="mb-5 flex items-center gap-2 text-[16px] font-medium text-[#222]">
                  <FileText size={18} />
                  Détails
                </h3>
                <div className="space-y-4 text-[14px] text-[#5f6470]">
                  <p><span className="font-medium text-[#333]">Intitulé :</span> {request.intitule}</p>
                  {request.lieu && <p><span className="font-medium text-[#333]">Lieu :</span> {request.lieu}</p>}
                  {request.dateDebut && (
                    <p><span className="font-medium text-[#333]">Période :</span> {request.dateDebut} → {request.dateFin}</p>
                  )}
                  {request.financementDemande && (
                    <p><span className="font-medium text-[#333]">Financement demandé :</span> Oui — {request.montantEstime || 'montant non précisé'}</p>
                  )}
                  <div>
                    <p className="font-medium text-[#333] mb-2">Justification :</p>
                    <p className="leading-7 whitespace-pre-line">{request.justification}</p>
                  </div>
                  {request.documentsJoints && request.documentsJoints.length > 0 && (
                    <div>
                      <p className="font-medium text-[#333] mb-2">Documents joints :</p>
                      <ul className="space-y-1">
                        {request.documentsJoints.map((doc, i) => (
                          <li key={i} className="flex items-center gap-2 text-[13px]">
                            <FileText size={13} className="text-[#4479a3]" />
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <aside className="col-span-12 xl:col-span-4 space-y-8">
              {/* Statut */}
              <div className="rounded-sm border border-[#e4e4e4] bg-white px-5 py-5">
                <h3 className="mb-4 text-[15px] font-medium text-[#222]">Statut</h3>
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-medium ${getStatusStyle(prettyStatus)}`}>
                  {getStatusIcon(prettyStatus)}
                  {prettyStatus}
                </span>
                <div className="mt-5 space-y-3 text-[13px] leading-6 text-[#5f6470]">
                  <p>
                    <span className="font-medium text-[#333]">Dernière mise à jour :</span>{' '}
                    {request.updatedAt?.replace('T', ' ').slice(0, 16) || '-'}
                  </p>
                  <p>
                    <span className="font-medium text-[#333]">Commentaire admin :</span>{' '}
                    {request.adminComment || 'Aucun commentaire.'}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="rounded-sm border border-[#e4e4e4] bg-white px-5 py-5">
                <h3 className="mb-5 text-[15px] font-medium text-[#222]">Historique</h3>
                <div className="relative space-y-5 pl-5">
                  <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-[#e8e8e8]" />
                  {getTimeline(request).map((event, i) => (
                    <div key={i} className="relative flex items-start gap-3">
                      <span className={`absolute -left-[13px] top-[5px] h-[8px] w-[8px] rounded-full ${event.color}`} />
                      <div>
                        <p className="text-[13px] font-medium text-[#333]">{event.label}</p>
                        <p className="text-[12px] text-[#9aa3ad]">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        ) : null}
      </main>
    </div>
  )
}

export default TeacherRequestDetails
