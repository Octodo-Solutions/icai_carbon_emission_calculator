import { useRef } from 'react'
import styles from './OtpInput.module.css'

export default function OtpInput({ value, onChange, length = 6 }) {
  const inputs = useRef([])

  function handleChange(i, e) {
    const ch = e.target.value.replace(/\D/g, '').slice(-1)
    const arr = value.split('')
    arr[i] = ch
    const next = arr.join('')
    onChange(next)
    if (ch && i < length - 1) inputs.current[i + 1]?.focus()
  }

  function handleKeyDown(i, e) {
    if (e.key === 'Backspace' && !value[i] && i > 0) inputs.current[i - 1]?.focus()
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    onChange(pasted.padEnd(length, ''))
    inputs.current[Math.min(pasted.length, length - 1)]?.focus()
    e.preventDefault()
  }

  return (
    <div className={styles.row}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={el => { inputs.current[i] = el }}
          className={styles.box}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  )
}
