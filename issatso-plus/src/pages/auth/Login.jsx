import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { loginUser } from '../../services/requestApi'
import { Eye, EyeOff, Loader2, Lock, User } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const [cin, setCin] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!cin.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs.')
      return
    }
    try {
      setLoading(true)
      const userData = await loginUser(cin.trim(), password)
      login(userData)
    } catch (err) {
      setError(err.message || 'Erreur de connexion.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">
        {/* Logo & Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <img
              src="/ISSATSO-logo.jpg"
              alt="ISSAT Sousse"
              className="h-[90px] w-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.parentElement.innerHTML =
                  '<div style="display:flex;align-items:center;justify-content:center;height:72px;width:72px;background:#4479a3;border-radius:4px;"><span style="color:white;font-size:22px;font-weight:700;">IS</span></div>'
              }}
            />
          </div>
          <h1 className="text-[20px] font-semibold text-[#1a1a1a]">ISSATSo+</h1>
          <p className="mt-1 text-[14px] text-[#6b7280]">Portail des demandes administratives</p>
        </div>

        {/* Card */}
        <div className="rounded-sm border border-[#e4e4e4] bg-white px-8 py-8">
          <h2 className="mb-6 text-[16px] font-medium text-[#222222]">Connexion</h2>

          {error && (
            <div className="mb-5 rounded-sm border border-[#f3caca] bg-[#fdecec] px-4 py-3 text-[13px] text-[#b83232]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-[14px] font-medium text-[#2f2f2f]">
                Numéro CIN
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa3ad]"
                />
                <input
                  type="text"
                  value={cin}
                  onChange={(e) => setCin(e.target.value)}
                  placeholder="Votre numéro CIN"
                  className="w-full rounded-sm border border-[#d8d8d8] bg-white py-2.5 pl-9 pr-4 text-[14px] text-[#222] outline-none transition focus:border-[#4479a3]"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[14px] font-medium text-[#2f2f2f]">
                Mot de passe
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa3ad]"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  className="w-full rounded-sm border border-[#d8d8d8] bg-white py-2.5 pl-9 pr-10 text-[14px] text-[#222] outline-none transition focus:border-[#4479a3]"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa3ad] transition hover:text-[#4479a3]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#4479a3] py-2.5 text-[14px] font-medium text-white transition hover:bg-[#3d6d92] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Comptes de test */}
          <div className="mt-7 border-t border-[#ececec] pt-5">
            <p className="mb-3 text-[12px] font-medium text-[#7b8794] uppercase tracking-wide">Comptes de test</p>
            <div className="space-y-2">
              {[
                { label: 'Étudiant', cin: '123456', role: 'STUDENT' },
                { label: 'Enseignant', cin: '222222', role: 'TEACHER' },
                { label: 'Admin', cin: '333333', role: 'ADMIN' },
              ].map((account) => (
                <button
                  key={account.cin}
                  type="button"
                  onClick={() => {
                    setCin(account.cin)
                    setPassword('password123')
                  }}
                  className="flex w-full items-center justify-between rounded-sm border border-[#e8e8e8] bg-[#fafafa] px-3 py-2 text-[12px] text-[#5f6470] transition hover:bg-[#f0f5fa] hover:border-[#c8d8e8]"
                >
                  <span className="font-medium text-[#333]">{account.label}</span>
                  <span className="font-mono text-[#7b8794]">CIN: {account.cin} / password123</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[12px] text-[#9aa3ad]">
          Institut Supérieur des Sciences Appliquées et de Technologie de Sousse
        </p>
      </div>
    </div>
  )
}
