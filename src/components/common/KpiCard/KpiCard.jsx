import styles from './KpiCard.module.css'

export default function KpiCard({ label, value, sub, icon, accent, trend }) {
  return (
    <div className={`${styles.card} ${accent ? styles['accent-' + accent] : ''}`}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.body}>
        <div className={styles.label}>{label}</div>
        <div className={styles.value}>{value}</div>
        {sub && <div className={styles.sub}>{sub}</div>}
        {trend && (
          <div className={`${styles.trend} ${styles['trend-' + trend.dir]}`}>
            {trend.dir === 'up' ? '↑' : '↓'} {trend.label}
          </div>
        )}
      </div>
    </div>
  )
}
