import { useState } from 'react'
import EfChip from '../../../../components/common/EfChip/EfChip'
import { calcHotel } from '../../../../utils/calculations'
import { fmtTco2e } from '../../../../utils/formatters'
import styles from '../DataEntry.module.css'

export default function HotelStayModule({ onSave, emissionFactors }) {
  const [nights, setNights] = useState('')
  const [category, setCategory] = useState('mid')
  const [city, setCity] = useState('')
  const [saved, setSaved] = useState(false)

  const efMap = emissionFactors?.hotel?.byCategory
    ? {
        budget: emissionFactors.hotel.byCategory.budget.value,
        mid: emissionFactors.hotel.byCategory.mid.value,
        luxury: emissionFactors.hotel.byCategory.luxury.value,
      }
    : null

  const tco2e = nights ? calcHotel(parseInt(nights) || 0, category, efMap) : 0

  function handleSave() {
    onSave('hotel', tco2e)
    setSaved(true)
  }

  const catEf = emissionFactors?.hotel?.byCategory?.[category]

  return (
    <div className={styles.moduleBody}>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nights Stayed</label>
          <input className={styles.input} type="number" min="0" placeholder="e.g. 4" value={nights} onChange={e => { setNights(e.target.value); setSaved(false) }} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>City / Location</label>
          <input className={styles.input} type="text" placeholder="e.g. Delhi" value={city} onChange={e => setCity(e.target.value)} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Hotel Category</label>
          <select className={styles.select} value={category} onChange={e => { setCategory(e.target.value); setSaved(false) }}>
            <option value="budget">Budget (&lt; ₹3,000/night)</option>
            <option value="mid">Mid-Range (₹3,000–₹8,000)</option>
            <option value="luxury">Luxury (&gt; ₹8,000/night)</option>
          </select>
        </div>
      </div>

      {catEf && (
        <div className={styles.efRow}>
          <EfChip factor={{ ...emissionFactors.hotel, displayValue: catEf.displayValue, unit: 'kgCO₂e/night' }} />
          <span className={styles.efNote}>DEFRA accommodation factor</span>
        </div>
      )}

      {tco2e > 0 && (
        <div className={styles.result}>
          <span className={styles.resultScope}>Scope 3 — Hotel Stay</span>
          <span className={styles.resultVal}>{fmtTco2e(tco2e)} tCO₂e</span>
        </div>
      )}

      <div className={styles.saveRow}>
        <button className={`${styles.saveBtn} ${saved ? styles.saveBtnDone : ''}`} onClick={handleSave} disabled={!nights || saved}>
          {saved ? '✓ Saved' : 'Save Hotel Stay'}
        </button>
        <span className={styles.auditNote}>🔒 Saved entries are logged with your user ID and timestamp</span>
      </div>
    </div>
  )
}
