import { useState } from 'react'
import AppLayout from '../../../components/layout/AppLayout/AppLayout'
import SectionCard from '../../../components/common/SectionCard/SectionCard'
import Button from '../../../components/common/Button/Button'
import Badge from '../../../components/common/Badge/Badge'
import Modal from '../../../components/common/Modal/Modal'
import RegionalBar from '../../../components/charts/RegionalBar/RegionalBar'
import NationalTrendLine from '../../../components/charts/NationalTrendLine/NationalTrendLine'
import { useApp } from '../../../context/AppContext'
import { DEFAULT_EMISSION_FACTORS } from '../../../data/emissionFactors'
import { NATIONAL_REGIONS, NATIONAL_TREND } from '../../../data/mockBranches'
import styles from './HOAnalytics.module.css'

/* ─── Tab 1: National Dashboard ─── */
function NationalTab({ showToast }) {
  return (
    <div className={styles.tabContent}>
      <div className={styles.kpiRow}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiVal}>1,847</div>
          <div className={styles.kpiLbl}>tCO₂e National Total</div>
          <div className={styles.kpiSub}>Q1 FY 2026-27 (submitted)</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiVal}>94 / 183</div>
          <div className={styles.kpiLbl}>Branches Submitted</div>
          <div className={styles.kpiSub}>51% completion rate</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiVal}>312 / 1,247</div>
          <div className={styles.kpiLbl}>CA Firms Reporting</div>
          <div className={styles.kpiSub}>Q1 submissions</div>
        </div>
        <div className={styles.kpiCard} style={{ borderLeftColor: 'var(--red)' }}>
          <div className={styles.kpiVal}>18</div>
          <div className={styles.kpiLbl}>Overdue Branches</div>
          <div className={styles.kpiSub}>Reminder sent</div>
        </div>
      </div>

      <div className={styles.chartGrid}>
        <SectionCard title="Regional Breakdown" subtitle="Q1 FY 2026-27 — Scope 1/2/3 stacked">
          <RegionalBar data={NATIONAL_REGIONS.filter(r => r.tco2e)} />
        </SectionCard>
        <SectionCard title="National Emissions Trend" subtitle="5-quarter rolling view">
          <NationalTrendLine data={NATIONAL_TREND} />
        </SectionCard>
      </div>

      <SectionCard
        title="Regional Status"
        action={<Button size="sm" onClick={() => showToast('National report downloading…')}>⬇ Export National Report</Button>}
        noPad
      >
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Region</th>
              <th>Branches</th>
              <th>Submitted</th>
              <th>Rate</th>
              <th>tCO₂e</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {NATIONAL_REGIONS.map(r => (
              <tr key={r.name} className={styles.trow}>
                <td className={styles.tdBold}>{r.name} Region</td>
                <td className={styles.td}>{r.branches}</td>
                <td className={styles.td}>{r.submitted}</td>
                <td className={styles.td}>
                  <div className={styles.rateWrap}>
                    <div className={styles.rateBar}>
                      <div className={styles.rateFill} style={{ width: `${r.rate}%`, background: r.status === 'behind' ? 'var(--red)' : 'var(--navy)' }} />
                    </div>
                    <span>{r.rate}%</span>
                  </div>
                </td>
                <td className={styles.td}>{r.tco2e ? `${r.tco2e} t` : '—'}</td>
                <td className={styles.td}>
                  <Badge variant={r.status === 'behind' ? 'red' : r.status === 'not-open' ? 'gray' : 'amber'}>
                    {r.status === 'in-progress' ? 'In Progress' : r.status === 'behind' ? 'Behind' : 'Not Open'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  )
}

/* ─── Tab 2: Emission Factors ─── */
function EmissionFactorsTab({ emissionFactors, updateEmissionFactor, showToast }) {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState({})
  const [editModal, setEditModal] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [addModal, setAddModal] = useState(false)

  const allFactors = Object.values(emissionFactors)
  const filtered = allFactors.filter(ef =>
    ef.activity.toLowerCase().includes(search.toLowerCase()) ||
    ef.source.toLowerCase().includes(search.toLowerCase())
  )

  function openEdit(ef) {
    setEditModal(ef)
    setEditForm({ value: ef.displayValue, unit: ef.unit, source: ef.source, effectiveFrom: ef.effectiveFrom, reason: '' })
  }

  function handleSave() {
    if (!editForm.reason) { showToast('Please enter a reason for the change', 'error'); return }
    const newVersion = {
      value: `${editForm.value} ${editForm.unit}`,
      date: '24 Jun 2026',
      by: 'HO Admin',
      current: true,
      reason: editForm.reason,
    }
    updateEmissionFactor(editModal.key, {
      displayValue: editForm.value,
      unit: editForm.unit,
      source: editForm.source,
      effectiveFrom: editForm.effectiveFrom,
      versions: [newVersion, ...editModal.versions.map(v => ({ ...v, current: false }))],
    })
    setEditModal(null)
    showToast(`Emission factor updated — new version saved`)
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.efBanner}>
        <span>🔒</span>
        <div>
          <strong>Factors drive all CO₂e calculations across 183 branches and 1,247 CA firms.</strong>
          <br />No factor can be deleted — only superseded. Every historical submission is tied to the factor version active at time of entry.
        </div>
      </div>

      <SectionCard
        title="Emission Factor Governance"
        subtitle="Versioned, immutable emission factors — GHG Protocol aligned"
        action={
          <div className={styles.efToolbar}>
            <input className={styles.efSearch} placeholder="Search factors…" value={search} onChange={e => setSearch(e.target.value)} />
            <Button size="sm" onClick={() => setAddModal(true)}>+ Add New Factor</Button>
          </div>
        }
        noPad
      >
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: 28 }} />
              <th>Activity</th>
              <th>Factor</th>
              <th>Unit</th>
              <th>Source</th>
              <th>Effective</th>
              <th>Version</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(ef => (
              <>
                <tr key={ef.id} className={styles.trow}>
                  <td className={styles.td}>
                    <button className={styles.expandBtn} onClick={() => setExpanded(p => ({ ...p, [ef.key]: !p[ef.key] }))}>
                      {expanded[ef.key] ? '▼' : '▶'}
                    </button>
                  </td>
                  <td className={styles.tdBold}>{ef.activity}</td>
                  <td className={styles.td}>{ef.displayValue}</td>
                  <td className={styles.td}>{ef.unit}</td>
                  <td className={styles.td}>
                    <Badge variant="navy" size="sm">{ef.source}</Badge>
                  </td>
                  <td className={styles.td}>{ef.effectiveFrom}</td>
                  <td className={styles.td}>
                    <Badge variant="green" size="sm">v{ef.versions.length} Current</Badge>
                  </td>
                  <td className={styles.td}>
                    <Button size="sm" variant="outline" onClick={() => openEdit(ef)}>Edit</Button>
                  </td>
                </tr>
                {expanded[ef.key] && ef.versions.map((v, i) => (
                  <tr key={`${ef.key}-v${i}`} className={styles.vRow}>
                    <td />
                    <td colSpan={5} className={styles.vCell}>
                      <span className={styles.vVal}>{v.value}</span>
                      <span>From: {v.date}</span>
                      <span>By: {v.by}</span>
                      {v.reason && <span className={styles.vReason}>Reason: {v.reason}</span>}
                    </td>
                    <td colSpan={2} className={styles.td}>
                      <Badge variant={v.current ? 'green' : 'gray'} size="sm">{v.current ? 'Current' : 'Archived'}</Badge>
                    </td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </SectionCard>

      {/* Edit modal */}
      <Modal open={!!editModal} onClose={() => setEditModal(null)} title={`Edit — ${editModal?.activity}`} width={480}>
        {editModal && (
          <div className={styles.editBody}>
            <div className={styles.editWarning}>
              🔒 Editing this factor creates a new version. All active submissions use the version current at time of data entry.
            </div>
            <div className={styles.editGrid}>
              <div className={styles.editField}>
                <label>New Factor Value</label>
                <input className={styles.editInput} type="number" step="0.001" value={editForm.value} onChange={e => setEditForm(p => ({ ...p, value: e.target.value }))} />
              </div>
              <div className={styles.editField}>
                <label>Unit</label>
                <input className={styles.editInput} type="text" value={editForm.unit} onChange={e => setEditForm(p => ({ ...p, unit: e.target.value }))} />
              </div>
              <div className={styles.editField}>
                <label>Source / Reference</label>
                <input className={styles.editInput} type="text" value={editForm.source} onChange={e => setEditForm(p => ({ ...p, source: e.target.value }))} />
              </div>
              <div className={styles.editField}>
                <label>Effective From</label>
                <input className={styles.editInput} type="text" value={editForm.effectiveFrom} onChange={e => setEditForm(p => ({ ...p, effectiveFrom: e.target.value }))} />
              </div>
            </div>
            <div className={styles.editField}>
              <label>Change Reason (required for audit trail)</label>
              <textarea className={styles.editTextarea} rows={3} value={editForm.reason} onChange={e => setEditForm(p => ({ ...p, reason: e.target.value }))} placeholder="e.g. CEA Annual Update 2026" />
            </div>
            <div className={styles.editActions}>
              <Button variant="ghost" onClick={() => setEditModal(null)}>Cancel</Button>
              <Button variant="primary" onClick={handleSave}>Save as New Version</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add New Emission Factor" width={480}>
        <div className={styles.editBody}>
          <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 12 }}>New factors will be available in calculations from the effective date onwards.</p>
          <div className={styles.editGrid}>
            <div className={styles.editField}><label>Activity Name</label><input className={styles.editInput} type="text" placeholder="e.g. Refrigerants — R22" /></div>
            <div className={styles.editField}><label>Factor Value</label><input className={styles.editInput} type="number" step="0.001" placeholder="0.000" /></div>
            <div className={styles.editField}><label>Unit</label><input className={styles.editInput} type="text" placeholder="kgCO₂e/unit" /></div>
            <div className={styles.editField}><label>Source</label><input className={styles.editInput} type="text" placeholder="IPCC / DEFRA / CEA" /></div>
          </div>
          <div className={styles.editActions}>
            <Button variant="ghost" onClick={() => setAddModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => { setAddModal(false); showToast('New emission factor added') }}>Add Factor</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

/* ─── Tab 3: BRSR Alignment ─── */
function BrsrTab({ showToast }) {
  const BRSR_CARDS = [
    {
      title: 'P6 — Energy Consumption',
      fields: [
        { label: 'Total electricity consumed (GJ)', value: '21,903', auto: true },
        { label: 'Energy intensity per employee', value: '4.2 GJ', auto: true },
        { label: '% energy from renewables', value: null, auto: false },
        { label: 'Energy reduction initiatives', value: null, auto: false },
      ]
    },
    {
      title: 'P6 — GHG Emissions',
      fields: [
        { label: 'Scope 1 total (tCO₂e)', value: '312.4', auto: true },
        { label: 'Scope 2 total (tCO₂e)', value: '891.2', auto: true },
        { label: 'Scope 3 total (tCO₂e)', value: '643.4', auto: true },
        { label: 'GHG intensity (tCO₂e/Cr revenue)', value: null, auto: false },
      ]
    },
    {
      title: 'P6 — Water & Waste',
      fields: [
        { label: 'Total water consumption (kL)', value: null, auto: false },
        { label: 'Solid waste generated (MT)', value: '28.4', auto: true },
        { label: 'Waste to landfill (MT)', value: '6.1', auto: true },
        { label: 'Waste recycled / diverted (%)', value: null, auto: false },
      ]
    },
    {
      title: 'Other Principles',
      fields: [
        { label: 'P1 — Ethics & Transparency', value: '—', auto: false, note: 'Not in scope' },
        { label: 'P2 — Sustainable Products', value: '—', auto: false, note: 'Not in scope' },
        { label: 'P3 — Employee Wellbeing', value: '—', auto: false, note: 'Not in scope' },
        { label: 'P8 — Inclusive Growth', value: '—', auto: false, note: 'Future module' },
      ]
    },
  ]

  const autoFilled = BRSR_CARDS.flatMap(c => c.fields).filter(f => f.auto).length
  const total = BRSR_CARDS.flatMap(c => c.fields).length

  return (
    <div className={styles.tabContent}>
      <div className={styles.brsrHero}>
        <div className={styles.brsrHeroLeft}>
          <div className={styles.brsrHeroIcon}>📊</div>
          <div>
            <h3 className={styles.brsrHeroTitle}>BRSR Principle 6 — Environment</h3>
            <p className={styles.brsrHeroDesc}>Auto-populated from your carbon emission data — no re-entry required. Download SEBI-ready disclosure templates.</p>
          </div>
        </div>
        <div className={styles.brsrProgress}>
          <div className={styles.brsrProgressLabel}>{Math.round((autoFilled / total) * 100)}% auto-populated</div>
          <div className={styles.brsrProgressBar}>
            <div className={styles.brsrProgressFill} style={{ width: `${(autoFilled / total) * 100}%` }} />
          </div>
          <div className={styles.brsrProgressSub}>{autoFilled} of {total} fields auto-filled from carbon data</div>
        </div>
      </div>

      <div className={styles.brsrGrid}>
        {BRSR_CARDS.map(card => (
          <SectionCard key={card.title} title={card.title}>
            <div className={styles.brsrFields}>
              {card.fields.map((f, i) => (
                <div key={i} className={`${styles.brsrField} ${f.auto ? styles.brsrAuto : ''}`}>
                  <span className={styles.brsrFieldLabel}>{f.label}</span>
                  <div className={styles.brsrFieldRight}>
                    <span className={styles.brsrFieldVal}>{f.value || '—'}</span>
                    {f.auto
                      ? <Badge variant="green" size="sm">Auto-filled</Badge>
                      : f.note
                        ? <Badge variant="gray" size="sm">{f.note}</Badge>
                        : <Badge variant="amber" size="sm">Manual entry</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        ))}
      </div>

      <div className={styles.brsrExport}>
        <h4 className={styles.brsrExportTitle}>Export BRSR-ready data</h4>
        <p className={styles.brsrExportDesc}>Download auto-populated fields in SEBI BRSR template format for direct use in your Business Responsibility Report.</p>
        <div className={styles.brsrExportBtns}>
          <Button onClick={() => showToast('BRSR Excel template downloading…')}>⬇ BRSR Excel Template</Button>
          <Button variant="outline" onClick={() => showToast('BRSR Disclosure Report downloading…')}>⬇ BRSR Disclosure Report</Button>
        </div>
      </div>
    </div>
  )
}

/* ─── Main HOAnalytics page ─── */
export default function HOAnalytics() {
  const [activeTab, setActiveTab] = useState('national')
  const { emissionFactors, updateEmissionFactor, showToast } = useApp()

  const TABS = [
    { key: 'national', label: 'National Dashboard' },
    { key: 'factors', label: 'Emission Factor Governance' },
    { key: 'brsr', label: 'BRSR Alignment' },
  ]

  return (
    <AppLayout>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>HO Analytics &amp; Governance</h1>
          <p className={styles.pageSub}>National view · Q1 FY 2026-27 · 183 Branch Offices · 1,247 CA Firms</p>
        </div>

        <div className={styles.tabBar}>
          {TABS.map(t => (
            <button
              key={t.key}
              className={`${styles.tabBtn} ${activeTab === t.key ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'national' && <NationalTab showToast={showToast} />}
        {activeTab === 'factors' && <EmissionFactorsTab emissionFactors={emissionFactors} updateEmissionFactor={updateEmissionFactor} showToast={showToast} />}
        {activeTab === 'brsr' && <BrsrTab showToast={showToast} />}
      </div>
    </AppLayout>
  )
}
