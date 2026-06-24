import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { Leaf } from '@phosphor-icons/react'
import styles from './LoginPage.module.css'

const DEMO_USERS = [
  { label: 'Branch User', email: 'pune@icai.in', password: 'demo123', role: 'branch' },
  { label: 'Regional Admin', email: 'western@icai.in', password: 'demo123', role: 'regional' },
  { label: 'HO Admin', email: 'admin@icai.in', password: 'demo123', role: 'ho' },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const result = login(email, password)
    if (result.ok) {
      navigate('/mfa')
    } else {
      setError('Invalid credentials. Use the quick-login below.')
    }
  }

  function quickLogin(user) {
    setEmail(user.email)
    setPassword(user.password)
    const result = login(user.email, user.password)
    if (result.ok) navigate('/mfa')
  }

  return (
    <div className={styles.page}>
      {/* Left panel */}
      <div className={styles.left}>
        <div className={styles.leftContent}>
          <div className={styles.brand}>
            <span className={styles.brandIcon}><Leaf size={22} weight="light" /></span>
            <span className={styles.brandName}>ICAI Carbon Calculator</span>
          </div>
          <h1 className={styles.headline}>
            Measure.<br />Report.<br /><span className={styles.gold}>Reduce.</span>
          </h1>
          <p className={styles.desc}>
            India's standardised GHG emission reporting platform for ICAI branch offices, regional offices, and CA firms. Built on GHG Protocol and India-specific emission factors.
          </p>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statVal}>183+</div>
              <div className={styles.statLbl}>ICAI Branches</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statVal}>1,247</div>
              <div className={styles.statLbl}>CA Firms</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statVal}>GHG</div>
              <div className={styles.statLbl}>Protocol Aligned</div>
            </div>
          </div>
        </div>
        <div className={styles.deco1} />
        <div className={styles.deco2} />
      </div>

      {/* Right panel */}
      <div className={styles.right}>
        <div className={styles.formCard}>
          <div className={styles.formLogo}>
            <img src={`${import.meta.env.BASE_URL}logo-icai1.png`} alt="The Institute of Chartered Accountants of India" />
          </div>
          <div className={styles.eyebrow}>Branch / CA Firm / Admin Portal</div>
          <h2 className={styles.formTitle}>Sign in to your account</h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Entity ID / Email</label>
              <input
                className={styles.input}
                type="email"
                placeholder="your@icai.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>
                Password
                <a className={styles.forgot} href="#">Forgot?</a>
              </label>
              <input
                className={styles.input}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <button type="submit" className={styles.signIn}>Sign In →</button>
          </form>

          <div className={styles.divider}><span>Quick demo login</span></div>
          <div className={styles.demoRow}>
            {DEMO_USERS.map(u => (
              <button key={u.role} className={`${styles.demoBtn} ${styles['demo-' + u.role]}`} onClick={() => quickLogin(u)}>
                {u.label}
              </button>
            ))}
          </div>

          <div className={styles.security}>
            TLS 1.3 encrypted · MFA enforced · DPDP Act 2023 compliant
          </div>
        </div>

        <div className={styles.steps}>
          <div className={styles.step}><span className={styles.stepNum}>1</span> Verify with MFA</div>
          <div className={styles.stepArrow}>→</div>
          <div className={styles.step}><span className={styles.stepNum}>2</span> Data consent</div>
          <div className={styles.stepArrow}>→</div>
          <div className={styles.step}><span className={styles.stepNum}>3</span> Start reporting</div>
        </div>
      </div>
    </div>
  )
}
