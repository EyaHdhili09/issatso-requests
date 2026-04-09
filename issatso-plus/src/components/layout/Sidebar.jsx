import { useAuth } from '../../contexts/AuthContext'
import {
  Menu, Home, Star, FileText, CalendarDays, RefreshCcw, Users, LayoutGrid,
  ClipboardList, Send, NotebookPen, Library, FolderOpen, Scale, PenSquare,
  Briefcase, ScrollText, GraduationCap, MessageSquare, LogOut, BookOpen,
} from 'lucide-react'

function Sidebar({ currentPage, onNavigate }) {
  const { logout, user } = useAuth()

  const allMenuItems = [
    // Commun
    { name: 'Accueil', icon: Home, key: 'dashboard', roles: ['STUDENT', 'TEACHER', 'ADMIN'] },

    // Étudiant
    { name: 'Nouvelle demande', icon: FileText, key: 'new-request', roles: ['STUDENT'] },
    { name: 'Mes demandes', icon: Send, key: 'my-requests', roles: ['STUDENT'] },
    { name: 'Notes', icon: NotebookPen, roles: ['STUDENT'] },
    { name: 'Emploi du temps', icon: CalendarDays, roles: ['STUDENT'] },
    { name: 'Rattrapages', icon: RefreshCcw, roles: ['STUDENT'] },
    { name: 'Offres de Stages / emplois', icon: Briefcase, roles: ['STUDENT'] },

    // Enseignant — navigables
    { name: 'Nouvelle demande', icon: FileText, key: 'teacher-new-request', roles: ['TEACHER'] },
    { name: 'Mes demandes', icon: Send, key: 'teacher-my-requests', roles: ['TEACHER'] },
    { name: 'Stages encadrés', icon: Briefcase, key: 'teacher-stages', roles: ['TEACHER'] },
    // Enseignant — affichage uniquement (pas de navigation)
    { name: 'Mes modules', icon: BookOpen, roles: ['TEACHER'], displayOnly: true },
    { name: 'Emploi du temps', icon: CalendarDays, roles: ['TEACHER'], displayOnly: true },

    // Admin
    { name: 'Gestion des demandes', icon: ClipboardList, key: 'admin-requests', roles: ['ADMIN'] },

    // Commun (bas)
    { name: 'Actualités dirigées', icon: Home, badge: 'New', roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
    { name: 'Qualité', icon: Star, roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
    { name: 'Fiche de renseignements', icon: FileText, roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
    { name: 'Liste des groupes', icon: Users, roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
    { name: 'Tous les Emplois du temps', icon: LayoutGrid, roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
    { name: 'E-Forms', icon: ClipboardList, roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
    { name: 'Bibliothèque', icon: Library, roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
    { name: 'Supports de cours', icon: FolderOpen, roles: ['STUDENT', 'TEACHER'] },
    { name: 'Calendrier des examens', icon: CalendarDays, roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
    { name: 'Calendrier des délibérations', icon: Scale, roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
    { name: "Liste d'émargement", icon: PenSquare, roles: ['TEACHER', 'ADMIN'] },
    { name: 'Calendrier Universitaire', icon: CalendarDays, roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
    { name: 'Règlement interne', icon: ScrollText, roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
    { name: 'IssatSo Alumni', icon: GraduationCap, badge: 'Bientôt', roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
    { name: 'Envoyer vos avis', icon: MessageSquare, roles: ['STUDENT', 'TEACHER', 'ADMIN'] },
  ]

  const menuItems = allMenuItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role)
  )

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[240px] overflow-hidden border-r border-[#e6e6e6] bg-white text-[#333333]">
      <div className="flex h-[60px] items-center border-b border-[#ececec] bg-white">
        <button type="button" className="flex h-[60px] w-[68px] items-center justify-center bg-[#4479a3] text-white" aria-label="Ouvrir le menu">
          <Menu size={22} strokeWidth={2.2} />
        </button>
        <div className="flex h-full flex-1 items-center px-5">
          <img src="/ISSATSO-logo.jpg" alt="ISSAT Sousse" className="h-[42px] w-auto object-contain"
            onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span style="font-size:15px;font-weight:700;color:#4479a3;">ISSATSo+</span>' }} />
        </div>
      </div>

      <nav className="h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden bg-white">
        <ul className="m-0 list-none p-0">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const isActive = item.key && currentPage === item.key
            const isDisplayOnly = item.displayOnly

            return (
              <li key={index} className="relative min-h-[42px] leading-[42px]">
                <button
                  type="button"
                  onClick={() => !isDisplayOnly && item.key && onNavigate(item.key)}
                  className={`group flex h-[45px] w-full items-center justify-between overflow-hidden whitespace-nowrap text-left text-[14px] font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-[#e7f1fb] text-[#333333]'
                      : 'bg-transparent text-[#333333]'
                  } ${isDisplayOnly ? 'cursor-default' : 'hover:bg-[#f5f7f9]'}`}
                >
                  <div className="flex min-w-0 items-center">
                    <span className={`flex h-[45px] w-[50px] items-center justify-center ${
                      isActive ? 'text-[#4479a3]' : 'text-[#222222]'
                    }`}>
                      <Icon size={18} strokeWidth={1.9} />
                    </span>
                    <span className="truncate text-[14px] font-medium">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`pr-4 text-[12px] ${item.badge === 'New' ? 'text-[#c94949]' : 'text-[#9b9b9b]'}`}>
                      {item.badge === 'New' ? '| New' : '| Bientôt'}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute left-0 top-0 h-full w-[3px] bg-[#4479a3]" />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
        <div className="mx-5 my-4 border-t border-[#e8e8e8]" />
        <button type="button" onClick={logout}
          className="flex h-[45px] w-full items-center text-[14px] font-medium text-[#333333] transition-colors duration-300 hover:bg-[#f5f7f9]">
          <span className="flex h-[45px] w-[50px] items-center justify-center text-[#222222]">
            <LogOut size={18} strokeWidth={1.9} />
          </span>
          <span>Se déconnecter</span>
        </button>
      </nav>
    </aside>
  )
}

export default Sidebar
