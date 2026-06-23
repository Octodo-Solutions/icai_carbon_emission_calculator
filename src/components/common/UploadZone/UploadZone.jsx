import { useState } from 'react'
import styles from './UploadZone.module.css'

export default function UploadZone({ onExtracted, label = 'electricity bill' }) {
  const [state, setState] = useState('idle') // idle | uploading | done

  function simulate() {
    if (state !== 'idle') return
    setState('uploading')
    setTimeout(() => {
      setState('done')
      onExtracted?.()
    }, 1400)
  }

  return (
    <div
      className={`${styles.zone} ${styles[state]}`}
      onClick={simulate}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter') simulate() }}
    >
      {state === 'idle' && (
        <>
          <div className={styles.icon}>📄</div>
          <div className={styles.main}>Click to upload {label}</div>
          <div className={styles.sub}>PDF, JPG, PNG — max 10 MB</div>
          <span className={styles.ocr}>🤖 OCR auto-extraction</span>
        </>
      )}
      {state === 'uploading' && (
        <>
          <div className={styles.spinner} />
          <div className={styles.main}>Scanning document…</div>
          <div className={styles.sub}>AI is extracting data</div>
        </>
      )}
      {state === 'done' && (
        <>
          <div className={styles.icon}>✅</div>
          <div className={styles.main} style={{ color: 'var(--green)' }}>Q1 Bill uploaded</div>
          <div className={styles.sub}>4,200 kWh auto-extracted and filled</div>
        </>
      )}
    </div>
  )
}
