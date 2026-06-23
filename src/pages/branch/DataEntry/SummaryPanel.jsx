import styles from './SummaryPanel.module.css'

const MODULES_META = {
  electricity: { icon: '⚡', label: 'Electricity', scope: 2 },
  dg:          { icon: '🛢️', label: 'DG Set',     scope: 1 },
  travel:      { icon: '✈️', label: 'Travel',     scope: 3 },
  paper:       { icon: '📄', label: 'Paper',      scope: 3 },
  cooking:     { icon: '🔥', label: 'Cooking',    scope: 1 },
  hotel:       { icon: '🏨', label: 'Hotel',      scope: 3 },
}

function ScopeBar({ label, value, total, color }) {
  const pct = total > 0 ? Math.min((value / total) * 100, 100) : 0
  return (
    <div className={styles.scopeBar}>
      <div className={styles.scopeBarHead}>
        <span className={styles.scopeBarLabel}>{label}</span>
        <span className={styles.scopeBarVal}>{value.toFixed(3)}</span>
      </div>
      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

export default function SummaryPanel({ moduleData, scopeTotals, onSubmit }) {
  const savedModules = Object.entries(moduleData).filter(([, d]) => d.saved)

  return (
    <div className={styles.panel}>
      <div className={styles.panelHead}>
        <div className={styles.panelTitle}>Q1 Summary</div>
        <div className={styles.periodLabel}>Apr – Jun 2026</div>
      </div>

      <div className={styles.totalWrap}>
        <div className={styles.totalVal}>{scopeTotals.total.toFixed(3)}</div>
        <div className={styles.totalUnit}>tCO₂e total</div>
      </div>

      <div className={styles.scopeBars}>
        <ScopeBar label="Scope 1 — Direct" value={scopeTotals.s1} total={scopeTotals.total} color="var(--s1)" />
        <ScopeBar label="Scope 2 — Energy" value={scopeTotals.s2} total={scopeTotals.total} color="var(--s2)" />
        <ScopeBar label="Scope 3 — Value Chain" value={scopeTotals.s3} total={scopeTotals.total} color="var(--s3)" />
      </div>

      <div className={styles.divider} />

      <div className={styles.checklist}>
        {Object.entries(MODULES_META).map(([key, meta]) => {
          const d = moduleData[key]
          return (
            <div key={key} className={`${styles.checkItem} ${d.saved ? styles.checkItemDone : ''}`}>
              <span className={styles.checkIcon}>{d.saved ? '✅' : '○'}</span>
              <span className={styles.checkMod}>{meta.icon} {meta.label}</span>
              {d.saved && <span className={styles.checkVal}>{d.tco2e.toFixed(3)}</span>}
            </div>
          )
        })}
      </div>

      <button
        className={styles.submitBtn}
        onClick={onSubmit}
        disabled={savedModules.length === 0}
      >
        Submit to Regional Admin
      </button>
    </div>
  )
}
