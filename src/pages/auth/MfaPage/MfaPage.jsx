import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import OtpInput from '../../../components/common/OtpInput/OtpInput'
import styles from './MfaPage.module.css'

const METHODS = [
  { id: 'google', icon: '🔐', label: 'Google Authenticator', desc: 'Enter the 6-digit code from your app' },
  { id: 'ms', icon: '📱', label: 'Microsoft Authenticator', desc: 'Approve the push notification' },
  { id: 'sms', icon: '💬', label: 'SMS OTP', desc: 'Code sent to registered mobile' },
]

export default function MfaPage() {
  const [method, setMethod] = useState('google')
  const [otp, setOtp] = useState('')
  const [msPushed, setMsPushed] = useState(false)
  const { setMfaVerified, user } = useAuth()
  const navigate = useNavigate()

  function handleVerify() {
    if (method === 'ms' && !msPushed) {
      setMsPushed(true)
      setTimeout(() => proceed(), 1500)
      return
    }
    proceed()
  }

  function proceed() {
    setMfaVerified(true)
    if (!user) { navigate('/login'); return }
    if (user.role === 'branch') navigate('/consent')
    else if (user.role === 'regional') navigate('/regional/dashboard')
    else navigate('/ho/dashboard')
  }

  const showOtp = method === 'google' || method === 'sms'
  const canVerify = method === 'ms' || otp.length === 6

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <a className={styles.back} onClick={() => navigate('/login')}>← Back to login</a>

        <div className={styles.header}>
          <div className={styles.headerIcon}>🔒</div>
          <h2 className={styles.title}>Two-Step Verification</h2>
          <p className={styles.desc}>
            MFA is mandatory for all portal users per ICAI security policy (§4 Access &amp; Roles).
          </p>
        </div>

        <div className={styles.methods}>
          {METHODS.map(m => (
            <label key={m.id} className={`${styles.method} ${method === m.id ? styles.active : ''}`}>
              <input type="radio" name="mfa" value={m.id} checked={method === m.id} onChange={() => { setMethod(m.id); setOtp(''); setMsPushed(false) }} />
              <span className={styles.methodIcon}>{m.icon}</span>
              <div>
                <div className={styles.methodLabel}>{m.label}</div>
                <div className={styles.methodDesc}>{m.desc}</div>
              </div>
            </label>
          ))}
        </div>

        {showOtp && (
          <div className={styles.otpSection}>
            <div className={styles.otpLabel}>Enter 6-digit code</div>
            <OtpInput value={otp} onChange={setOtp} length={6} />
            <div className={styles.resend}>Didn't receive it? <a href="#">Resend code</a></div>
          </div>
        )}

        {method === 'ms' && !msPushed && (
          <div className={styles.pushNote}>
            A push notification will be sent to your registered device. Click Verify to send.
          </div>
        )}
        {method === 'ms' && msPushed && (
          <div className={styles.pushWait}>
            <span className={styles.spinner} /> Waiting for approval on your device…
          </div>
        )}

        <button className={styles.verify} disabled={!canVerify} onClick={handleVerify}>
          Verify &amp; Continue
        </button>

        <div className={styles.note}>
          🔒 This session will be logged with timestamp and IP address per audit requirements.
        </div>
      </div>
    </div>
  )
}
