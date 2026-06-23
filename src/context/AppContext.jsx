import { createContext, useContext, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { DEFAULT_EMISSION_FACTORS } from '../data/emissionFactors'
import { MOCK_BRANCHES } from '../data/mockBranches'
import { MOCK_HO_APPROVALS } from '../data/mockBranches'

const STORAGE_KEY = 'icai_emission_factors'

function loadFactors() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : DEFAULT_EMISSION_FACTORS
  } catch {
    return DEFAULT_EMISSION_FACTORS
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [emissionFactors, setEmissionFactors] = useState(loadFactors)
  const [submissions, setSubmissions] = useState([])
  const [branchStatuses, setBranchStatuses] = useState(() => {
    const map = {}
    MOCK_BRANCHES.forEach(b => { map[b.key] = b.status })
    return map
  })
  const [hoApprovals, setHoApprovals] = useState(MOCK_HO_APPROVALS)

  const showToast = useCallback((message, type = 'success') => {
    if (type === 'error') toast.error(message)
    else if (type === 'info') toast(message)
    else toast.success(message)
  }, [])

  const updateEmissionFactor = useCallback((key, newData) => {
    setEmissionFactors(prev => {
      const updated = { ...prev, [key]: { ...prev[key], ...newData } }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const addSubmission = useCallback((submission) => {
    setSubmissions(prev => [submission, ...prev])
  }, [])

  const approveSubmission = useCallback((branchKey) => {
    setBranchStatuses(prev => ({ ...prev, [branchKey]: 'approved' }))
  }, [])

  const approveHoEntity = useCallback((entityId) => {
    setHoApprovals(prev => prev.filter(e => e.id !== entityId))
  }, [])

  const branches = MOCK_BRANCHES.map(b => ({
    ...b,
    status: branchStatuses[b.key] || b.status,
  }))

  return (
    <AppContext.Provider value={{
      emissionFactors,
      submissions,
      branches,
      hoApprovals,
      showToast,
      updateEmissionFactor,
      addSubmission,
      approveSubmission,
      approveHoEntity,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
