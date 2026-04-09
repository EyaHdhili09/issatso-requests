import { Clock3, CheckCircle2, XCircle, FileText } from 'lucide-react'

export function formatStatus(status) {
  switch (status) {
    case 'EN_ATTENTE': return 'En attente'
    case 'EN_COURS': return 'En cours'
    case 'VALIDEE': return 'Validée'
    case 'REFUSEE': return 'Refusée'
    case 'BROUILLON': return 'Brouillon'
    default: return status || 'Inconnu'
  }
}

export function getStatusStyle(status) {
  switch (status) {
    case 'En attente': return 'bg-[#fff7e6] text-[#b7791f]'
    case 'En cours': return 'bg-[#eaf2ff] text-[#2b5fb8]'
    case 'Validée': return 'bg-[#ebf8ef] text-[#2f7a45]'
    case 'Refusée': return 'bg-[#fdecec] text-[#b83232]'
    case 'Brouillon': return 'bg-[#f3f4f6] text-[#6b7280]'
    default: return 'bg-[#f3f4f6] text-[#6b7280]'
  }
}

export function getStatusIcon(status) {
  switch (status) {
    case 'En attente':
    case 'En cours':
      return <Clock3 size={14} />
    case 'Validée':
      return <CheckCircle2 size={14} />
    case 'Refusée':
      return <XCircle size={14} />
    default:
      return <FileText size={14} />
  }
}

export default function StatusBadge({ status }) {
  const pretty = formatStatus(status)
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-medium ${getStatusStyle(pretty)}`}>
      {getStatusIcon(pretty)}
      {pretty}
    </span>
  )
}
