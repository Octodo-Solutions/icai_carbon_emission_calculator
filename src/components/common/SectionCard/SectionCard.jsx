import styles from './SectionCard.module.css'

export default function SectionCard({ title, subtitle, action, children, noPad, className = '' }) {
  return (
    <div className={`${styles.card} ${className}`}>
      {(title || action) && (
        <div className={styles.head}>
          <div>
            {title && <h4 className={styles.title}>{title}</h4>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {action && <div className={styles.action}>{action}</div>}
        </div>
      )}
      <div className={noPad ? styles.bodyNoPad : styles.body}>{children}</div>
    </div>
  )
}
