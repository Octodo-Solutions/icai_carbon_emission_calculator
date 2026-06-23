import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../../context/AppContext'
import { useAuth } from '../../../context/AuthContext'
import { Lightning, Drop, Airplane, FileText, Flame, Bed } from '@phosphor-icons/react'
import AppLayout from '../../../components/layout/AppLayout/AppLayout'
import { calcScopeTotals } from '../../../utils/calculations'
import { MOCK_SUBMISSION_PUNE } from '../../../data/mockSubmissions'
import ElectricityModule from './modules/ElectricityModule'
import DGSetModule from './modules/DGSetModule'
import TravelModule from './modules/TravelModule'
import PaperWasteModule from './modules/PaperWasteModule'
import CookingFuelModule from './modules/CookingFuelModule'
import HotelStayModule from './modules/HotelStayModule'
import SummaryPanel from './SummaryPanel'
import SubmitModal from './SubmitModal'
import styles from './DataEntry.module.css'

const MODULES_CONFIG = [
  { key: 'electricity', label: 'Electricity Consumption', icon: <Lightning size={18} />, scope: 2, Component: ElectricityModule },
  { key: 'dg',          label: 'DG Set / Diesel Fuel',   icon: <Drop size={18} />, scope: 1, Component: DGSetModule },
  { key: 'travel',      label: 'Business Travel',         icon: <Airplane size={18} />, scope: 3, Component: TravelModule },
  { key: 'paper',       label: 'Paper & Waste',           icon: <FileText size={18} />, scope: 3, Component: PaperWasteModule },
  { key: 'cooking',     label: 'Cooking Fuel & Gases',    icon: <Flame size={18} />, scope: 1, Component: CookingFuelModule },
  { key: 'hotel',       label: 'Hotel Stay',              icon: <Bed size={18} />, scope: 3, Component: HotelStayModule },
]

const SCOPE_BADGE = { 1: styles.s1Badge, 2: styles.s2Badge, 3: styles.s3Badge }

export default function DataEntry() {
  const { emissionFactors, addSubmission, showToast } = useApp()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [openModule, setOpenModule] = useState('electricity')
  const [moduleData, setModuleData] = useState({
    electricity: { tco2e: 0, saved: false },
    dg:          { tco2e: 0, saved: false },
    travel:      { tco2e: 0, saved: false },
    paper:       { tco2e: 0, saved: false },
    cooking:     { tco2e: 0, saved: false },
    hotel:       { tco2e: 0, saved: false },
  })
  const [showSubmitModal, setShowSubmitModal] = useState(false)

  const scopeTotals = useMemo(() => calcScopeTotals(moduleData), [moduleData])
  const savedCount = Object.values(moduleData).filter(m => m.saved).length

  function handleSave(key, tco2e) {
    setModuleData(prev => ({ ...prev, [key]: { tco2e, saved: true } }))
    showToast(`${MODULES_CONFIG.find(m => m.key === key)?.label} saved`)
  }

  function handleSubmit() {
    addSubmission({ ...MOCK_SUBMISSION_PUNE, total: scopeTotals.total, ...scopeTotals })
    setShowSubmitModal(false)
    navigate('/branch/reports')
  }

  return (
    <AppLayout>
      <div className={styles.page}>
        {/* header */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Q1 FY 2026-27 Data Entry</h1>
            <p className={styles.pageSub}>{user?.name} · Apr – Jun 2026 · Due 31 Jul 2026</p>
          </div>
        </div>

        <div className={styles.layout}>
          {/* Modules column */}
          <div className={styles.modules}>
            {MODULES_CONFIG.map(mod => {
              const isOpen = openModule === mod.key
              const data = moduleData[mod.key]
              return (
                <div key={mod.key} className={`${styles.accordion} ${data.saved ? styles.accordionDone : ''}`}>
                  <button
                    className={styles.accordionHead}
                    onClick={() => setOpenModule(isOpen ? null : mod.key)}
                  >
                    <span className={styles.modIcon}>{mod.icon}</span>
                    <span className={styles.modLabel}>{mod.label}</span>
                    <span className={`${styles.scopeBadge} ${SCOPE_BADGE[mod.scope]}`}>Scope {mod.scope}</span>
                    {data.saved && <span className={styles.savedChip}>✓ {data.tco2e.toFixed(3)} tCO₂e</span>}
                    <span className={`${styles.chevron} ${isOpen ? styles.open : ''}`}>▼</span>
                  </button>
                  {isOpen && (
                    <mod.Component
                      onSave={handleSave}
                      emissionFactors={emissionFactors}
                    />
                  )}
                </div>
              )
            })}

            {/* Submit section */}
            <div className={styles.submitSection}>
              <h4 className={styles.submitTitle}>Ready to submit?</h4>
              <p className={styles.submitDesc}>
                Once submitted, this period's data is sent to Western Region Admin for review and approval. You will be notified of the outcome.
              </p>
              <button
                className={styles.submitBtn}
                onClick={() => setShowSubmitModal(true)}
                disabled={savedCount === 0}
              >
                Submit to Regional Admin →
              </button>
              {savedCount === 0 && <p className={styles.submitHint}>Save at least one module to enable submission.</p>}
            </div>
          </div>

          {/* Summary Panel */}
          <SummaryPanel moduleData={moduleData} scopeTotals={scopeTotals} onSubmit={() => setShowSubmitModal(true)} />
        </div>

        <SubmitModal
          open={showSubmitModal}
          onClose={() => setShowSubmitModal(false)}
          onConfirm={handleSubmit}
          scopeTotals={scopeTotals}
          savedCount={savedCount}
        />
      </div>
    </AppLayout>
  )
}
