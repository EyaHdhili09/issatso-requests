import { MOCK_TEACHER_SCHEDULE } from '../../services/mockData'
import { CalendarDays } from 'lucide-react'

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']

const typeStyles = {
  CM: { bg: 'bg-[#dbeafe] border-[#93c5fd] text-[#1e40af]', badge: 'bg-[#4479a3] text-white' },
  TD: { bg: 'bg-[#fef3c7] border-[#fcd34d] text-[#92400e]', badge: 'bg-[#b7791f] text-white' },
  TP: { bg: 'bg-[#d1fae5] border-[#6ee7b7] text-[#065f46]', badge: 'bg-[#2f7a45] text-white' },
}

function TeacherSchedule() {
  const scheduleByDay = JOURS.reduce((acc, jour) => {
    acc[jour] = MOCK_TEACHER_SCHEDULE.filter((s) => s.jour === jour)
    return acc
  }, {})

  return (
    <div className="ml-[240px] min-h-screen bg-[#f3f3f3]">
      <div className="h-[60px] border-b border-[#e8e8e8] bg-white" />
      <main className="px-8 pb-10 pt-8">
        <div className="mb-8 rounded-sm border border-[#e5e5e5] bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <CalendarDays size={18} className="text-[#4479a3]" />
            <div>
              <h1 className="text-[16px] font-medium text-[#222222]">Mon emploi du temps</h1>
              <p className="mt-1 text-[13px] text-[#6b7280]">
                Semestre en cours — Année universitaire 2024-2025
              </p>
            </div>
          </div>

          {/* Légende */}
          <div className="mt-4 flex flex-wrap gap-3">
            {Object.entries(typeStyles).map(([type, style]) => (
              <span key={type} className={`inline-flex items-center gap-1.5 rounded-sm px-3 py-1 text-[12px] font-medium border ${style.bg}`}>
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Grille par jour */}
        <div className="space-y-6">
          {JOURS.map((jour) => {
            const seances = scheduleByDay[jour]
            return (
              <div key={jour}>
                <div className="mb-3 flex items-center gap-3">
                  <h2 className="text-[15px] font-semibold text-[#222]">{jour}</h2>
                  <div className="flex-1 border-t border-[#e8e8e8]" />
                  {seances.length === 0 && (
                    <span className="text-[12px] text-[#c0c0c0]">Aucune séance</span>
                  )}
                </div>

                {seances.length === 0 ? null : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {seances
                      .sort((a, b) => a.heureDebut.localeCompare(b.heureDebut))
                      .map((seance, i) => {
                        const style = typeStyles[seance.type] || typeStyles.CM
                        return (
                          <div
                            key={i}
                            className={`rounded-sm border px-5 py-4 ${style.bg}`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <div className="text-[13px] font-semibold">
                                {seance.heureDebut} – {seance.heureFin}
                              </div>
                              <span className={`rounded-sm px-2 py-0.5 text-[11px] font-bold ${style.badge}`}>
                                {seance.type}
                              </span>
                            </div>
                            <p className="text-[14px] font-medium leading-5 mb-2">
                              {seance.module}
                            </p>
                            <p className="text-[12px] opacity-80">{seance.groupe}</p>
                            <p className="mt-1 text-[12px] opacity-70">Salle : {seance.salle}</p>
                          </div>
                        )
                      })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Récapitulatif hebdo */}
        <div className="mt-8 rounded-sm border border-[#e4e4e4] bg-white px-6 py-5">
          <h3 className="mb-4 text-[15px] font-medium text-[#222]">Récapitulatif hebdomadaire</h3>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-3">
            {['CM', 'TD', 'TP'].map((type) => {
              const count = MOCK_TEACHER_SCHEDULE.filter((s) => s.type === type).length
              const style = typeStyles[type]
              return (
                <div key={type} className={`rounded-sm border px-4 py-3 text-center ${style.bg}`}>
                  <p className="text-[22px] font-bold">{count}</p>
                  <p className="text-[13px] font-medium">{type}</p>
                  <p className="text-[11px] opacity-70">{count * 2}h / semaine</p>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}

export default TeacherSchedule
