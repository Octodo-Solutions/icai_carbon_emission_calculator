import { useState } from 'react'
import EfChip from '../../../../components/common/EfChip/EfChip'
import { calcLPG, calcPNG } from '../../../../utils/calculations'
import { fmtTco2e } from '../../../../utils/formatters'
import styles from '../DataEntry.module.css'

export default function CookingFuelModule({ onSave, emissionFactors }) {
  const [fuelType, setFuelType] = useState('lpg')
  const [qty, setQty] = useState('')
  const [saved, setSaved] = useState(false)

  const tco2e = qty
    ? fuelType === 'lpg'
      ? calcLPG(parseFloat(qty) || 0, emissionFactors?.lpg?.value)
      : calcPNG(parseFloat(qty) || 0, emissionFactors?.png?.value)
    : 0

  function handleSave() {
    onSave('cooking', tco2e)
    setSaved(true)
  }

  return (
    <div className={styles.moduleBody}>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Fuel Type</label>
          <select className={styles.select} value={fuelType} onChange={e => { setFuelType(e.target.value); setQty(''); setSaved(false) }}>
            <option value="lpg">LPG (cylinder, 14.2 kg)</option>
            <option value="png">PNG — Piped Natural Gas (SCM)</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>{fuelType === 'lpg' ? 'Cylinders Used' : 'Consumption (SCM)'}</label>
          <input
            className={styles.input}
            type="number"
            min="0"
            placeholder={fuelType === 'lpg' ? 'e.g. 3' : 'e.g. 45'}
            value={qty}
            onChange={e => { setQty(e.target.value); setSaved(false) }}
          />
        </div>
      </div>

      <div className={styles.efRow}>
        <EfChip factor={fuelType === 'lpg' ? emissionFactors?.lpg : emissionFactors?.png} />
        {fuelType === 'lpg' && <span className={styles.efNote}>14.2 kg per cylinder × 2.98 kgCO₂/kg</span>}
      </div>

      {tco2e > 0 && (
        <div className={styles.result}>
          <span className={styles.resultScope}>Scope 1 — Cooking Fuel</span>
          <span className={styles.resultVal}>{fmtTco2e(tco2e)} tCO₂e</span>
        </div>
      )}

      <div className={styles.saveRow}>
        <button className={`${styles.saveBtn} ${saved ? styles.saveBtnDone : ''}`} onClick={handleSave} disabled={!qty || saved}>
          {saved ? '✓ Saved' : 'Save Cooking Fuel'}
        </button>
        <span className={styles.auditNote}>Saved entries are logged with your user ID and timestamp</span>
      </div>
    </div>
  )
}
