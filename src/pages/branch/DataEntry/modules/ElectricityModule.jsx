import { useState } from 'react'
import EfChip from '../../../../components/common/EfChip/EfChip'
import UploadZone from '../../../../components/common/UploadZone/UploadZone'
import { calcElectricity } from '../../../../utils/calculations'
import { fmtTco2e } from '../../../../utils/formatters'
import styles from '../DataEntry.module.css'

const SUPPLIERS = ['MSEDCL (Maharashtra)', 'BESCOM (Karnataka)', 'BSES Delhi', 'TNEB (Tamil Nadu)', 'DISCOM - Gujarat', 'CESC (Kolkata)', 'Other']

export default function ElectricityModule({ onSave, emissionFactors }) {
  const [kwh, setKwh] = useState('')
  const [supplier, setSupplier] = useState(SUPPLIERS[0])
  const [saved, setSaved] = useState(false)
  const ef = emissionFactors?.electricity

  const tco2e = kwh ? calcElectricity(parseFloat(kwh) || 0, ef?.value) : 0

  function handleOcr() {
    setKwh('4200')
  }

  function handleSave() {
    onSave('electricity', tco2e)
    setSaved(true)
  }

  return (
    <div className={styles.moduleBody}>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Electricity Consumed (kWh)</label>
          <input
            className={styles.input}
            type="number"
            min="0"
            placeholder="e.g. 4200"
            value={kwh}
            onChange={e => { setKwh(e.target.value); setSaved(false) }}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Supplier / DISCOM</label>
          <select className={styles.select} value={supplier} onChange={e => setSupplier(e.target.value)}>
            {SUPPLIERS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className={styles.efRow}>
        <EfChip factor={ef} />
        <span className={styles.efNote}>CEA national average grid factor</span>
      </div>

      <UploadZone onExtracted={handleOcr} label="electricity bill (PDF/image)" />

      {tco2e > 0 && (
        <div className={styles.result}>
          <span className={styles.resultScope}>Scope 2 — Electricity</span>
          <span className={styles.resultVal}>{fmtTco2e(tco2e)} tCO₂e</span>
        </div>
      )}

      <div className={styles.saveRow}>
        <button className={`${styles.saveBtn} ${saved ? styles.saveBtnDone : ''}`} onClick={handleSave} disabled={!kwh || saved}>
          {saved ? '✓ Saved' : 'Save Electricity'}
        </button>
        <span className={styles.auditNote}>🔒 Saved entries are logged with your user ID and timestamp</span>
      </div>
    </div>
  )
}
