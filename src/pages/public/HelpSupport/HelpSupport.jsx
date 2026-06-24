import { useState } from 'react'
import { PaperPlaneTilt, Archive, CheckCircle, Star, CaretDown, Lifebuoy } from '@phosphor-icons/react'
import PublicLayout from '../../../components/layout/PublicLayout/PublicLayout'
import SectionCard from '../../../components/common/SectionCard/SectionCard'
import Button from '../../../components/common/Button/Button'
import { useAuth } from '../../../context/AuthContext'
import { useApp } from '../../../context/AppContext'
import styles from './HelpSupport.module.css'

const CATEGORIES = [
  'Data entry help',
  'Emission factor question',
  'Report / export issue',
  'Login or access problem',
  'BRSR / compliance query',
  'Other',
]

const FAQS = [
  {
    q: 'How often do I report emissions?',
    a: 'Reporting frequency is set by your Head Office — most branches report quarterly. Your dashboard shows your current reporting period and deadline.',
  },
  {
    q: 'Where do the emission factors come from?',
    a: 'Factors are India-specific, drawn from CEA, IPCC and the GHG Protocol, and maintained by ICAI administrators. Every calculation records the factor version used.',
  },
  {
    q: 'Can I edit data after submitting?',
    a: "Before approval, yes. Once your regional admin approves a submission it's locked for audit integrity — raise a query if a correction is needed.",
  },
  {
    q: 'Is my branch data visible to others?',
    a: 'Only your regional admin and Head Office see your branch data, under role-based access. Other branches cannot see your figures.',
  },
]

const BANNER = (
  <>
    <Lifebuoy size={15} weight="bold" />
    <span><strong>Available before and after login</strong> — raise a query even if you can't sign in. Logged-in queries are linked to your entity automatically.</span>
  </>
)

export default function HelpSupport() {
  const { user } = useAuth()
  const { showToast } = useApp()

  const [form, setForm] = useState({
    name: user?.personName || '',
    entity: user?.name || '',
    email: user?.email || '',
    membership: user?.membershipNo || '',
    category: CATEGORIES[0],
    query: '',
  })
  const [ack, setAck] = useState(null)

  const [rating, setRating] = useState(0)
  const [openFaq, setOpenFaq] = useState(0)

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function submitQuery(e) {
    e.preventDefault()
    const ticket = '#ICAI-Q-' + Math.floor(50000 + Math.random() * 9999)
    setAck({
      ticket,
      name: form.name || 'applicant',
      email: form.email || 'you@example.com',
    })
    showToast('Query submitted — acknowledgement email sent')
  }

  return (
    <PublicLayout banner={BANNER}>
      <div className={styles.wrap}>
        <header className={styles.hero}>
          <h1 className={styles.heroTitle}>Help &amp; Support</h1>
          <p className={styles.heroSub}>
            Raise a query with the ICAI Directorate, share feedback, or browse common questions.
            We aim to acknowledge every query immediately and respond within two working days.
          </p>
        </header>

        <div className={styles.grid}>
          {/* LEFT — query form */}
          <SectionCard title="Raise a query" subtitle="Your question goes directly to the ICAI Directorate's experts">
            <form onSubmit={submitQuery} className={styles.form}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Your name</label>
                  <input className={styles.input} value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Priya Sharma" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Entity / Branch</label>
                  <input className={styles.input} value={form.entity} onChange={e => update('entity', e.target.value)} placeholder="e.g. ICAI Pune Branch" />
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Email address</label>
                  <input className={styles.input} type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Membership / Firm reg. no. <span className={styles.optional}>(optional)</span></label>
                  <input className={styles.input} value={form.membership} onChange={e => update('membership', e.target.value)} placeholder="e.g. 123456" />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Category</label>
                <select className={styles.input} value={form.category} onChange={e => update('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Your query</label>
                <textarea className={styles.textarea} rows={4} value={form.query} onChange={e => update('query', e.target.value)} placeholder="Describe your question or issue..." />
              </div>
              <Button type="submit" variant="primary" className={styles.fullBtn}>
                <PaperPlaneTilt size={16} /> Submit query
              </Button>

              <div className={styles.storageNote}>
                <Archive size={16} weight="fill" />
                <span>Every query is logged with a ticket reference and stored to the Directorate's query register, exportable to Excel / CSV on request.</span>
              </div>

              {ack && (
                <div className={styles.ack}>
                  <div className={styles.ackHead}>
                    <span className={styles.ackHeadIcon}><CheckCircle size={15} weight="fill" /></span>
                    <span className={styles.ackHeadText}>Automated acknowledgement sent to your email</span>
                  </div>
                  <div className={styles.ackBody}>
                    <div className={styles.ackMeta}>
                      <div><span className={styles.ackLbl}>From:</span> no-reply@icai-carbon.in</div>
                      <div><span className={styles.ackLbl}>To:</span> {ack.email}</div>
                      <div><span className={styles.ackLbl}>Subject:</span> We've received your query — {ack.ticket}</div>
                    </div>
                    <div className={styles.ackText}>
                      Dear {ack.name},<br /><br />
                      Thank you for reaching out to the ICAI Carbon Calculator support desk. Your query has
                      been logged as <span className={styles.ackTicket}>{ack.ticket}</span> and routed to the
                      relevant expert at the Directorate.<br /><br />
                      We aim to respond within two working days. You'll receive our reply at this email address.<br /><br />
                      — ICAI Sustainability Reporting Standards Board
                    </div>
                  </div>
                </div>
              )}
            </form>
          </SectionCard>

          {/* RIGHT — feedback + FAQ */}
          <div className={styles.rightCol}>
            <SectionCard title="Share feedback" subtitle="Help us improve the portal">
              <div className={styles.field}>
                <label className={styles.label}>How would you rate your experience?</label>
                <div className={styles.stars}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      type="button"
                      className={`${styles.star} ${n <= rating ? styles.starOn : ''}`}
                      onClick={() => setRating(n)}
                      aria-label={`${n} star${n > 1 ? 's' : ''}`}
                    >
                      <Star size={26} weight={n <= rating ? 'fill' : 'regular'} />
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Your comments</label>
                <textarea className={styles.textarea} rows={3} placeholder="What's working well? What could be better?" />
              </div>
              <Button
                variant="primary"
                className={styles.fullBtn}
                onClick={() => showToast('Thank you — your feedback has been recorded')}
              >
                Send feedback
              </Button>
            </SectionCard>

            <SectionCard title="Common questions" noPad>
              <div className={styles.faqList}>
                {FAQS.map((f, i) => (
                  <div key={f.q} className={styles.faqItem}>
                    <button
                      className={styles.faqQ}
                      onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                    >
                      {f.q}
                      <CaretDown size={15} className={`${styles.faqChev} ${openFaq === i ? styles.faqChevOpen : ''}`} />
                    </button>
                    {openFaq === i && <div className={styles.faqA}>{f.a}</div>}
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
