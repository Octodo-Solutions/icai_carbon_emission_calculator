import { UploadSimple } from '@phosphor-icons/react'
import Modal from '../../../components/common/Modal/Modal'
import styles from './SubmitModal.module.css'

export default function SubmitModal({ open, onClose, onConfirm, scopeTotals, savedCount }) {
  return (
    <Modal open={open} onClose={onClose} title="Submit Q1 FY 2026-27 Report" width={480}>
      <div className={styles.body}>
        <div className={styles.info}>
          <div className={styles.infoIcon}><UploadSimple size={20} /></div>
          <p className={styles.infoText}>
            You are about to submit your Q1 FY 2026-27 emission data to the <strong>Western Region Admin</strong>.
            Once submitted, you cannot edit this period's data until the admin raises a query.
          </p>
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span>Modules Completed</span>
            <strong>{savedCount} of 6</strong>
          </div>
          <div className={styles.summaryRow}>
            <span>Total Emissions</span>
            <strong>{scopeTotals.total.toFixed(3)} tCO₂e</strong>
          </div>
          <div className={styles.summaryRow}>
            <span>Scope 1 — Direct</span>
            <strong className={styles.s1}>{scopeTotals.s1.toFixed(3)} tCO₂e</strong>
          </div>
          <div className={styles.summaryRow}>
            <span>Scope 2 — Energy</span>
            <strong className={styles.s2}>{scopeTotals.s2.toFixed(3)} tCO₂e</strong>
          </div>
          <div className={styles.summaryRow}>
            <span>Scope 3 — Value Chain</span>
            <strong className={styles.s3}>{scopeTotals.s3.toFixed(3)} tCO₂e</strong>
          </div>
        </div>

        {savedCount < 6 && (
          <div className={styles.warning}>
            {6 - savedCount} module(s) not completed. You can still submit — incomplete modules will show as zero.
          </div>
        )}

        <div className={styles.audit}>
          Submission will be timestamped and logged in the immutable audit trail.
        </div>

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onClose}>Cancel</button>
          <button className={styles.confirm} onClick={onConfirm}>Confirm Submission →</button>
        </div>
      </div>
    </Modal>
  )
}
