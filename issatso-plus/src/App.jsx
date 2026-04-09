import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/auth/Login'
import Sidebar from './components/layout/Sidebar'
// Student
import StudentDashboard from './pages/student/Dashboard'
import NewRequestHome from './pages/student/NewRequestHome'
import NewStageRequest from './pages/student/NewStageRequest'
import MyRequests from './pages/student/MyRequests'
import RequestDetails from './pages/student/RequestDetails'
// Teacher
import TeacherDashboard from './pages/teacher/Dashboard'
import TeacherStages from './pages/teacher/TeacherStages'
import TeacherNewRequestHome from './pages/teacher/TeacherNewRequestHome'
import TeacherRequestForm from './pages/teacher/TeacherRequestForm'
import TeacherMyRequests from './pages/teacher/TeacherMyRequests'
import TeacherRequestDetails from './pages/teacher/TeacherRequestDetails'
// Admin
import AdminDashboard from './pages/admin/Dashboard'
import RequestsManagement from './pages/admin/RequestsManagement'

function AppContent() {
  const { user, loading } = useAuth()
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [selectedRequestId, setSelectedRequestId] = useState(null)
  const [teacherRequestTypeId, setTeacherRequestTypeId] = useState(null)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f7f7]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#4479a3] border-t-transparent" />
          <p className="text-sm text-[#6b7280]">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) return <Login />

  const navigate = (page) => { setCurrentPage(page); window.scrollTo(0, 0) }

  const renderPage = () => {
    // ---- ADMIN ----
    if (user.role === 'ADMIN') {
      switch (currentPage) {
        case 'admin-requests':
          return <RequestsManagement onOpenDetails={(id) => { setSelectedRequestId(id); navigate('request-details-admin') }} />
        case 'request-details-admin':
          return <RequestDetails requestId={selectedRequestId} onBack={() => navigate('admin-requests')} />
        default:
          return <AdminDashboard onNavigate={navigate} />
      }
    }

    // ---- TEACHER ----
    if (user.role === 'TEACHER') {
      switch (currentPage) {
        case 'teacher-stages':
          return <TeacherStages />
        case 'teacher-new-request':
          return (
            <TeacherNewRequestHome
              onSelectRequest={(typeId) => {
                setTeacherRequestTypeId(typeId)
                navigate('teacher-request-form')
              }}
            />
          )
        case 'teacher-request-form':
          return (
            <TeacherRequestForm
              requestTypeId={teacherRequestTypeId}
              onBack={() => navigate('teacher-new-request')}
            />
          )
        case 'teacher-my-requests':
          return (
            <TeacherMyRequests
              onOpenDetails={(id) => {
                setSelectedRequestId(id)
                navigate('teacher-request-details')
              }}
            />
          )
        case 'teacher-request-details':
          return (
            <TeacherRequestDetails
              requestId={selectedRequestId}
              onBack={() => navigate('teacher-my-requests')}
            />
          )
        default:
          return <TeacherDashboard onNavigate={navigate} />
      }
    }

    // ---- STUDENT ----
    switch (currentPage) {
      case 'new-request':
        return <NewRequestHome onSelectRequest={navigate} />
      case 'new-stage-request':
        return <NewStageRequest onBack={() => navigate('new-request')} />
      case 'my-requests':
        return (
          <MyRequests
            onOpenDetails={(id) => {
              setSelectedRequestId(id)
              navigate('request-details')
            }}
          />
        )
      case 'request-details':
        return <RequestDetails requestId={selectedRequestId} onBack={() => navigate('my-requests')} />
      default:
        return <StudentDashboard onNavigate={navigate} />
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Sidebar currentPage={currentPage} onNavigate={navigate} />
      {renderPage()}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
