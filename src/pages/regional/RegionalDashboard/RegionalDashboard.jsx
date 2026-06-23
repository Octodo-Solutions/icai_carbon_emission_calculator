import { useState } from 'react'
import { useApp } from '../../../context/AppContext'
import AppLayout from '../../../components/layout/AppLayout/AppLayout'
import KpiCard from '../../../components/common/KpiCard/KpiCard'
import SectionCard from '../../../components/common/SectionCard/SectionCard'
import Badge from '../../../components/common/Badge/Badge'
import Button from '../../../components/common/Button/Button'
import Modal from '../../../components/common/Modal/Modal'
import IndiaMap from '../../../components/charts/IndiaMap/IndiaMap'
import { REGIONAL_SUMMARY } from '../../../data/mockBranches'
import { fmtTco2e } from '../../../utils/formatters'
import styles from './RegionalDashboard.module.css'

const STATUS_BADGE = {
  approved: 'green', pending: 'amber', 'in-progress': 'navy', overdue: 'red',
}
const STATUS_LABELS = {
  approved: 'Approved', pending: 'Pending Approval', 'in-progress': 'In Progress', overdue: 'Overdue',
}

function BranchDrillModal({ branch, onClose, onApprove }) {
  if (!branch) return null
  const hasData = branch.breakdown !== null
  const max = hasData ? Math.max(...Object.values(branch.breakdown)) : 1
  return (
    <Modal open={!!branch} onClose={onClose} title={branch.name} width={520}>
      <div className={styles.drillBody}>
        <div className={styles.drillKpi}>
          <div className={styles.drillKpiItem}>
            <div className={styles.drillKpiVal}>{branch.tco2e ?? '—'}</div>
            <div className={styles.drillKpiLbl}>tCO₂e Total</div>
          </div>
          <div className={styles.drillKpiItem} style={{ color: 'var(--s1)' }}>
            <div className={styles.drillKpiVal}>{branch.scopeData?.s1 ?? '—'}</div>
            <div className={styles.drillKpiLbl}>Scope 1</div>
          </div>
          <div className={styles.drillKpiItem} style={{ color: 'var(--s2)' }}>
            <div className={styles.drillKpiVal}>{branch.scopeData?.s2 ?? '—'}</div>
            <div className={styles.drillKpiLbl}>Scope 2</div>
          </div>
          <div className={styles.drillKpiItem} style={{ color: 'var(--s3)' }}>
            <div className={styles.drillKpiVal}>{branch.scopeData?.s3 ?? '—'}</div>
            <div className={styles.drillKpiLbl}>Scope 3</div>
          </div>
        </div>

        {hasData && (
          <div className={styles.drillBars}>
            <div className={styles.drillBarsTitle}>Activity Breakdown</div>
            {Object.entries(branch.breakdown).map(([key, val]) => (
              <div key={key} className={styles.drillBar}>
                <span className={styles.drillBarLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                <div className={styles.drillBarTrack}>
                  <div className={styles.drillBarFill} style={{ width: `${(val / max) * 100}%` }} />
                </div>
                <span className={styles.drillBarVal}>{val.toFixed(3)}</span>
              </div>
            ))}
          </div>
        )}

        <div className={styles.drillNote}>🔒 You can approve or query but cannot edit branch data</div>

        <div className={styles.drillActions}>
          <Button variant="ghost" onClick={onClose}>Raise Query</Button>
          {branch.status === 'pending' && (
            <Button variant="green" onClick={() => { onApprove(branch.key); onClose() }}>
              ✓ Approve Submission
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default function RegionalDashboard() {
  const { branches, approveSubmission, showToast } = useApp()
  const [selectedBranch, setSelectedBranch] = useState(null)
  const [filterState, setFilterState] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const submitted = branches.filter(b => b.status === 'approved' || b.status === 'pending').length
  const pending = branches.filter(b => b.status === 'pending').length
  const overdue = branches.filter(b => b.status === 'overdue').length

  const filtered = branches.filter(b => {
    if (filterState !== 'all' && b.state !== filterState) return false
    if (filterStatus !== 'all' && b.status !== filterStatus) return false
    return true
  })

  const states = [...new Set(branches.map(b => b.state))].sort()

  function handleApprove(key) {
    approveSubmission(key)
    showToast('Branch submission approved')
  }

  return (
    <AppLayout>
      <div className={styles.page}>
        {/* RBAC banner */}
        <div className={styles.rbacBanner}>
          🔐 <strong>Western Region Admin view</strong> — You see 42 branches across Maharashtra, Gujarat, Rajasthan &amp; Goa
        </div>

        {/* KPIs */}
        <div className={styles.kpiRow}>
          <KpiCard label="Regional Total" value={`${REGIONAL_SUMMARY.total} t`} sub="tCO₂e submitted Q1 26-27" icon="🌍" accent="navy" />
          <KpiCard label="Branches Submitted" value={`${submitted} of ${REGIONAL_SUMMARY.branchesTotal}`} sub={`${Math.round((submitted / REGIONAL_SUMMARY.branchesTotal) * 100)}% completion rate`} icon="🏢" accent="green" />
          <KpiCard label="Pending Approval" value={pending} sub="awaiting your review" icon="⏳" accent="amber" />
          <KpiCard label="Overdue" value={overdue} sub="past submission deadline" icon="⚠️" accent="red" />
        </div>

        {/* Map + Approvals */}
        <div className={styles.grid}>
          <SectionCard title="Branch Locations — Western Region" subtitle="Click a branch marker to view details">
            <div className={styles.mapWrap}>
              <IndiaMap branches={branches} onBranchClick={setSelectedBranch} />
            </div>
          </SectionCard>

          <div className={styles.rightCol}>
            <SectionCard title="Pending Approvals" subtitle={`${pending} awaiting your review`}>
              {branches.filter(b => b.status === 'pending').map(b => (
                <div key={b.key} className={styles.approvalItem}>
                  <div className={styles.approvalHead}>
                    <div>
                      <div className={styles.approvalName}>{b.name}</div>
                      <div className={styles.approvalMeta}>{b.modules}/6 modules · {b.electricity_kwh ? `${b.electricity_kwh.toLocaleString()} kWh` : ''} · Submitted {b.submittedDate}</div>
                    </div>
                    <div className={styles.approvalTco2e}>{b.tco2e} <span>tCO₂e</span></div>
                  </div>
                  <div className={styles.approvalActions}>
                    <Button variant="ghost" size="sm" onClick={() => showToast('Query sent to branch', 'info')}>Raise Query</Button>
                    <Button variant="green" size="sm" onClick={() => handleApprove(b.key)}>✓ Approve</Button>
                  </div>
                </div>
              ))}
              {pending === 0 && <div className={styles.noApprovals}>✅ All pending submissions reviewed</div>}
            </SectionCard>
          </div>
        </div>

        {/* Branch table */}
        <SectionCard
          title="All Branches — Western Region"
          action={
            <div className={styles.filters}>
              <select className={styles.filter} value={filterState} onChange={e => setFilterState(e.target.value)}>
                <option value="all">All States</option>
                {states.map(s => <option key={s}>{s}</option>)}
              </select>
              <select className={styles.filter} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          }
          noPad
        >
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Branch</th>
                <th>State</th>
                <th>Status</th>
                <th>tCO₂e</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.key} className={styles.row} onClick={() => setSelectedBranch(b)}>
                  <td className={styles.branchName}>{b.name}</td>
                  <td className={styles.td}>{b.state}</td>
                  <td className={styles.td}>
                    <Badge variant={STATUS_BADGE[b.status]} dot={STATUS_BADGE[b.status] === 'green' ? 'green' : STATUS_BADGE[b.status] === 'amber' ? 'amber' : STATUS_BADGE[b.status] === 'red' ? 'red' : 'navy'}>
                      {STATUS_LABELS[b.status]}
                    </Badge>
                  </td>
                  <td className={styles.td}>{b.tco2e ? `${b.tco2e} t` : '—'}</td>
                  <td className={styles.td}>
                    {b.status === 'pending' && (
                      <Button size="sm" variant="green" onClick={e => { e.stopPropagation(); handleApprove(b.key) }}>Approve</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      </div>

      <BranchDrillModal branch={selectedBranch} onClose={() => setSelectedBranch(null)} onApprove={handleApprove} />
    </AppLayout>
  )
}
