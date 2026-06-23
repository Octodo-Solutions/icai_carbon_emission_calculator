import styles from './Badge.module.css'

export default function Badge({ children, variant = 'default', size = 'sm', dot }) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${styles[size]}`}>
      {dot && <span className={`${styles.dot} ${styles['dot-' + dot]}`} />}
      {children}
    </span>
  )
}
