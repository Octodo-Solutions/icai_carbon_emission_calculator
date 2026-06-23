import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { useApp } from '../../../context/AppContext'
import { Lightning, Drop, Airplane, FileText, Flame, Bed, CalendarBlank, ChartBar, CheckCircle, TrendDown, Circle } from '@phosphor-icons/react'
import AppLayout from '../../../components/layout/AppLayout/AppLayout'
import KpiCard from '../../../components/common/KpiCard/KpiCard'
import SectionCard from '../../../components/common/SectionCard/SectionCard'
import Badge from '../../../components/common/Badge/Badge'
import Button from '../../../components/common/Button/Button'
import styles from './BranchDashboard.module.css'

const MODULES = [
  { key: 'electricity', label: 'Electricity', icon: <Lightning size={20} />, scope: 2, sub: 'Grid + DG Set' },
  { key: 'dg', label: 'DG Set / Diesel', icon: <Drop size={20} />, scope: 1, sub: 'Stationary combustion' },
  { key: 'travel', label: 'Business Travel', icon: <Airplane size={20} />, scope: 3, sub: 'Air · Rail · Road' },
  { key: 'paper', label: 'Paper & Waste', icon: <FileText size={20} />, scope: 3, sub: 'Office consumables' },
  { key: 'cooking', label: 'Cooking Fuel', icon: <Flame size={20} />, scope: 1, sub: 'LPG · PNG' },
  { key: 'hotel', label: 'Hotel Stay', icon: <Bed size={20} />, scope: 3, sub: 'Outstation travel' },
]

const SCOPE_COLORS = { 1: 'var(--s1)', 2: 'var(--s2)', 3: 'var(--s3)' }
const SCOPE_VARIANTS = { 1: 's1', 2: 's2', 3: 's3' }

const RECENT = [
  { action: 'Q4 FY 2025-26 report approved', time: '15 Apr 2026', dot: 'green' },
  { action: 'Annual GHG report generated', time: '12 Apr 2026', dot: '' },
  { action: 'Q3 FY 2025-26 report submitted', time: '28 Jan 2026', dot: '' },
]

export default function BranchDashboard() {
  const { user } = useAuth()
  const { submissions } = useApp()
  const navigate = useNavigate()

  const hasCurrentSubmission = submissions.length > 0

  const daysLeft = 38
  const isOverdue = daysLeft < 0

  return (
    <AppLayout>
      <div className={styles.page}>
        {/* Period banner */}
        <div className={styles.banner}>
          <div className={styles.bannerLeft}>
            <h1 className={styles.bannerTitle}>Q1 FY 2026-27</h1>
            <p className={styles.bannerSub}>{user?.periodLabel} · Due {user?.dueDate} · {user?.branchCode}</p>
          </div>
          <div className={styles.bannerRight}>
            {!hasCurrentSubmission ? (
              <>
                <div className={styles.countdown}>
                  <span className={styles.countdownNum}>{daysLeft}</span>
                  <span className={styles.countdownLbl}>days remaining</span>
                </div>
                <Button variant="gold" size="lg" onClick={() => navigate('/branch/data-entry')}>
                  Start Data Entry →
                </Button>
              </>
            ) : (
              <>
                <Badge variant="green" dot="green" size="md">Submitted</Badge>
                <Button variant="outline" onClick={() => navigate('/branch/reports')}>View Report</Button>
              </>
            )}
          </div>
        </div>

        {/* KPI row */}
        <div className={styles.kpiRow}>
          <KpiCard label="Current Period" value="Q1 FY 2026-27" sub="Apr – Jun 2026" icon={<CalendarBlank size={18} />} accent="navy" />
          <KpiCard label="Status" value={hasCurrentSubmission ? 'Submitted' : 'Not Started'} sub={hasCurrentSubmission ? 'Awaiting Regional review' : `${daysLeft} days to deadline`} icon={<ChartBar size={18} />} accent={hasCurrentSubmission ? 'green' : 'amber'} />
          <KpiCard label="Past Submissions" value="4" sub="All approved" icon={<CheckCircle size={18} />} accent="green" />
          <KpiCard label="Emission Trend" value="↓ 7.2%" sub="vs last quarter" icon={<TrendDown size={18} />} accent="green" trend={{ dir: 'down', label: 'improving' }} />
        </div>

        <div className={styles.grid}>
          {/* Module status */}
          <SectionCard
            title="Q1 Data Entry Modules"
            subtitle="6 modules to complete for Q1 FY 2026-27"
            action={
              <Button size="sm" onClick={() => navigate('/branch/data-entry')}>
                {hasCurrentSubmission ? 'View Data' : 'Enter Data'}
              </Button>
            }
          >
            <div className={styles.modules}>
              {MODULES.map(m => (
                <div key={m.key} className={`${styles.module} ${hasCurrentSubmission ? styles.moduleDone : ''}`}>
                  <div className={styles.moduleIcon}>{m.icon}</div>
                  <div className={styles.moduleBody}>
                    <div className={styles.moduleName}>{m.label}</div>
                    <div className={styles.moduleSub}>{m.sub}</div>
                  </div>
                  <Badge variant={SCOPE_VARIANTS[m.scope]} size="sm">Scope {m.scope}</Badge>
                  <div className={styles.moduleStatus}>
                    {hasCurrentSubmission
                      ? <CheckCircle size={16} weight="fill" color="var(--green)" />
                      : <Circle size={16} color="var(--border)" />}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Right column */}
          <div className={styles.rightCol}>
            <SectionCard title="Recent Activity">
              <div className={styles.activity}>
                {RECENT.map((r, i) => (
                  <div key={i} className={styles.actItem}>
                    <span className={`${styles.actDot} ${r.dot === 'green' ? styles.actDotGreen : styles.actDotGray}`} />
                    <div>
                      <div className={styles.actAction}>{r.action}</div>
                      <div className={styles.actTime}>{r.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Reduction Tips">
              <div className={styles.tips}>
                <div className={styles.tip}>Switch to LED lighting — saves ~15% electricity</div>
                <div className={styles.tip}>Replace short-haul flights with Rajdhani Express</div>
                <div className={styles.tip}>Enable e-invoicing to reduce paper consumption</div>
                <div className={styles.tip}>Explore MSEDCL green tariff for renewable energy</div>
              </div>
            </SectionCard>

            <div className={styles.helpCard}>
              <div className={styles.helpTitle}>Need help entering data?</div>
              <p className={styles.helpDesc}>Refer to the ICAI Data Entry Guide or contact your Regional Admin for support.</p>
              <Button variant="ghost" size="sm">Download Guide</Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
