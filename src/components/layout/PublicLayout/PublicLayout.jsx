import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { useApp } from '../../../context/AppContext'
import styles from './PublicLayout.module.css'

const LOGO_SRC = `${import.meta.env.BASE_URL}logo-icai1.png`

// The landing page IS the Resource Centre, so that's the primary tab (active on '/').
// The brand logo doubles as the "return home" affordance.
const NAV = [
  { label: 'Resource Centre', to: '/' },
  { label: 'Help & Support', to: '/help' },
  { label: 'About', to: null },
]

const DASHBOARD_BY_ROLE = {
  branch: '/branch/dashboard',
  regional: '/regional/dashboard',
  ho: '/ho/dashboard',
}

// Shared chrome for the public (pre-login) pages: Home/Resource Centre and Help & Support.
// Authenticated pages use AppLayout instead. The `banner` slot lets each page supply its
// own access message under the header.
export default function PublicLayout({ banner, children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { showToast } = useApp()

  function handleNav(item) {
    if (!item.to) {
      showToast('About page coming soon', 'info')
      return
    }
    navigate(item.to)
  }

  function isActive(item) {
    return item.to === location.pathname
  }

  const dashboardPath = user ? DASHBOARD_BY_ROLE[user.role] : null

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand} onClick={() => navigate('/')}>
          <img src={LOGO_SRC} alt="ICAI" className={styles.logo} />
          <div className={styles.brandText}>
            <div className={styles.brandName}>ICAI Carbon Calculator</div>
            <div className={styles.brandSub}>Sustainability Reporting Standards Board</div>
          </div>
        </div>

        <nav className={styles.nav}>
          {NAV.map(item => (
            <button
              key={item.label}
              className={`${styles.navLink} ${isActive(item) ? styles.active : ''}`}
              onClick={() => handleNav(item)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {dashboardPath ? (
          <button className={styles.loginBtn} onClick={() => navigate(dashboardPath)}>
            Go to dashboard
          </button>
        ) : (
          <button className={styles.loginBtn} onClick={() => navigate('/login')}>
            Login
          </button>
        )}
      </header>

      {banner && <div className={styles.banner}>{banner}</div>}

      <main className={styles.main}>{children}</main>
    </div>
  )
}
