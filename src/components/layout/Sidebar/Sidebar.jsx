import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import {
  House, PencilLine, ChartBar, CalendarBlank, Clock,
  MapTrifold, Hourglass, Buildings, ChartPieSlice, FileText, Export,
  Bank, Flask, LockSimple, ShieldCheck, ClipboardText, DownloadSimple,
  Scales, Key, Question, ChatCircleText, ClockCounterClockwise, TrendUp,
  ChartLineUp, GlobeHemisphereEast, CheckCircle, MapPin,
} from '@phosphor-icons/react'
import styles from './Sidebar.module.css'

const StatusDot = ({ color }) => <span className={styles.statusDot} style={{ background: color }} />

const BRANCH_ITEMS = [
  { section: 'My Work' },
  { label: 'Dashboard', path: '/branch/dashboard', icon: <House size={16} /> },
  { label: 'Data Entry', path: '/branch/data-entry', icon: <PencilLine size={16} />, badge: '0/6' },
  { label: 'My Reports', path: '/branch/reports', icon: <ChartBar size={16} /> },
  { section: 'History' },
  { label: 'Past Submissions', icon: <ClockCounterClockwise size={16} /> },
  { label: 'Trends', icon: <TrendUp size={16} /> },
  { section: 'Support' },
  { label: 'Help & FAQs', icon: <Question size={16} /> },
  { label: 'Raise a Query', icon: <ChatCircleText size={16} /> },
  { section: 'Info' },
  { label: 'Reporting Period', icon: <CalendarBlank size={16} />, info: 'Q1 FY 2026-27' },
  { label: 'Due Date', icon: <Clock size={16} />, info: '31 Jul 2026' },
]

const REGIONAL_ITEMS = [
  { section: 'Western Region' },
  { label: 'Overview', path: '/regional/dashboard', icon: <MapTrifold size={16} /> },
  { label: 'Approvals', path: '/regional/dashboard', icon: <Hourglass size={16} />, badge: 3 },
  { label: 'All Branches', path: '/regional/dashboard', icon: <Buildings size={16} /> },
  { label: 'Aggregated Data', icon: <ChartPieSlice size={16} /> },
  { section: 'Reports' },
  { label: 'Regional Report', icon: <FileText size={16} /> },
  { label: 'Export', icon: <Export size={16} /> },
  { section: 'Sub-Regions' },
  { label: 'Maharashtra', icon: <StatusDot color="var(--green)" />, active: true },
  { label: 'Gujarat', icon: <StatusDot color="var(--amber)" /> },
  { label: 'Rajasthan', icon: <StatusDot color="var(--amber)" /> },
  { label: 'Goa', icon: <StatusDot color="var(--red)" /> },
]

const HO_ITEMS = [
  { section: 'National View' },
  { label: 'HO Dashboard', path: '/ho/dashboard', icon: <Bank size={16} /> },
  { label: 'National Emissions', path: '/ho/analytics', icon: <ChartLineUp size={16} /> },
  { label: 'All Regions', icon: <GlobeHemisphereEast size={16} /> },
  { label: 'All Branches', icon: <Buildings size={16} /> },
  { label: 'CA Firms', icon: <Scales size={16} /> },
  { section: 'Entity Management' },
  { label: 'Approval Queue', path: '/ho/dashboard', icon: <CheckCircle size={16} />, badge: 2 },
  { label: 'Regional Offices', icon: <MapPin size={16} /> },
  { section: 'Governance' },
  { label: 'Emission Factors', path: '/ho/analytics', icon: <Flask size={16} /> },
  { label: 'Access Control', icon: <Key size={16} /> },
  { label: 'Audit Trail', path: '/ho/dashboard', icon: <LockSimple size={16} /> },
  { label: 'DPDP Settings', path: '/ho/dashboard', icon: <ShieldCheck size={16} />, badge: '!' },
  { section: 'Reporting' },
  { label: 'BRSR Alignment', path: '/ho/analytics', icon: <ClipboardText size={16} /> },
  { label: 'Export Centre', path: '/ho/analytics', icon: <DownloadSimple size={16} /> },
  { label: 'Reporting Calendar', icon: <CalendarBlank size={16} /> },
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
