import { MOCK_REQUESTS, MOCK_USERS, MOCK_TEACHER_REQUESTS } from './mockData'

// ============================================================
// Mock API - Simule les appels backend avec données statiques
// ============================================================

let mockRequests = [...MOCK_REQUESTS]
let mockTeacherRequests = [...MOCK_TEACHER_REQUESTS]

const delay = (ms = 600) => new Promise(resolve => setTimeout(resolve, ms))

let nextId = 100
let nextTeacherId = 10

export async function createStageRequest(payload) {
  await delay()
  const user = MOCK_USERS.find(u => u.cin === payload.studentCin)
  const newReq = {
    id: `REQ-${++nextId}`,
    reference: `STG-2025-00${nextId}`,
    type: 'STAGE_ETE',
    status: 'EN_ATTENTE',
    submitterRole: 'STUDENT',
    studentCin: payload.studentCin,
    studentNom: user?.nom || 'INCONNU',
    groupe: user?.groupe || '-',
    filiere: payload.filiere,
    telephone: payload.telephone,
    nomEntreprise: payload.nomEntreprise,
    domaineActivite: payload.domaineActivite,
    adresseEntreprise: payload.adresseEntreprise,
    telEntreprise: payload.telEntreprise,
    faxEntreprise: payload.faxEntreprise,
    siteWeb: payload.siteWeb,
    encadreurNom: payload.encadreurNom,
    encadreurFonction: payload.encadreurFonction,
    encadreurService: payload.encadreurService,
    encadreurEmail: payload.encadreurEmail,
    tacheProposee: payload.tacheProposee,
    dateDebut: payload.dateDebut,
    dateFin: payload.dateFin,
    studentComment: payload.studentComment,
    adminComment: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockRequests.unshift(newReq)
  return newReq
}

export async function createTeacherRequest(payload) {
  await delay()
  const user = MOCK_USERS.find(u => u.cin === payload.submitterCin)
  const prefixMap = {
    CONGE_FORMATION: 'ENS-CONG',
    DEMANDE_MATERIEL: 'ENS-MAT',
    ATTESTATION_SERVICE: 'ENS-ATT',
    RECLAMATION_ADMIN: 'ENS-RECL',
    AUTRE: 'ENS-AUTRE',
  }
  const prefix = prefixMap[payload.type] || 'ENS'
  const newReq = {
    id: `TREQ-${++nextTeacherId}`,
    reference: `${prefix}-2025-00${nextTeacherId}`,
    type: payload.type,
    status: 'EN_ATTENTE',
    submitterRole: 'TEACHER',
    submitterCin: payload.submitterCin,
    submitterNom: user?.nom || 'INCONNU',
    grade: user?.grade || '-',
    departement: user?.departement || '-',
    intitule: payload.intitule,
    lieu: payload.lieu || null,
    dateDebut: payload.dateDebut || null,
    dateFin: payload.dateFin || null,
    justification: payload.justification,
    financementDemande: payload.financementDemande || false,
    montantEstime: payload.montantEstime || null,
    documentsJoints: [],
    adminComment: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockTeacherRequests.unshift(newReq)
  return newReq
}

export async function getMyRequests(cin) {
  await delay()
  return mockRequests.filter(r => r.studentCin === cin)
}

export async function getMyTeacherRequests(cin) {
  await delay()
  return mockTeacherRequests.filter(r => r.submitterCin === cin)
}

export async function getAllAdminRequests() {
  await delay()
  // Combine student + teacher requests, tag each with submitterRole
  const studentReqs = mockRequests.map(r => ({ ...r, submitterRole: r.submitterRole || 'STUDENT' }))
  const teacherReqs = mockTeacherRequests.map(r => ({ ...r, submitterRole: 'TEACHER' }))
  return [...teacherReqs, ...studentReqs]
}

export async function updateRequestStatus(requestId, payload) {
  await delay()
  // Try student requests first
  let idx = mockRequests.findIndex(r => r.id === requestId)
  if (idx !== -1) {
    mockRequests[idx] = { ...mockRequests[idx], status: payload.status, adminComment: payload.adminComment, updatedAt: new Date().toISOString() }
    return mockRequests[idx]
  }
  // Then teacher requests
  idx = mockTeacherRequests.findIndex(r => r.id === requestId)
  if (idx !== -1) {
    mockTeacherRequests[idx] = { ...mockTeacherRequests[idx], status: payload.status, adminComment: payload.adminComment, updatedAt: new Date().toISOString() }
    return mockTeacherRequests[idx]
  }
  throw new Error('Demande introuvable.')
}

export async function getRequestById(requestId) {
  await delay()
  const req = mockRequests.find(r => r.id === requestId) || mockTeacherRequests.find(r => r.id === requestId)
  if (!req) throw new Error('Demande introuvable.')
  return req
}

export async function loginUser(cin, password) {
  await delay(400)
  const user = MOCK_USERS.find(u => u.cin === cin && u.password === password)
  if (!user) throw new Error('CIN ou mot de passe incorrect.')
  const { password: _, ...safeUser } = user
  return safeUser
}
