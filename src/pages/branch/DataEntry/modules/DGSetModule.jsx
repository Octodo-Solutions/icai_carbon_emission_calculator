import { useState } from 'react'
import EfChip from '../../../../components/common/EfChip/EfChip'
import { calcDGSet } from '../../../../utils/calculations'
import { fmtTco2e } from '../../../../utils/formatters'
import styles from '../DataEntry.module.css'

export default function DGSetModule({ onSave, emissionFactors }) {
  const [litres, setLitres] = useState('')
  const [capacity, setCapacity] = useState('')
  const [hours, setHours] = useState('')
  const [saved, setSaved] = useState(false)
  const ef = emissionFactors?.diesel

  const tco2e = litres ? calcDGSet(parseFloat(litres) || 0, ef?.value) : 0

  function handleSave() {
    onSave('dg', tco2e)
    setSaved(true)
  }

  return (
    <div className={styles.moduleBody}>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Diesel Consumed (litres)</label>
          <input className={styles.input} type="number" min="0" placeholder="e.g. 180" value={litres} onChange={e => { setLitres(e.target.value); setSaved(false) }} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>DG Capacity (kVA)</label>
          <input className={styles.input} type="number" min="0" placeholder="e.g. 25" value={capacity} onChange={e => setCapacity(e.target.value)} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Hours Run</label>
          <input className={styles.input} type="number" min="0" placeholder="e.g. 60" value={hours} onChange={e => setHours(e.target.value)} />
        </div>
      </div>

      <div className={styles.efRow}>
        <EfChip factor={ef} />
        <span className={styles.efNote}>IPCC stationary combustion factor</span>
      </div>

      {tco2e > 0 && (
        <div className={styles.result}>
          <span className={styles.resultScope}>Scope 1 — Diesel Combustion</span>
          <span className={styles.resultVal}>{fmtTco2e(tco2e)} tCO₂e</span>
        </div>
      )}

      <div className={styles.saveRow}>
        <button className={`${styles.saveBtn} ${saved ? styles.saveBtnDone : ''}`} onClick={handleSave} disabled={!litres || saved}>
          {saved ? '✓ Saved' : 'Save DG Set'}
        </button>
        <span className={styles.auditNote}>🔒 Saved entries are logged with your user ID and timestamp</span>
      </div>
    </div>
  )
}
