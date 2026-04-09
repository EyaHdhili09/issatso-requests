import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { createTeacherRequest } from '../../services/requestApi'
import {
  ArrowLeft, SendHorizontal, Save, Upload, Paperclip,
  FileText, Plane, Monitor, FileCheck, AlertCircle, UserRound,
} from 'lucide-react'

const TYPE_CONFIG = {
  'teacher-conge-formation': {
    type: 'CONGE_FORMATION',
    label: 'Congé / Mission de formation',
    icon: Plane,
    hasLieu: true,
    hasDates: true,
    hasFinancement: true,
    placeholder: 'Décrivez la formation, conférence ou mission et son intérêt pédagogique...',
  },
  'teacher-materiel': {
    type: 'DEMANDE_MATERIEL',
    label: 'Demande de matériel',
    icon: Monitor,
    hasLieu: false,
    hasDates: false,
    hasFinancement: false,
    placeholder: 'Décrivez le matériel demandé, les quantités et l\'utilisation prévue...',
  },
  'teacher-attestation': {
    type: 'ATTESTATION_SERVICE',
    label: 'Attestation de service',
    icon: FileCheck,
    hasLieu: false,
    hasDates: false,
    hasFinancement: false,
    placeholder: 'Précisez le type d\'attestation souhaitée et son usage...',
  },
  'teacher-reclamation': {
    type: 'RECLAMATION_ADMIN',
    label: 'Réclamation administrative',
    icon: AlertCircle,
    hasLieu: false,
    hasDates: false,
    hasFinancement: false,
    placeholder: 'Décrivez précisément l\'objet de votre réclamation et les éléments justificatifs...',
  },
  'teacher-autre': {
    type: 'AUTRE',
    label: 'Autre demande administrative',
    icon: FileText,
    hasLieu: false,
    hasDates: false,
    hasFinancement: false,
    placeholder: 'Décrivez votre demande en détail...',
  },
}

function TeacherRequestForm({ requestTypeId, onBack, onSuccess }) {
  const { user } = useAuth()
  const config = TYPE_CONFIG[requestTypeId] || TYPE_CONFIG['teacher-autre']
  const Icon = config.icon

  const [formData, setFormData] = useState({
    intitule: '',
    justification: '',
    lieu: '',
    dateDebut: '',
    dateFin: '',
    financementDemande: false,
    montantEstime: '',
  })
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleFilesChange = (e) => {
    setFiles(Array.from(e.target.files || []))
  }

  const handleSubmit = async (e, mode = 'submit') => {
    e.preventDefault()
    setSuccessMessage('')
    setErrorMessage('')

    if (mode === 'draft') {
      alert('Le mode brouillon sera connecté ultérieurement.')
      return
    }

    if (!formData.intitule.trim() || !formData.justification.trim()) {
      setErrorMessage('Veuillez remplir au minimum l\'intitulé et la justification.')
      return
    }

    try {
      setLoading(true)
      const result = await createTeacherRequest({
        submitterCin: user.cin,
        type: config.type,
        intitule: formData.intitule,
        justification: formData.justification,
        lieu: formData.lieu || null,
        dateDebut: formData.dateDebut || null,
        dateFin: formData.dateFin || null,
        financementDemande: formData.financementDemande,
        montantEstime: formData.montantEstime || null,
      })
      setSuccessMessage(`Demande soumise avec succès. Référence : ${result.reference}`)
      setFormData({ intitule: '', justification: '', lieu: '', dateDebut: '', dateFin: '', financementDemande: false, montantEstime: '' })
      setFiles([])
    } catch (err) {
      setErrorMessage(err.message || 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full rounded-sm border border-[#d8d8d8] bg-white px-3 py-2.5 text-[14px] text-[#222] outline-none transition focus:border-[#4479a3]'
  const labelClass = 'mb-2 block text-[14px] font-medium text-[#2f2f2f]'
  const sectionTitleClass = 'mb-5 flex items-center gap-2 text-[16px] font-medium text-[#222]'

  return (
    <div className="ml-[240px] min-h-screen bg-[#f3f3f3]">
      <div className="h-[60px] border-b border-[#e8e8e8] bg-white" />
      <main className="px-8 pb-10 pt-8">

        {/* Header */}
        <div className="mb-8 rounded-sm border border-[#e5e5e5] bg-white px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef4fa] text-[#4479a3]">
                <Icon size={18} />
              </div>
              <div>
                <h1 className="text-[16px] font-medium text-[#222222]">{config.label}</h1>
                <p className="mt-1 text-[13px] text-[#6b7280]">
                  Remplissez les informations avant de soumettre votre demande.
                </p>
              </div>
            </div>
            <button type="button" onClick={onBack}
              className="inline-flex items-center gap-2 rounded-sm border border-[#d7d7d7] bg-white px-4 py-2 text-[14px] font-medium text-[#333] transition hover:bg-[#f7f7f7]">
              <ArrowLeft size={16} />
              Retour
            </button>
          </div>
        </div>

        {successMessage && (
          <div className="mb-6 rounded-sm border border-[#cfe8d5] bg-[#edf8f0] px-4 py-3 text-[14px] text-[#2f7a45]">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-6 rounded-sm border border-[#f3caca] bg-[#fdecec] px-4 py-3 text-[14px] text-[#b83232]">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-12 gap-8">
          <section className="col-span-12 xl:col-span-9">
            <form className="space-y-8">

              {/* Identification enseignant */}
              <div className="rounded-sm border border-[#e4e4e4] bg-white px-6 py-6">
                <h2 className={sectionTitleClass}>
                  <UserRound size={18} />
                  Identification enseignant
                </h2>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>Nom et prénom</label>
                    <input value={user?.nom || ''} className={`${inputClass} bg-[#f9f9f9]`} readOnly />
                  </div>
                  <div>
                    <label className={labelClass}>Grade</label>
                    <input value={user?.grade || ''} className={`${inputClass} bg-[#f9f9f9]`} readOnly />
                  </div>
                  <div>
                    <label className={labelClass}>Département</label>
                    <input value={user?.departement || ''} className={`${inputClass} bg-[#f9f9f9]`} readOnly />
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input value={user?.email || ''} className={`${inputClass} bg-[#f9f9f9]`} readOnly />
                  </div>
                </div>
              </div>

              {/* Détails de la demande */}
              <div className="rounded-sm border border-[#e4e4e4] bg-white px-6 py-6">
                <h2 className={sectionTitleClass}>
                  <Icon size={18} />
                  Détails de la demande
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Intitulé de la demande <span className="text-[#b83232]">*</span></label>
                    <input
                      name="intitule"
                      value={formData.intitule}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder={`Ex : ${config.label}...`}
                    />
                  </div>

                  {config.hasLieu && (
                    <div>
                      <label className={labelClass}>Lieu / Destination</label>
                      <input name="lieu" value={formData.lieu} onChange={handleChange} className={inputClass} placeholder="Ex : Paris, France" />
                    </div>
                  )}

                  {config.hasDates && (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div>
                        <label className={labelClass}>Date de début</label>
                        <input type="date" name="dateDebut" value={formData.dateDebut} onChange={handleChange} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Date de fin</label>
                        <input type="date" name="dateFin" value={formData.dateFin} onChange={handleChange} className={inputClass} />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className={labelClass}>Justification / Détails <span className="text-[#b83232]">*</span></label>
                    <textarea
                      name="justification"
                      value={formData.justification}
                      onChange={handleChange}
                      rows={5}
                      className={inputClass}
                      placeholder={config.placeholder}
                    />
                  </div>

                  {config.hasFinancement && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="financementDemande"
                          name="financementDemande"
                          checked={formData.financementDemande}
                          onChange={handleChange}
                          className="h-4 w-4 rounded border-[#d8d8d8] accent-[#4479a3]"
                        />
                        <label htmlFor="financementDemande" className="text-[14px] text-[#333]">
                          Je sollicite un financement institutionnel pour cette mission
                        </label>
                      </div>
                      {formData.financementDemande && (
                        <div>
                          <label className={labelClass}>Montant estimé (TND)</label>
                          <input
                            name="montantEstime"
                            value={formData.montantEstime}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Ex : 1500 TND"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Pièces jointes */}
              <div className="rounded-sm border border-[#e4e4e4] bg-white px-6 py-6">
                <h2 className={sectionTitleClass}>
                  <Paperclip size={18} />
                  Pièces jointes
                </h2>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-sm border border-dashed border-[#bfc7d1] bg-[#fafafa] px-6 py-8 text-center transition hover:bg-[#f4f7fa]">
                  <Upload size={22} className="mb-3 text-[#4479a3]" />
                  <span className="text-[14px] font-medium text-[#2f2f2f]">Ajouter des fichiers</span>
                  <span className="mt-1 text-[12px] text-[#6b7280]">PDF, image, document scanné…</span>
                  <input type="file" multiple className="hidden" onChange={handleFilesChange} />
                </label>
                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {files.map((file, i) => (
                      <div key={i} className="rounded-sm border border-[#e5e5e5] bg-[#fafafa] px-3 py-2 text-[13px] text-[#444]">
                        {file.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-end gap-3 pb-4">
                <button type="button" onClick={(e) => handleSubmit(e, 'draft')} disabled={loading}
                  className="inline-flex items-center gap-2 rounded-sm border border-[#d7d7d7] bg-white px-4 py-2.5 text-[14px] font-medium text-[#333] transition hover:bg-[#f7f7f7]">
                  <Save size={16} />
                  Enregistrer brouillon
                </button>
                <button type="submit" onClick={(e) => handleSubmit(e, 'submit')} disabled={loading}
                  className="inline-flex items-center gap-2 rounded-sm bg-[#4479a3] px-4 py-2.5 text-[14px] font-medium text-white transition hover:bg-[#3d6d92] disabled:cursor-not-allowed disabled:opacity-70">
                  <SendHorizontal size={16} />
                  {loading ? 'Envoi...' : 'Soumettre la demande'}
                </button>
              </div>
            </form>
          </section>

          {/* Aside info */}
          <aside className="col-span-12 space-y-8 xl:col-span-3">
            <div className="rounded-sm border border-[#e4e4e4] bg-white px-5 py-5">
              <h3 className="mb-4 flex items-center gap-2 text-[15px] font-medium text-[#222]">
                <FileText size={16} />
                Informations
              </h3>
              <div className="space-y-3 text-[13px] leading-6 text-[#5f6470]">
                <p>Votre demande sera transmise à l'administration dès soumission.</p>
                <p>Le statut initial sera <span className="font-medium text-[#222]">En attente</span>.</p>
                <p>Vous pouvez suivre l'avancement depuis <span className="font-medium text-[#222]">Mes demandes</span>.</p>
              </div>
            </div>

            {config.hasFinancement && (
              <div className="rounded-sm border border-[#e4e4e4] bg-white px-5 py-5">
                <h3 className="mb-4 text-[15px] font-medium text-[#222]">Documents suggérés</h3>
                <ul className="space-y-2 text-[13px] text-[#5f6470]">
                  <li>• Lettre d'invitation / d'acceptation</li>
                  <li>• Programme de la manifestation</li>
                  <li>• Devis de transport et hébergement</li>
                  <li>• Article soumis / accepté (si applicable)</li>
                </ul>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  )
}

export default TeacherRequestForm
