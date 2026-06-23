import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import styles from './ConsentPage.module.css'

const ITEMS = [
  {
    id: 'c1',
    required: true,
    icon: '✅',
    title: 'Authority to Submit Data',
    desc: 'I confirm I am an authorised representative of this entity and have the authority to submit emissions data on its behalf.',
  },
  {
    id: 'c2',
    required: true,
    icon: '📋',
    title: 'Data Accuracy & Verifiability',
    desc: 'I confirm that the data submitted is accurate, complete, and supported by verifiable source documents (bills, invoices, records) which I will retain for audit purposes.',
  },
  {
    id: 'c3',
    required: false,
    icon: '🔍',
    title: 'Data Visibility to Regional & HO',
    desc: 'I consent to my branch emission data being visible in anonymised aggregated form to Regional Office and Head Office administrators for national reporting.',
  },
]

export default function ConsentPage() {
  const [checked, setChecked] = useState({ c1: false, c2: false, c3: false })
  const { setConsentGiven } = useAuth()
  const navigate = useNavigate()

  const canProceed = checked.c1 && checked.c2

  function toggle(id) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function handleConfirm() {
    if (!canProceed) return
    setConsentGiven(true)
    navigate('/branch/dashboard')
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.headerIcon}>🛡️</div>
          <h2 className={styles.title}>Data Responsibility Acknowledgement</h2>
          <p className={styles.sub}>One-time consent required before first data entry — DPDP Act 2023</p>
        </div>

        <div className={styles.intro}>
          As a data submitter under ICAI's Carbon Monitoring System, you are responsible for the accuracy and integrity of data entered on behalf of your entity. Please read and confirm the following statements.
        </div>

        <div className={styles.items}>
          {ITEMS.map(item => (
            <label key={item.id} className={`${styles.item} ${checked[item.id] ? styles.checked : ''}`}>
              <input
                type="checkbox"
                checked={checked[item.id]}
                onChange={() => toggle(item.id)}
                className={styles.checkbox}
              />
              <div className={styles.itemIcon}>{item.icon}</div>
              <div className={styles.itemBody}>
                <div className={styles.itemTitle}>
                  {item.title}
                  {item.required
                    ? <span className={styles.req}>Required</span>
                    : <span className={styles.opt}>Optional</span>}
                </div>
                <div className={styles.itemDesc}>{item.desc}</div>
              </div>
            </label>
          ))}
        </div>

        <div className={styles.caNote}>
          <strong>CA Firms:</strong> By proceeding, you confirm that this submission represents operational emissions of your firm and not client engagements. All data is subject to ICAI's data governance policy.
        </div>

        <div className={styles.ts}>
          Timestamp: <strong>23 Jun 2026, 08:42:11 IST</strong> — will be recorded in the immutable audit log.
        </div>

        <button className={styles.confirm} disabled={!canProceed} onClick={handleConfirm}>
          Confirm &amp; Proceed to Dashboard
        </button>

        {!canProceed && (
          <p className={styles.hint}>Please confirm the two required statements above to proceed.</p>
        )}
      </div>
    </div>
  )
}
