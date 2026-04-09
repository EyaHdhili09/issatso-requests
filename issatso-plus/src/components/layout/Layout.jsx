import Sidebar from './Sidebar'

function Layout({ children, currentPage, onNavigate }) {
  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      <div>{children}</div>
    </div>
  )
}

export default Layout
