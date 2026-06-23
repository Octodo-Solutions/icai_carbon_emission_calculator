import { useState } from 'react'
import { INDIA_OUTLINE, WESTERN_REGION } from './indiaOutline'
import styles from './IndiaMap.module.css'

const STATUS_COLORS = {
  approved: '#2D7A4F',
  pending: '#E67E22',
  'in-progress': '#2980B9',
  overdue: '#C0392B',
}

export default function IndiaMap({ branches = [], onBranchClick }) {
  const [hovered, setHovered] = useState(null)

  const hov = branches.find(b => b.key === hovered)

  return (
    <div className={styles.wrap}>
      <svg viewBox="0 0 460 540" className={styles.svg} aria-label="India map showing branch locations">
        {/* base outline */}
        <path d={INDIA_OUTLINE} fill="#D4DFF0" stroke="#B8C8E0" strokeWidth="1.5" />
        {/* western region highlight */}
        <path d={WESTERN_REGION} fill="#B8CCE8" stroke="#8AA8D8" strokeWidth="1" />

        {/* branch dots */}
        {branches.map(b => (
          <g key={b.key}
            className={styles.dot}
            onClick={() => onBranchClick?.(b)}
            onMouseEnter={() => setHovered(b.key)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: 'pointer' }}
          >
            <circle cx={b.mapX} cy={b.mapY} r={9} fill="white" opacity={0.7} />
            <circle cx={b.mapX} cy={b.mapY} r={6}
              fill={STATUS_COLORS[b.status] || '#999'}
              stroke="white"
              strokeWidth="2"
            />
          </g>
        ))}

        {/* region label */}
        <text x="168" y="185" fontSize="10" fill="#003087" fontWeight="600" opacity="0.7">Western</text>
        <text x="168" y="197" fontSize="9" fill="#5A6478" opacity="0.7">Region</text>
      </svg>

      {/* hover tooltip */}
      {hov && (
        <div className={styles.tooltip}>
          <div className={styles.ttName}>{hov.name}</div>
          <div className={styles.ttRow}>
            <span>{hov.state}</span>
            <span className={styles.ttStatus}
              style={{ color: STATUS_COLORS[hov.status] }}>
              ● {hov.status === 'in-progress' ? 'In Progress' : hov.status.charAt(0).toUpperCase() + hov.status.slice(1)}
            </span>
          </div>
          {hov.tco2e && <div className={styles.ttVal}>{hov.tco2e} tCO₂e</div>}
        </div>
      )}

      <div className={styles.legend}>
        {Object.entries(STATUS_COLORS).map(([s, c]) => (
          <div key={s} className={styles.legItem}>
            <span className={styles.legDot} style={{ background: c }} />
            <span>{s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
