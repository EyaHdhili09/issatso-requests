import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ text = 'Chargement...' }) {
  return (
    <div className="rounded-sm border border-[#e5e5e5] bg-white px-6 py-10 text-center">
      <div className="inline-flex items-center gap-2 text-[14px] text-[#6b7280]">
        <Loader2 size={18} className="animate-spin" />
        {text}
      </div>
    </div>
  )
}
