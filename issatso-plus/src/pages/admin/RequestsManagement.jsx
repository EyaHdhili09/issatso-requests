import { useEffect, useMemo, useState } from 'react'
import {
  Search, Filter, Loader2, Briefcase, FileText,
  PlayCircle, Check, X, Eye, ChevronDown, ChevronUp,
  GraduationCap, BookOpen, Plane, Monitor, FileCheck, AlertCircle, Users,
} from 'lucide-react'
import { getAllAdminRequests, updateRequestStatus } from '../../services/requestApi'
import { formatStatus, getStatusStyle, getStatusIcon } from '../../components/common/StatusBadge'

const STUDENT_TYPE_LABELS = {
  STAGE_ETE: "Demande de stage d'été",
  CHANGEMENT_GROUPE: 'Demande de changement de groupe',
  ATTESTATION: "Demande d'attestation",
  RECLAMATION: 'Réclamation administrative',
}
const TEACHER_TYPE_LABELS = {
  CONGE_FORMATION: 'Congé / Mission de formation',
  DEMANDE_MATERIEL: 'Demande de matériel',
  ATTESTATION_SERVICE: 'Attestation de service',
  RECLAMATION_ADMIN: 'Réclamation administrative',
  AUTRE: 'Autre demande',
}
const TEACHER_TYPE_ICONS = {
  CONGE_FORMATION: Plane,
  DEMANDE_MATERIEL: Monitor,
  ATTESTATION_SERVICE: FileCheck,
  RECLAMATION_ADMIN: AlertCircle,
  AUTRE: FileText,
}

function formatTypeLabel(type, role) {
  if (role === 'TEACHER') return TEACHER_TYPE_LABELS[type] || type
  return STUDENT_TYPE_LABELS[type] || type
}

// ---- Barre d'actions ----
function ActionBar({ item, isBusy, onStatusUpdate, commentInput, onCommentChange, isExpanded, onToggleExpand, defaults }) {
  return (
    <div>
      <button type="button" onClick={() => onToggleExpand(item.id)}
        className="mb-3 inline-flex items-center gap-1.5 text-[12px] text-[#7b8794] transition hover:text-[#4479a3]">
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {isExpanded ? 'Masquer le commentaire' : 'Ajouter un commentaire (optionnel)'}
      </button>
      {isExpanded && (
        <div className="mb-3">
          <textarea value={commentInput || ''} onChange={(e) => onCommentChange(item.id, e.target.value)}
            rows={2} placeholder="Commentaire administratif..."
            className="w-full rounded-sm border border-[#d8d8d8] bg-white px-3 py-2 text-[13px] text-[#333] outline-none transition focus:border-[#4479a3]" />
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        <button type="button" disabled={isBusy} onClick={() => onStatusUpdate(item.id, 'EN_COURS', defaults.enCours)}
          className="inline-flex items-center gap-2 rounded-sm border border-[#cfe0ff] bg-[#eef4ff] px-4 py-2 text-[14px] font-medium text-[#2b5fb8] transition hover:bg-[#e5efff] disabled:opacity-60">
          {isBusy ? <Loader2 size={14} className="animate-spin" /> : <PlayCircle size={16} />}
          Mettre en cours
        </button>
        <button type="button" disabled={isBusy} onClick={() => onStatusUpdate(item.id, 'VALIDEE', defaults.validee)}
          className="inline-flex items-center gap-2 rounded-sm border border-[#d3ead8] bg-[#edf8f0] px-4 py-2 text-[14px] font-medium text-[#2f7a45] transition hover:bg-[#e4f5e8] disabled:opacity-60">
          {isBusy ? <Loader2 size={14} className="animate-spin" /> : <Check size={16} />}
          Valider
        </button>
        <button type="button" disabled={isBusy} onClick={() => onStatusUpdate(item.id, 'REFUSEE', defaults.refusee)}
          className="inline-flex items-center gap-2 rounded-sm border border-[#f1cccc] bg-[#fdecec] px-4 py-2 text-[14px] font-medium text-[#b83232] transition hover:bg-[#fce4e4] disabled:opacity-60">
          {isBusy ? <Loader2 size={14} className="animate-spin" /> : <X size={16} />}
          Refuser
        </button>
      </div>
    </div>
  )
}

// ---- Carte Étudiant ----
function StudentCard({ item, isBusy, onStatusUpdate, commentInput, onCommentChange, isExpanded, onToggleExpand, onOpenDetails }) {
  const prettyStatus = formatStatus(item.status)
  return (
    <article className="rounded-sm border border-[#e4e4e4] bg-white px-6 py-5">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef4fa] text-[#4479a3]">
                <Briefcase size={18} />
              </div>
              <div>
                <h2 className="text-[17px] font-medium text-[#222222]">{formatTypeLabel(item.type, 'STUDENT')}</h2>
                <p className="mt-1 text-[12px] text-[#7b8794]">Référence : {item.reference}</p>
              </div>
            </div>
            <div className="mt-3 space-y-1 text-[14px] leading-7 text-[#5f6470]">
              <p><span className="font-medium text-[#333]">Étudiant :</span> {item.studentNom}</p>
              <p><span className="font-medium text-[#333]">CIN :</span> {item.studentCin}</p>
              <p><span className="font-medium text-[#333]">Groupe :</span> {item.groupe || '-'}</p>
              {item.nomEntreprise && <p><span className="font-medium text-[#333]">Entreprise :</span> {item.nomEntreprise}</p>}
              <p><span className="font-medium text-[#333]">Commentaire :</span> {item.studentComment || '-'}</p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 lg:items-end shrink-0">
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-medium ${getStatusStyle(prettyStatus)}`}>
              {getStatusIcon(prettyStatus)}{prettyStatus}
            </span>
            <p className="text-[12px] text-[#7b8794]">Créée le : {item.createdAt?.replace('T', ' ').slice(0, 16) || '-'}</p>
            {onOpenDetails && (
              <button type="button" onClick={() => onOpenDetails(item.id)}
                className="inline-flex items-center gap-1.5 text-[13px] text-[#4479a3] hover:underline">
                <Eye size={14} /> Voir détail
              </button>
            )}
          </div>
        </div>
        <ActionBar item={item} isBusy={isBusy} onStatusUpdate={onStatusUpdate} commentInput={commentInput} onCommentChange={onCommentChange} isExpanded={isExpanded} onToggleExpand={onToggleExpand}
          defaults={{ enCours: 'Demande en cours de traitement.', validee: "Demande validée par l'administration.", refusee: "Demande refusée par l'administration." }} />
        {item.adminComment && (
          <div className="rounded-sm border border-[#ececec] bg-[#fafafa] px-4 py-3 text-[13px] text-[#5f6470]">
            <span className="font-medium text-[#333]">Commentaire admin :</span> {item.adminComment}
          </div>
        )}
      </div>
    </article>
  )
}

// ---- Carte Enseignant ----
function TeacherCard({ item, isBusy, onStatusUpdate, commentInput, onCommentChange, isExpanded, onToggleExpand }) {
  const prettyStatus = formatStatus(item.status)
  const Icon = TEACHER_TYPE_ICONS[item.type] || FileText
  return (
    <article className="rounded-sm border border-[#e4e4e4] bg-white px-6 py-5">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0f8f0] text-[#2f7a45]">
                <Icon size={18} />
              </div>
              <div>
                <h2 className="text-[17px] font-medium text-[#222222]">{formatTypeLabel(item.type, 'TEACHER')}</h2>
                <p className="mt-1 text-[12px] text-[#7b8794]">Référence : {item.reference}</p>
              </div>
            </div>
            <div className="mt-3 space-y-1 text-[14px] leading-7 text-[#5f6470]">
              <p><span className="font-medium text-[#333]">Enseignant :</span> {item.submitterNom}</p>
              <p><span className="font-medium text-[#333]">Grade :</span> {item.grade || '-'}</p>
              <p><span className="font-medium text-[#333]">Département :</span> {item.departement || '-'}</p>
              <p><span className="font-medium text-[#333]">Intitulé :</span> {item.intitule}</p>
              {item.lieu && <p><span className="font-medium text-[#333]">Lieu :</span> {item.lieu}</p>}
              {item.dateDebut && <p><span className="font-medium text-[#333]">Période :</span> {item.dateDebut} → {item.dateFin}</p>}
              {item.financementDemande && (
                <p><span className="font-medium text-[#333]">Financement demandé :</span> {item.montantEstime || 'Oui'}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 lg:items-end shrink-0">
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-medium ${getStatusStyle(prettyStatus)}`}>
              {getStatusIcon(prettyStatus)}{prettyStatus}
            </span>
            <p className="text-[12px] text-[#7b8794]">Créée le : {item.createdAt?.replace('T', ' ').slice(0, 16) || '-'}</p>
          </div>
        </div>
        <ActionBar item={item} isBusy={isBusy} onStatusUpdate={onStatusUpdate} commentInput={commentInput} onCommentChange={onCommentChange} isExpanded={isExpanded} onToggleExpand={onToggleExpand}
          defaults={{ enCours: 'Demande en cours de traitement.', validee: "Demande approuvée par l'administration.", refusee: "Demande refusée par l'administration." }} />
        {item.adminComment && (
          <div className="rounded-sm border border-[#ececec] bg-[#fafafa] px-4 py-3 text-[13px] text-[#5f6470]">
            <span className="font-medium text-[#333]">Commentaire admin :</span> {item.adminComment}
          </div>
        )}
      </div>
    </article>
  )
}

// ============================================================
// Page principale
// ============================================================
function RequestsManagement({ onOpenDetails }) {
  const [requests, setRequests] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tous')
  const [typeFilter, setTypeFilter] = useState('Tous')
  const [roleFilter, setRoleFilter] = useState('Tous')
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [commentInputs, setCommentInputs] = useState({})

  const fetchRequests = async () => {
    try {
      setLoading(true)
      setErrorMessage('')
      const data = await getAllAdminRequests()
      setRequests(data)
    } catch (error) {
      setErrorMessage(error.message || 'Erreur lors du chargement.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRequests() }, [])

  const studentCount = requests.filter(r => r.submitterRole !== 'TEACHER').length
  const teacherCount = requests.filter(r => r.submitterRole === 'TEACHER').length

  const filteredRequests = useMemo(() => {
    return requests.filter((item) => {
      const isTeacher = item.submitterRole === 'TEACHER'
      if (roleFilter === 'STUDENT' && isTeacher) return false
      if (roleFilter === 'TEACHER' && !isTeacher) return false
      if (statusFilter !== 'Tous' && formatStatus(item.status) !== statusFilter) return false
      if (typeFilter !== 'Tous' && item.type !== typeFilter) return false
      const text = [
        item.reference, item.type,
        item.studentNom, item.studentCin,
        item.submitterNom, item.submitterCin,
        item.nomEntreprise, item.studentComment,
        item.intitule, item.justification,
        item.departement, item.grade,
      ].filter(Boolean).join(' ').toLowerCase()
      return text.includes(search.toLowerCase())
    })
  }, [requests, search, statusFilter, typeFilter, roleFilter])

  const handleStatusUpdate = async (requestId, status, defaultComment) => {
    const adminComment = commentInputs[requestId]?.trim() || defaultComment
    try {
      setActionLoadingId(requestId)
      await updateRequestStatus(requestId, { status, adminComment, actorName: 'Admin ISSATSo' })
      await fetchRequests()
      setCommentInputs(prev => ({ ...prev, [requestId]: '' }))
    } catch (error) {
      alert(error.message || 'Erreur lors de la mise à jour.')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleToggleExpand = (id) => setExpandedId(prev => prev === id ? null : id)
  const handleCommentChange = (id, value) => setCommentInputs(prev => ({ ...prev, [id]: value }))

  return (
    <div className="ml-[240px] min-h-screen bg-[#f3f3f3]">
      <div className="h-[60px] border-b border-[#e8e8e8] bg-white" />
      <main className="px-8 pb-10 pt-8">

        <div className="mb-8 rounded-sm border border-[#e5e5e5] bg-white px-5 py-4">
          <h1 className="text-[16px] font-medium text-[#222222]">Gestion des demandes</h1>
          <p className="mt-2 text-[13px] text-[#6b7280]">
            Consultation et traitement de toutes les demandes — étudiants et enseignants.
          </p>

          {/* Onglets rôle */}
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              { label: 'Tous', value: 'Tous', count: requests.length, icon: Users },
              { label: 'Étudiants', value: 'STUDENT', count: studentCount, icon: GraduationCap },
              { label: 'Enseignants', value: 'TEACHER', count: teacherCount, icon: BookOpen },
            ].map((tab) => {
              const Icon = tab.icon
              const active = roleFilter === tab.value
              return (
                <button key={tab.value} type="button"
                  onClick={() => { setRoleFilter(tab.value); setTypeFilter('Tous') }}
                  className={`inline-flex items-center gap-2 rounded-sm border px-4 py-2 text-[13px] font-medium transition ${
                    active ? 'border-[#4479a3] bg-[#eef4fa] text-[#4479a3]' : 'border-[#e0e0e0] bg-white text-[#5f6470] hover:bg-[#f5f7f9]'
                  }`}>
                  <Icon size={14} />
                  {tab.label}
                  <span className={`rounded-full px-2 py-0.5 text-[11px] ${active ? 'bg-[#4479a3] text-white' : 'bg-[#f0f0f0] text-[#7b8794]'}`}>
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Filtres */}
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_180px_200px]">
            <div className="relative">
              <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6f7b88]" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par nom, référence, CIN..."
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
            <div className="relative">
              <FileText size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6f7b88]" />
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full appearance-none rounded-sm border border-[#d6dbe1] bg-[#fcfcfd] py-3 pl-10 pr-4 text-[14px] text-[#222] outline-none transition focus:border-[#4479a3] focus:bg-white">
                <option value="Tous">Tous types</option>
                {(roleFilter === 'Tous' || roleFilter === 'STUDENT') && (<>
                  <option value="STAGE_ETE">Stage d'été</option>
                  <option value="ATTESTATION">Attestation étudiant</option>
                  <option value="RECLAMATION">Réclamation étudiant</option>
                  <option value="CHANGEMENT_GROUPE">Changement de groupe</option>
                </>)}
                {(roleFilter === 'Tous' || roleFilter === 'TEACHER') && (<>
                  <option value="CONGE_FORMATION">Congé / Formation</option>
                  <option value="DEMANDE_MATERIEL">Demande matériel</option>
                  <option value="ATTESTATION_SERVICE">Attestation service</option>
                  <option value="RECLAMATION_ADMIN">Réclamation enseignant</option>
                  <option value="AUTRE">Autre</option>
                </>)}
              </select>
            </div>
          </div>
          <p className="mt-3 text-[12px] text-[#9aa3ad]">
            {filteredRequests.length} demande(s) affichée(s) sur {requests.length}
          </p>
        </div>

        {loading ? (
          <div className="rounded-sm border border-[#e5e5e5] bg-white px-6 py-10 text-center">
            <div className="inline-flex items-center gap-2 text-[14px] text-[#6b7280]">
              <Loader2 size={18} className="animate-spin" /> Chargement...
            </div>
          </div>
        ) : errorMessage ? (
          <div className="rounded-sm border border-[#f3caca] bg-[#fdecec] px-6 py-4 text-[14px] text-[#b83232]">
            {errorMessage}
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="rounded-sm border border-[#e5e5e5] bg-white px-6 py-10 text-center">
            <p className="text-[14px] text-[#6b7280]">Aucune demande ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRequests.map((item) => {
              const props = {
                key: item.id, item, isBusy: actionLoadingId === item.id,
                onStatusUpdate: handleStatusUpdate,
                commentInput: commentInputs[item.id],
                onCommentChange: handleCommentChange,
                isExpanded: expandedId === item.id,
                onToggleExpand: handleToggleExpand,
              }
              return item.submitterRole === 'TEACHER'
                ? <TeacherCard {...props} />
                : <StudentCard {...props} onOpenDetails={onOpenDetails} />
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default RequestsManagement
