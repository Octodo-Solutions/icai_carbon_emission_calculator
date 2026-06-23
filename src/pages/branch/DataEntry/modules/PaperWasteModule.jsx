import { useState } from 'react'
import EfChip from '../../../../components/common/EfChip/EfChip'
import { calcPaper } from '../../../../utils/calculations'
import { fmtTco2e } from '../../../../utils/formatters'
import styles from '../DataEntry.module.css'

export default function PaperWasteModule({ onSave, emissionFactors }) {
  const [reams, setReams] = useState('')
  const [wasteKg, setWasteKg] = useState('')
  const [saved, setSaved] = useState(false)

  const tco2e = (reams || wasteKg) ? calcPaper(parseFloat(reams) || 0, parseFloat(wasteKg) || 0, emissionFactors?.paper?.value, emissionFactors?.waste?.value) : 0

  function handleSave() {
    onSave('paper', tco2e)
    setSaved(true)
  }

  return (
    <div className={styles.moduleBody}>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Paper Used (A4 reams)</label>
          <input className={styles.input} type="number" min="0" placeholder="e.g. 50" value={reams} onChange={e => { setReams(e.target.value); setSaved(false) }} />
          <div className={styles.fieldNote}>1 ream = 500 sheets, 80 GSM</div>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Solid Waste Generated (kg)</label>
          <input className={styles.input} type="number" min="0" placeholder="e.g. 120" value={wasteKg} onChange={e => { setWasteKg(e.target.value); setSaved(false) }} />
          <div className={styles.fieldNote}>General office waste to landfill</div>
        </div>
      </div>

      <div className={styles.efRow}>
        <EfChip factor={emissionFactors?.paper} />
        <EfChip factor={emissionFactors?.waste} />
      </div>

      {tco2e > 0 && (
        <div className={styles.result}>
          <span className={styles.resultScope}>Scope 3 — Paper &amp; Waste</span>
          <span className={styles.resultVal}>{fmtTco2e(tco2e)} tCO₂e</span>
        </div>
      )}

      <div className={styles.saveRow}>
        <button className={`${styles.saveBtn} ${saved ? styles.saveBtnDone : ''}`} onClick={handleSave} disabled={(tco2e === 0) || saved}>
          {saved ? '✓ Saved' : 'Save Paper & Waste'}
        </button>
        <span className={styles.auditNote}>🔒 Saved entries are logged with your user ID and timestamp</span>
      </div>
    </div>
  )
}
