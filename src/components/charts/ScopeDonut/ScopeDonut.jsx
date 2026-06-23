import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { fmtTco2e } from '../../../utils/formatters'
import styles from './ScopeDonut.module.css'

const COLORS = ['var(--s1)', 'var(--s2)', 'var(--s3)']

export default function ScopeDonut({ s1, s2, s3, total }) {
  const data = [
    { name: 'Scope 1 — Direct', value: s1 || 0, pct: total ? Math.round((s1 / total) * 100) : 0 },
    { name: 'Scope 2 — Energy', value: s2 || 0, pct: total ? Math.round((s2 / total) * 100) : 0 },
    { name: 'Scope 3 — Value Chain', value: s3 || 0, pct: total ? Math.round((s3 / total) * 100) : 0 },
  ]

  return (
    <div className={styles.wrap}>
      <div className={styles.chartWrap}>
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie>
            <Tooltip
              formatter={(val) => [`${fmtTco2e(val)} tCO₂e`]}
              contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid var(--border)' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.center}>
          <div className={styles.totalVal}>{fmtTco2e(total)}</div>
          <div className={styles.totalLbl}>tCO₂e</div>
        </div>
      </div>
      <div className={styles.legend}>
        {data.map((d, i) => (
          <div key={i} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: COLORS[i] }} />
            <span className={styles.legendName}>{d.name}</span>
            <span className={styles.legendVal}>{fmtTco2e(d.value)}</span>
            <span className={styles.legendPct}>{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
