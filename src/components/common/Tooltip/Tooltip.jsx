import { useState } from 'react'
import styles from './Tooltip.module.css'

export default function Tooltip({ title, content, anchor, children }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(v => !v)}
        onBlur={() => setOpen(false)}
        aria-label="More information"
      >
        {children || '?'}
      </button>
      {open && (
        <div className={styles.bubble}>
          {title && <div className={styles.bubbleTitle}>{title}</div>}
          <div className={styles.bubbleContent}>{content}</div>
          {anchor && <div className={styles.anchor}>{anchor}</div>}
        </div>
      )}
    </div>
  )
}
