import { useState } from 'react'
import { useApp } from '../../../context/AppContext'
import { MOCK_CA_FIRMS } from '../../../data/mockBranches'
import { ShieldCheck, Buildings, Bank, ChartBar, Hourglass } from '@phosphor-icons/react'
import AppLayout from '../../../components/layout/AppLayout/AppLayout'
import KpiCard from '../../../components/common/KpiCard/KpiCard'
import SectionCard from '../../../components/common/SectionCard/SectionCard'
import Badge from '../../../components/common/Badge/Badge'
import Button from '../../../components/common/Button/Button'
import Tooltip from '../../../components/common/Tooltip/Tooltip'
import styles from './HODashboard.module.css'

export default function HODashboard() {
  const { hoApprovals, approveHoEntity, branches, showToast } = useApp()
  const [freqOverrides, setFreqOverrides] = useState({})
  const [entitySearch, setEntitySearch] = useState('')
  const [entityType, setEntityType] = useState('all')

  const activeBranches = branches.filter(b => b.status !== 'overdue' && b.tco2e !== null).length
  const submitted = branches.filter(b => b.status === 'approved').length

  const entities = [...branches.map(b => ({ ...b, type: 'branch' })), ...MOCK_CA_FIRMS]
  const filteredEntities = entities.filter(b => {
    if (entityType === 'branch' && b.type === 'firm') return false
    if (entityType === 'firm' && b.type !== 'firm') return false
    return b.name.toLowerCase().includes(entitySearch.toLowerCase())
  })

  function handleApprove(id, name) {
    approveHoEntity(id)
    showToast(`${name} approved — welcome email triggered`)
  }

  function handleReject(id) {
    approveHoEntity(id)
    showToast('Entity registration rejected', 'error')
  }

  return (
    <AppLayout>
      <div className={styles.page}>
        {/* Page header */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Head Office Admin Dashboard</h1>
            <p className={styles.pageSub}>ICAI Bhawan, New Delhi · FY 2026-27 · Q1 Active</p>
          </div>
          <div className={styles.headerActions}>
            <Button variant="outline" onClick={() => showToast('National report exported')}>Export Report</Button>
            <Button onClick={() => showToast('Entity registration form opening…')}>+ Register Entity</Button>
          </div>
        </div>

        {/* DPDP banner */}
        <div className={styles.dpdpBanner}>
          <div className={styles.dpdpLeft}>
            <span className={styles.dpdpIcon}><ShieldCheck size={22} /></span>
            <div>
              <div className={styles.dpdpTitle}>DPDP Act 2023 — Data Fiduciary Configuration</div>
              <div className={styles.dpdpDesc}>ICAI is designated as Data Fiduciary. All entity onboarding triggers a consent collection workflow. Personal data of branch users and CA members is processed only after explicit, informed consent is recorded with timestamp.</div>
            </div>
          </div>
          <div className={styles.dpdpRight}>
            <Badge variant="green" dot="green">Compliant</Badge>
            <Tooltip
              title="WHY THIS EXISTS"
              content="ICAI is classified as a Significant Data Fiduciary under DPDP Act 2023 for processing Chartered Accountants' professional data. HO must configure and attest data processing purposes annually."
              anchor="DPDP Act 2023, §10 — Significant Data Fiduciaries"
            />
          </div>
        </div>

        {/* KPIs */}
        <div className={styles.kpiRow}>
          <KpiCard label="Active Branches" value={`183 of 185`} sub="2 pending registration" icon={<Buildings size={18} />} accent="navy" />
          <KpiCard label="CA Firms Onboarded" value="1,247" sub="+12 this quarter" icon={<Bank size={18} />} accent="gold" />
          <KpiCard label="Q1 Submissions" value={`94 of 183`} sub={`51% complete`} icon={<ChartBar size={18} />} accent="green" />
          <KpiCard label="Approval Queue" value={hoApprovals.length} sub="awaiting HO review" icon={<Hourglass size={18} />} accent={hoApprovals.length > 0 ? 'amber' : 'green'} />
        </div>

        <div className={styles.grid}>
          {/* Approval queue */}
          <SectionCard
            title="Entity Approval Queue"
            subtitle="New registrations requiring HO review and activation"
            action={
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Badge variant={hoApprovals.length > 0 ? 'amber' : 'green'} size="md">
                  {hoApprovals.length} Awaiting Action
                </Badge>
                <Tooltip
                  title="APPROVAL WORKFLOW"
                  content="Approved entities receive a system-generated welcome email with login credentials and reporting guide. Consent collection workflow is triggered automatically on first login."
                  anchor="ICAI RFP §5 User Access & Roles"
                />
              </div>
            }
          >
            {hoApprovals.length === 0 ? (
              <div className={styles.noQueue}>Approval queue is clear</div>
            ) : (
              <div className={styles.queueItems}>
                {hoApprovals.map(entity => (
                  <div key={entity.id} className={styles.queueItem}>
                    <div className={styles.queueIcon}>
                      {entity.entityType === 'branch' ? <Buildings size={18} /> : <Bank size={18} />}
                    </div>
                    <div className={styles.queueBody}>
                      <div className={styles.queueName}>{entity.name}</div>
                      <div className={styles.queueMeta}>
                        {entity.type} · {entity.region}
                      </div>
                    </div>
                    <div className={styles.queueFreq}>
                      <label className={styles.freqLabel}>Reporting</label>
                      <select
                        className={styles.freqSelect}
                        value={freqOverrides[entity.id] || entity.frequency}
                        onChange={e => setFreqOverrides(p => ({ ...p, [entity.id]: e.target.value }))}
                      >
                        <option>Quarterly</option>
                        <option>Monthly</option>
                        <option>Annual</option>
                      </select>
                    </div>
                    <div className={styles.queueActions}>
                      <Button variant="green" size="sm" onClick={() => handleApprove(entity.id, entity.name)}>Approve</Button>
                      <Button variant="danger-outline" size="sm" onClick={() => handleReject(entity.id)}>Reject</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Active entities */}
          <SectionCard
            title="Active Entities"
            subtitle="Q1 FY 2026-27 · branches & CA firms"
            action={
              <div className={styles.entToolbar}>
                <input
                  className={styles.entSearch}
                  placeholder="Search entities…"
                  value={entitySearch}
                  onChange={e => setEntitySearch(e.target.value)}
                />
                <select className={styles.entFilter} value={entityType} onChange={e => setEntityType(e.target.value)}>
                  <option value="all">All Types</option>
                  <option value="branch">Branch</option>
                  <option value="firm">CA Firm</option>
                </select>
              </div>
            }
            noPad
          >
            <table className={styles.entTable}>
              <thead>
                <tr>
                  <th>Entity</th>
                  <th>Type</th>
                  <th>Q1 Status</th>
                  <th>tCO₂e</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntities.map(b => (
                  <tr key={b.key} className={styles.entRow}>
                    <td className={styles.entName}>{b.name}</td>
                    <td className={styles.entTd}>{b.type === 'firm' ? 'CA Firm' : 'Branch'}</td>
                    <td className={styles.entTd}>
                      <Badge
                        variant={b.status === 'approved' ? 'green' : b.status === 'pending' ? 'amber' : b.status === 'overdue' ? 'red' : 'navy'}
                        dot={b.status === 'approved' ? 'green' : b.status === 'pending' ? 'amber' : b.status === 'overdue' ? 'red' : undefined}
                      >
                        {b.status === 'in-progress' ? 'In Progress' : b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                      </Badge>
                    </td>
                    <td className={styles.entTd}>{b.tco2e ? `${b.tco2e} t` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>
        </div>
      </div>
    </AppLayout>
  )
}
