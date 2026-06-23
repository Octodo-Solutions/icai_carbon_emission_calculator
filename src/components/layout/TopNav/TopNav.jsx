import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import styles from './TopNav.module.css'

const NAV_LINKS = {
  branch: [
    { label: 'Dashboard', path: '/branch/dashboard' },
    { label: 'Enter Data', path: '/branch/data-entry' },
    { label: 'Reports', path: '/branch/reports' },
  ],
  regional: [
    { label: 'Dashboard', path: '/regional/dashboard' },
  ],
  ho: [
    { label: 'Dashboard', path: '/ho/dashboard' },
    { label: 'Analytics', path: '/ho/analytics' },
  ],
}

const ROLE_LABELS = { branch: 'Branch User', regional: 'Regional Admin', ho: 'HO Admin' }
const PERIOD = 'FY 2026-27 · Q1'

export default function TopNav() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const links = NAV_LINKS[user?.role] || []

  function switchRole(role) {
    const paths = { branch: '/branch/dashboard', regional: '/regional/dashboard', ho: '/ho/dashboard' }
    navigate(paths[role])
  }

  return (
    <header className={styles.nav}>
      <div className={styles.brand}>
        <div className={styles.brandIcon}>🌿</div>
        <div>
          <div className={styles.brandName}>ICAI Carbon Calculator</div>
          <div className={styles.period}>{PERIOD}</div>
        </div>
      </div>

      <nav className={styles.links}>
        {links.map(l => (
          <a
            key={l.path}
            className={`${styles.link} ${location.pathname === l.path ? styles.active : ''}`}
            onClick={() => navigate(l.path)}
          >
            {l.label}
          </a>
        ))}
      </nav>

      <div className={styles.right}>
        {(user?.role === 'regional' || user?.role === 'ho') && (
          <div className={styles.switcher}>
            {user.role !== 'branch' && <button className={styles.switchBtn} onClick={() => switchRole('branch')}>Branch</button>}
            {user.role !== 'regional' && <button className={styles.switchBtn} onClick={() => switchRole('regional')}>Regional</button>}
            {user.role !== 'ho' && <button className={styles.switchBtn} onClick={() => switchRole('ho')}>HO Admin</button>}
          </div>
        )}
        <span className={styles.rolePill}>{ROLE_LABELS[user?.role]}</span>
        <div className={styles.avatar} title={user?.personName}>
          {user?.initials}
        </div>
        <button className={styles.logout} onClick={() => { logout(); navigate('/login') }}>
          Sign out
        </button>
      </div>
    </header>
  )
}
