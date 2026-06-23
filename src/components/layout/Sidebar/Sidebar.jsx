import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import styles from './Sidebar.module.css'

const BRANCH_ITEMS = [
  { section: 'My Work' },
  { label: 'Dashboard', path: '/branch/dashboard', icon: '🏠' },
  { label: 'Enter Data', path: '/branch/data-entry', icon: '📝' },
  { label: 'My Reports', path: '/branch/reports', icon: '📊' },
  { section: 'Info' },
  { label: 'Reporting Period', icon: '📅', info: 'Q1 FY 2026-27' },
  { label: 'Due Date', icon: '⏰', info: '31 Jul 2026' },
]

const REGIONAL_ITEMS = [
  { section: 'Western Region' },
  { label: 'Overview', path: '/regional/dashboard', icon: '🗺️' },
  { label: 'Pending Approvals', path: '/regional/dashboard', icon: '⏳', badge: 3 },
  { label: 'All Branches', path: '/regional/dashboard', icon: '🏢' },
  { section: 'Sub-Regions' },
  { label: 'Maharashtra', icon: '📍', active: true },
  { label: 'Gujarat', icon: '📍' },
  { label: 'Rajasthan', icon: '📍' },
  { label: 'Goa', icon: '📍' },
]

const HO_ITEMS = [
  { section: 'National View' },
  { label: 'HO Dashboard', path: '/ho/dashboard', icon: '🏛️' },
  { label: 'Analytics & Governance', path: '/ho/analytics', icon: '📊' },
  { section: 'Governance' },
  { label: 'Emission Factors', path: '/ho/analytics', icon: '⚗️' },
  { label: 'Audit Trail', path: '/ho/dashboard', icon: '🔒' },
  { label: 'DPDP Settings', path: '/ho/dashboard', icon: '🛡️', badge: '!' },
  { section: 'Reporting' },
  { label: 'BRSR Alignment', path: '/ho/analytics', icon: '📋' },
  { label: 'Export Centre', path: '/ho/analytics', icon: '⬇️' },
]

const ITEMS_MAP = { branch: BRANCH_ITEMS, regional: REGIONAL_ITEMS, ho: HO_ITEMS }

export default function Sidebar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const items = ITEMS_MAP[user?.role] || []

  return (
    <aside className={styles.sidebar}>
      <div className={styles.inner}>
        {items.map((item, i) => {
          if (item.section) return <div key={i} className={styles.section}>{item.section}</div>
          const isActive = item.path && location.pathname === item.path && !item.info
          return (
            <div
              key={i}
              className={`${styles.item} ${isActive ? styles.active : ''} ${item.path ? styles.clickable : ''} ${item.active ? styles.subActive : ''}`}
              onClick={() => item.path && navigate(item.path)}
            >
              <span className={styles.itemIcon}>{item.icon}</span>
              <span className={styles.itemLabel}>{item.label}</span>
              {item.badge && (
                <span className={`${styles.badge} ${item.badge === '!' ? styles.badgeAlert : ''}`}>
                  {item.badge}
                </span>
              )}
              {item.info && <span className={styles.itemInfo}>{item.info}</span>}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
