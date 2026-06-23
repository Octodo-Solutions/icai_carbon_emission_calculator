import { useState } from 'react'
import EfChip from '../../../../components/common/EfChip/EfChip'
import { calcAirTravel, calcRailTravel, calcRoadTravel } from '../../../../utils/calculations'
import { MAJOR_CITIES } from '../../../../data/cityDistances'
import { fmtTco2e } from '../../../../utils/formatters'
import styles from '../DataEntry.module.css'

export default function TravelModule({ onSave, emissionFactors }) {
  const [air, setAir] = useState({ from: 'Pune', to: 'Delhi', trips: '' })
  const [rail, setRail] = useState({ from: 'Pune', to: 'Mumbai', trips: '' })
  const [road, setRoad] = useState({ km: '', fuel: 'petrol' })
  const [saved, setSaved] = useState(false)

  const airT = air.trips ? calcAirTravel(air.from, air.to, parseInt(air.trips) || 0, emissionFactors?.airTravel?.value) : 0
  const railT = rail.trips ? calcRailTravel(rail.from, rail.to, parseInt(rail.trips) || 0, emissionFactors?.railTravel?.value) : 0
  const roadT = road.km ? calcRoadTravel(parseFloat(road.km) || 0, road.fuel, {
    petrol: emissionFactors?.road?.byFuel?.petrol?.value,
    diesel: emissionFactors?.road?.byFuel?.diesel?.value,
    cng: emissionFactors?.road?.byFuel?.cng?.value,
    ev: emissionFactors?.road?.byFuel?.ev?.value,
  }) : 0
  const total = airT + railT + roadT

  function handleSave() {
    onSave('travel', total)
    setSaved(true)
  }

  return (
    <div className={styles.moduleBody}>
      {/* Air travel */}
      <div className={styles.subSection}>
        <div className={styles.subTitle}>✈️ Air Travel</div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>From</label>
            <select className={styles.select} value={air.from} onChange={e => { setAir(p => ({ ...p, from: e.target.value })); setSaved(false) }}>
              {MAJOR_CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>To</label>
            <select className={styles.select} value={air.to} onChange={e => { setAir(p => ({ ...p, to: e.target.value })); setSaved(false) }}>
              {MAJOR_CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Round Trips</label>
            <input className={styles.input} type="number" min="0" placeholder="0" value={air.trips} onChange={e => { setAir(p => ({ ...p, trips: e.target.value })); setSaved(false) }} />
          </div>
        </div>
        <EfChip factor={emissionFactors?.airTravel} />
        {airT > 0 && <div className={styles.subResult}>{fmtTco2e(airT)} tCO₂e</div>}
      </div>

      {/* Rail travel */}
      <div className={styles.subSection}>
        <div className={styles.subTitle}>🚂 Rail Travel</div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>From</label>
            <select className={styles.select} value={rail.from} onChange={e => { setRail(p => ({ ...p, from: e.target.value })); setSaved(false) }}>
              {MAJOR_CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>To</label>
            <select className={styles.select} value={rail.to} onChange={e => { setRail(p => ({ ...p, to: e.target.value })); setSaved(false) }}>
              {MAJOR_CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Round Trips</label>
            <input className={styles.input} type="number" min="0" placeholder="0" value={rail.trips} onChange={e => { setRail(p => ({ ...p, trips: e.target.value })); setSaved(false) }} />
          </div>
        </div>
        <EfChip factor={emissionFactors?.railTravel} />
        {railT > 0 && <div className={styles.subResult}>{fmtTco2e(railT)} tCO₂e</div>}
      </div>

      {/* Road travel */}
      <div className={styles.subSection}>
        <div className={styles.subTitle}>🚗 Road Travel</div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Total Distance (km)</label>
            <input className={styles.input} type="number" min="0" placeholder="e.g. 800" value={road.km} onChange={e => { setRoad(p => ({ ...p, km: e.target.value })); setSaved(false) }} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Fuel Type</label>
            <select className={styles.select} value={road.fuel} onChange={e => { setRoad(p => ({ ...p, fuel: e.target.value })); setSaved(false) }}>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="cng">CNG</option>
              <option value="ev">Electric Vehicle</option>
            </select>
          </div>
        </div>
        {roadT > 0 && <div className={styles.subResult}>{fmtTco2e(roadT)} tCO₂e</div>}
      </div>

      {total > 0 && (
        <div className={styles.result}>
          <span className={styles.resultScope}>Scope 3 — Business Travel</span>
          <span className={styles.resultVal}>{fmtTco2e(total)} tCO₂e</span>
        </div>
      )}

      <div className={styles.saveRow}>
        <button className={`${styles.saveBtn} ${saved ? styles.saveBtnDone : ''}`} onClick={handleSave} disabled={total === 0 || saved}>
          {saved ? '✓ Saved' : 'Save Travel'}
        </button>
        <span className={styles.auditNote}>🔒 Saved entries are logged with your user ID and timestamp</span>
      </div>
    </div>
  )
}
