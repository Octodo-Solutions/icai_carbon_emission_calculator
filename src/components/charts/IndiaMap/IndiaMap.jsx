import { useState, useEffect, useMemo, useRef } from 'react'
import { geoMercator, geoPath } from 'd3-geo'
import styles from './IndiaMap.module.css'

const GEO_URL = `${import.meta.env.BASE_URL}india_states.geojson`
const WESTERN = ['Maharashtra', 'Gujarat', 'Rajasthan', 'Goa']

const STATUS_COLORS = {
  approved: 'var(--green)',
  pending: 'var(--amber)',
  'in-progress': 'var(--s2)',
  overdue: 'var(--red)',
}
const STATUS_LABELS = {
  approved: 'Submitted',
  pending: 'Pending Approval',
  'in-progress': 'In Progress',
  overdue: 'Overdue',
}

const W = 560
const H = 380
// Cropped to India's projected bounds (x[132..433] y[11..352]) so the map fills
// its panel edge to edge with no dead margins. The top is trimmed a little
// (y starts at 24) — the user is fine with a slight cut at the top.
const VIEWBOX = '120 24 326 336'

export default function IndiaMap({ branches = [], onBranchClick }) {
  const [geo, setGeo] = useState(null)
  const [error, setError] = useState(false)
  const [tip, setTip] = useState(null) // { branch, x, y }
  const wrapRef = useRef(null)

  useEffect(() => {
    let active = true
    fetch(GEO_URL)
      .then(r => { if (!r.ok) throw new Error('geo unavailable'); return r.json() })
      .then(d => { if (active) setGeo(d) })
      .catch(() => { if (active) setError(true) })
    return () => { active = false }
  }, [])

  // Projection is stable for the fixed viewBox — branch dots and state paths share it.
  const { pathGen, projection } = useMemo(() => {
    const projection = geoMercator()
      .center([82.5, 22])
      .scale(W * 1.05)
      .translate([W / 2, H / 2])
    return { projection, pathGen: geoPath().projection(projection) }
  }, [])

  function moveTip(e, branch) {
    const rect = wrapRef.current?.getBoundingClientRect()
    if (!rect) return
    setTip({ branch, x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.mapContainer} ref={wrapRef}>
        <svg viewBox={VIEWBOX} className={styles.svg} aria-label="India map showing branch locations">
          {/* state shapes */}
          {geo?.features.map((f, i) => (
            <path
              key={f.properties?.ST_NM || i}
              d={pathGen(f)}
              className={`${styles.state} ${WESTERN.includes(f.properties?.ST_NM) ? styles.stateWestern : styles.stateOther}`}
            />
          ))}

          {/* region label */}
          {geo && (
            <text x={projection([72.8, 19.2])[0] - 4} y={projection([72.8, 19.2])[1] - 70} className={styles.regionLabel}>
              Western Region
            </text>
          )}

          {/* branch dots */}
          {geo && branches.map(b => {
            if (b.lat == null || b.lng == null) return null
            const [x, y] = projection([b.lng, b.lat])
            const color = STATUS_COLORS[b.status] || '#888'
            const label = b.name.replace('ICAI ', '').replace(' Branch', '')
            return (
              <g
                key={b.key}
                style={{ cursor: 'pointer' }}
                onClick={() => onBranchClick?.(b)}
                onMouseEnter={e => moveTip(e, b)}
                onMouseMove={e => moveTip(e, b)}
                onMouseLeave={() => setTip(null)}
              >
                {b.status === 'overdue' && (
                  <circle cx={x} cy={y} r={11} fill="none" stroke={color} strokeWidth={1.5} opacity={0.4} />
                )}
                <circle cx={x} cy={y} r={7} fill={color} stroke="#fff" strokeWidth={2} className={styles.dot} />
                <text x={x} y={y + 18} textAnchor="middle" className={styles.cityLabel}>{label}</text>
              </g>
            )
          })}
        </svg>

        {/* hover tooltip */}
        {tip && (
          <div className={styles.tooltip} style={{ left: tip.x + 12, top: tip.y - 10 }}>
            <div className={styles.ttName}>{tip.branch.name}</div>
            <div>{tip.branch.tco2e != null ? `${tip.branch.tco2e} tCO₂e` : 'Not yet submitted'}</div>
            <div className={styles.ttStatus} style={{ color: STATUS_COLORS[tip.branch.status] }}>
              {STATUS_LABELS[tip.branch.status] || tip.branch.status}
            </div>
          </div>
        )}

        {!geo && !error && <div className={styles.overlay}>Loading map…</div>}
        {error && <div className={styles.overlay}>Map requires an internet connection</div>}
      </div>

      <div className={styles.legend}>
        {Object.entries(STATUS_LABELS).map(([status, label]) => (
          <div key={status} className={styles.legItem}>
            <span className={styles.legDot} style={{ background: STATUS_COLORS[status] }} />
            <span>{label === 'Pending Approval' ? 'Pending' : label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
