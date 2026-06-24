import { useState, useMemo } from 'react'
import {
  Lightning, Drop, Airplane, FileText, Lightbulb,
  CheckCircle, Clock, ArrowCounterClockwise, Gear, Sparkle, Diamond,
} from '@phosphor-icons/react'
import AppLayout from '../../../components/layout/AppLayout/AppLayout'
import SectionCard from '../../../components/common/SectionCard/SectionCard'
import Button from '../../../components/common/Button/Button'
import Badge from '../../../components/common/Badge/Badge'
import { useApp } from '../../../context/AppContext'
import { MOCK_BRANCHES } from '../../../data/mockBranches'
import { BRANCH_RECOMMENDATIONS, GENERAL_TIPS, PROFILE_META } from '../../../data/recommendations'
import styles from './Recommendations.module.css'

const ICONS = { electricity: Lightning, dg: Drop, travel: Airplane, paper: FileText, efficiency: Lightbulb }

const fmt = n => n.toFixed(2)

export default function Recommendations() {
  const { showToast } = useApp()
  const branch = MOCK_BRANCHES.find(b => b.key === 'pune')
  const today = branch.tco2e
  const breakdown = branch.breakdown

  // id -> 'adopted' | 'planned' | 'dismissed'  (absent = open)
  const [status, setStatus] = useState({})

  const totalSaving = useMemo(
    () => BRANCH_RECOMMENDATIONS.reduce((sum, r) => sum + r.saving, 0),
    [],
  )
  const potential = today - totalSaving
  const pct = Math.round((totalSaving / today) * 100)

  // Live tally — grows as the user adopts actions.
  const committed = useMemo(
    () => BRANCH_RECOMMENDATIONS.reduce((sum, r) => sum + (status[r.id] === 'adopted' ? r.saving : 0), 0),
    [status],
  )

  const profile = useMemo(() => {
    const sum = Object.values(breakdown).reduce((a, b) => a + b, 0)
    return Object.entries(breakdown)
      .map(([key, value]) => ({ key, value, pct: Math.round((value / sum) * 100), ...PROFILE_META[key] }))
      .sort((a, b) => b.value - a.value)
  }, [breakdown])

  function setRec(rec, next, msg, type) {
    setStatus(prev => {
      const updated = { ...prev }
      if (next) updated[rec.id] = next
      else delete updated[rec.id]
      return updated
    })
    if (msg) showToast(msg, type)
  }

  return (
    <AppLayout>
      <div className={styles.page}>
        <div className={styles.pageHead}>
          <h1 className={styles.pageTitle}>Recommendations</h1>
          <p className={styles.pageSub}>
            Tailored actions to cut your branch's emissions — matched to your reported activity for Q1 FY 2026-27
          </p>
        </div>

        {/* Savings hero */}
        <div className={styles.hero}>
          <div className={styles.heroLeft}>
            <div className={styles.heroEyebrow}>Your reduction potential</div>
            <div className={styles.heroHeadline}>
              If you act on all matched recommendations, your branch could cut{' '}
              <span className={styles.hl}>up to {fmt(totalSaving)} tCO₂e per year</span> — around {pct}% of your current footprint.
            </div>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <div className={styles.heroStatVal}>{fmt(today)}</div>
              <div className={styles.heroStatLbl}>tCO₂e today</div>
            </div>
            <div className={styles.heroStat}>
              <div className={`${styles.heroStatVal} ${styles.heroGreen}`}>{fmt(potential)}</div>
              <div className={styles.heroStatLbl}>tCO₂e potential</div>
            </div>
            <div className={styles.heroStat}>
              <div className={`${styles.heroStatVal} ${styles.heroGold}`}>{fmt(committed)}</div>
              <div className={styles.heroStatLbl}>committed so far</div>
            </div>
          </div>
        </div>

        <div className={styles.layout}>
          {/* LEFT: recommendation cards */}
          <div>
            <div className={styles.sectionLabel}>
              Matched to your profile
              <span className={styles.aiPill}><Sparkle size={11} weight="fill" /> AI MATCHED</span>
            </div>

            {BRANCH_RECOMMENDATIONS.map(rec => {
              const Icon = ICONS[rec.iconKey] || Lightbulb
              const st = status[rec.id]
              return (
                <div
                  key={rec.id}
                  className={`${styles.recCard} ${st === 'adopted' ? styles.adopted : ''} ${st === 'dismissed' ? styles.dismissed : ''}`}
                >
                  <div className={styles.recTop}>
                    <div className={`${styles.recIcon} ${styles['tint-' + rec.scopeKey]}`}><Icon size={20} /></div>
                    <div className={styles.recHeadline}>
                      <div className={styles.recCatTag}>{rec.category} · Scope {rec.scopeKey.slice(1)}</div>
                      <div className={styles.recTitle}>{rec.title}</div>
                    </div>
                    <Badge variant={rec.scopeKey} size="sm">
                      <Diamond size={9} weight="fill" /> {rec.match}% match
                    </Badge>
                  </div>

                  <div className={styles.recDesc}>{rec.description}</div>

                  <div className={styles.recMetrics}>
                    <div className={styles.metric}>
                      <div className={styles.metricLabel}>Est. annual saving</div>
                      <div className={`${styles.metricVal} ${styles.save}`}>−{fmt(rec.saving)} <span className={styles.unit}>tCO₂e/yr</span></div>
                    </div>
                    <div className={styles.metric}>
                      <div className={styles.metricLabel}>Implementation effort</div>
                      <div className={styles.metricVal}>
                        <span className={styles.dots}>
                          {[1, 2, 3, 4, 5].map(i => (
                            <span key={i} className={`${styles.dot} ${i <= rec.effort ? styles.dotOn : ''}`} />
                          ))}
                        </span>
                      </div>
                    </div>
                    <div className={styles.metric}>
                      <div className={styles.metricLabel}>Payback</div>
                      <div className={styles.metricVal}>{rec.payback}</div>
                    </div>
                  </div>

                  <div className={styles.recActions}>
                    {!st && (
                      <>
                        <Button variant="green" size="sm" onClick={() => setRec(rec, 'adopted', 'Added to your branch action plan')}>
                          <CheckCircle size={15} weight="bold" /> Mark as adopted
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setRec(rec, 'planned', 'Saved to planned actions', 'info')}>
                          <Clock size={15} /> Plan for later
                        </Button>
                        <button className={styles.dismissBtn} onClick={() => setRec(rec, 'dismissed', 'Recommendation dismissed', 'info')}>
                          Dismiss
                        </button>
                      </>
                    )}
                    {st === 'adopted' && (
                      <>
                        <span className={`${styles.statusBadge} ${styles.statusAdopted}`}>
                          <CheckCircle size={14} weight="fill" /> Adopted — added to your action plan
                        </span>
                        <button className={styles.undoBtn} onClick={() => setRec(rec, null)}><ArrowCounterClockwise size={13} /> Undo</button>
                      </>
                    )}
                    {st === 'planned' && (
                      <>
                        <span className={`${styles.statusBadge} ${styles.statusPlanned}`}><Clock size={14} /> Planned for later</span>
                        <button className={styles.undoBtn} onClick={() => setRec(rec, null)}><ArrowCounterClockwise size={13} /> Undo</button>
                      </>
                    )}
                    {st === 'dismissed' && (
                      <>
                        <span className={styles.dismissedText}>Dismissed</span>
                        <button className={styles.undoBtn} onClick={() => setRec(rec, null)}><ArrowCounterClockwise size={13} /> Undo</button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* RIGHT: profile + tips + admin note */}
          <div className={styles.side}>
            <SectionCard title="Your emission profile" subtitle="What these recommendations are matched against" noPad>
              <div className={styles.profile}>
                {profile.map(p => (
                  <div key={p.key} className={styles.profileRow}>
                    <span className={styles.profileLabel}>
                      <span className={styles.profileDot} style={{ background: `var(--${p.scopeKey})` }} />
                      {p.label}
                    </span>
                    <span className={styles.profileVal}>{p.value.toFixed(2)} t · {p.pct}%</span>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="General reduction tips" subtitle="Always-on guidance for every branch" noPad>
              <div className={styles.tips}>
                {GENERAL_TIPS.map((t, i) => (
                  <div key={i} className={styles.tip}>
                    <CheckCircle size={15} weight="fill" className={styles.tipIcon} />
                    <span className={styles.tipText}>{t}</span>
                  </div>
                ))}
              </div>
            </SectionCard>

            <div className={styles.adminNote}>
              <Gear size={16} weight="fill" />
              <span>The recommendation library and CO₂e savings values are maintained by ICAI administrators, and refreshed as factors and guidance evolve.</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
