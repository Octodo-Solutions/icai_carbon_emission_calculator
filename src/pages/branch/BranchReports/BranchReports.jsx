import { useState, useEffect } from 'react'
import { useApp } from '../../../context/AppContext'
import AppLayout from '../../../components/layout/AppLayout/AppLayout'
import KpiCard from '../../../components/common/KpiCard/KpiCard'
import SectionCard from '../../../components/common/SectionCard/SectionCard'
import Badge from '../../../components/common/Badge/Badge'
import Button from '../../../components/common/Button/Button'
import ScopeDonut from '../../../components/charts/ScopeDonut/ScopeDonut'
import MonthlyStackedBar from '../../../components/charts/MonthlyStackedBar/MonthlyStackedBar'
import { MOCK_SUBMISSION_PUNE } from '../../../data/mockSubmissions'
import styles from './BranchReports.module.css'

function AiInsightPanel({ insight }) {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={styles.aiPanel}>
      <div className={styles.aiHead}>
        <span>🤖 AI Emission Insight</span>
        <span className={styles.aiBadge}>Powered by GenAI</span>
      </div>
      <div className={styles.aiBody}>
        {loading ? (
          <div className={styles.aiLoading}>
            <div className={styles.aiSpinner} />
            <span>Analysing your Q1 emission profile…</span>
          </div>
        ) : (
          <>
            <p className={styles.aiSummary}>{insight.summary}</p>
            <div className={styles.aiRecs}>
              {insight.recommendations.map((r, i) => (
                <div key={i} className={styles.aiRec}>
                  <div className={styles.aiRecHead}>
                    <span>{r.emoji}</span>
                    <span className={styles.aiRecTitle}>{r.title}</span>
                    <span className={styles.aiSaving}>{r.saving}</span>
                  </div>
                  <p className={styles.aiRecDetail}>{r.detail}</p>
                </div>
              ))}
            </div>
            <div className={styles.aiFooter}>🔒 Your data is not shared with external AI engines</div>
          </>
        )}
      </div>
    </div>
  )
}

function AuditTrail({ trail }) {
  return (
    <div className={styles.audit}>
      {trail.map((e, i) => (
        <div key={i} className={styles.auditRow}>
          <span className={`${styles.auditDot} ${e.dot === 'green' ? styles.auditDotGreen : styles.auditDotGray}`} />
          <div className={styles.auditContent}>
            <div className={styles.auditAction}>{e.action}</div>
            <div className={styles.auditMeta}>{e.user} · {e.time}</div>
          </div>
        </div>
      ))}
      <div className={styles.auditFooter}>Factor version: CEA v19 · Immutable log · DPDP §4 compliant</div>
    </div>
  )
}

export default function BranchReports() {
  const { submissions, showToast } = useApp()

  const sub = submissions[0] || MOCK_SUBMISSION_PUNE

  function handleExport(type) {
    showToast(`${type} export generated — file downloading…`)
  }

  return (
    <AppLayout>
      <div className={styles.page}>
        {/* header */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Q1 FY 2026-27 — Emission Report</h1>
            <p className={styles.pageMeta}>{sub.branch} · {sub.periodLabel} · Submitted {sub.submittedAt}</p>
          </div>
          <div className={styles.exports}>
            <Button variant="ghost" size="sm" onClick={() => handleExport('Excel')}>⬇ Excel</Button>
            <Button variant="ghost" size="sm" onClick={() => handleExport('PDF')}>⬇ PDF</Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('Share link')}>🔗 Share</Button>
          </div>
        </div>

        {/* Status bar */}
        <div className={styles.statusBar}>
          <div className={styles.statusLeft}>
            <span className={styles.statusIcon}>✅</span>
            <span className={styles.statusText}>Submitted successfully · {sub.submittedAt}</span>
          </div>
          <Badge variant="amber" dot="amber" size="md">Awaiting Regional Approval</Badge>
        </div>

        {/* KPIs */}
        <div className={styles.kpiRow}>
          <KpiCard label="Total Emissions" value={`${sub.total.toFixed(3)}`} sub="tCO₂e this quarter" icon="🌍" accent="navy" />
          <KpiCard label="Scope 1 — Direct" value={sub.s1.toFixed(3)} sub="tCO₂e (DG + Cooking)" icon="🛢️" accent="s1" />
          <KpiCard label="Scope 2 — Energy" value={sub.s2.toFixed(3)} sub="tCO₂e (Grid electricity)" icon="⚡" accent="s2" />
          <KpiCard label="Scope 3 — Value Chain" value={sub.s3.toFixed(3)} sub="tCO₂e (Travel + Waste)" icon="✈️" accent="s3" />
        </div>

        {/* Charts */}
        <div className={styles.chartGrid}>
          <SectionCard title="Scope Breakdown" subtitle="Q1 FY 2026-27">
            <div className={styles.donutWrap}>
              <ScopeDonut s1={sub.s1} s2={sub.s2} s3={sub.s3} total={sub.total} />
            </div>
          </SectionCard>
          <SectionCard title="Monthly Emission Trend" subtitle="Q1 FY 2026-27 — stacked by scope">
            <MonthlyStackedBar data={sub.monthlyBreakdown} />
          </SectionCard>
        </div>

        {/* AI + Audit */}
        <div className={styles.bottomGrid}>
          <SectionCard title="AI Insights & Recommendations" noPad>
            <AiInsightPanel insight={sub.aiInsight} />
          </SectionCard>
          <SectionCard title="Audit Trail" subtitle="Immutable activity log" noPad>
            <AuditTrail trail={sub.auditTrail} />
          </SectionCard>
        </div>
      </div>
    </AppLayout>
  )
}
