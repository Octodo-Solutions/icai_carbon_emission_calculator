import { useState } from 'react'
import {
  MagnifyingGlass, BookOpen, ChartBar, Receipt, ClipboardText,
  Plant, VideoCamera, Buildings, FileText, Clock, LockOpen, ArrowRight,
} from '@phosphor-icons/react'
import PublicLayout from '../../../components/layout/PublicLayout/PublicLayout'
import { useApp } from '../../../context/AppContext'
import styles from './Home.module.css'

const CATEGORIES = [
  'All topics', 'Getting Started', 'GHG Protocol',
  'BRSR & Reporting', 'Reduction Practices', 'Using the Portal',
]

const RESOURCES = [
  {
    category: 'GHG Protocol',
    title: 'How emission factors are applied',
    desc: 'Why a kWh becomes a kgCO₂e, where India-specific factors come from, and how the portal keeps them current.',
    type: 'Article', minutes: 6, Icon: ChartBar, tint: 'tintBlue',
  },
  {
    category: 'Using the Portal',
    title: 'How to read your electricity bill',
    desc: 'Find the exact kWh figure the calculator needs, and what to do when your bill shows estimated units.',
    type: 'Article', minutes: 4, Icon: Receipt, tint: 'tintAmber',
  },
  {
    category: 'BRSR & Reporting',
    title: 'BRSR Principle 6, explained simply',
    desc: 'The environment disclosures, what data feeds them, and how the portal pre-fills them for you.',
    type: 'Article', minutes: 8, Icon: ClipboardText, tint: 'tintGreen',
  },
  {
    category: 'Reduction Practices',
    title: 'Ten low-cost cuts for an office',
    desc: 'Practical, no-capital changes a branch can make this quarter — from AC settings to printing defaults.',
    type: 'Article', minutes: 5, Icon: Plant, tint: 'tintGreen',
  },
  {
    category: 'Getting Started',
    title: 'Your first emission entry, step by step',
    desc: "A short walkthrough of entering your first quarter's data and reading your results dashboard.",
    type: 'Video', minutes: 7, Icon: VideoCamera, tint: 'tintPurple',
  },
  {
    category: 'GHG Protocol',
    title: "What counts as your branch's emissions",
    desc: 'Operational boundaries made simple — what to include, what to leave out, and how to stay consistent.',
    type: 'Article', minutes: 6, Icon: Buildings, tint: 'tintBlue',
  },
]

const BANNER = (
  <>
    <LockOpen size={15} weight="bold" />
    <span><strong>Open to everyone</strong> — no login required. These resources are also available inside your dashboard once you sign in.</span>
  </>
)

export default function Home() {
  const { showToast } = useApp()
  const [activeCat, setActiveCat] = useState('All topics')

  const visible = activeCat === 'All topics'
    ? RESOURCES
    : RESOURCES.filter(r => r.category === activeCat)

  function handleSearch(e) {
    if (e.key === 'Enter') showToast('Search is illustrative in this demo', 'info')
  }

  return (
    <PublicLayout banner={BANNER}>
      <div className={styles.wrap}>
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>Carbon &amp; Sustainability Resource Centre</h1>
          <p className={styles.heroSub}>
            Plain-language guides to help every ICAI branch and CA firm understand emissions,
            report accurately, and act with confidence.
          </p>
          <div className={styles.search}>
            <MagnifyingGlass size={18} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Search guides — e.g. 'Scope 3', 'BRSR', 'how to read an electricity bill'"
              onKeyDown={handleSearch}
            />
          </div>
        </section>

        <div className={styles.cats}>
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`${styles.cat} ${activeCat === c ? styles.catActive : ''}`}
              onClick={() => setActiveCat(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <section className={styles.featured}>
          <div className={styles.featuredBody}>
            <span className={styles.featuredTag}>Start here</span>
            <h2 className={styles.featuredTitle}>Understanding Scope 1, 2 &amp; 3 — a CA's plain guide</h2>
            <p className={styles.featuredDesc}>
              What the three scopes actually mean, which of your activities fall where, and why the
              distinction matters for accurate carbon reporting. Written for accountants, not climate scientists.
            </p>
            <button className={styles.featuredBtn} onClick={() => showToast('Opening guide…', 'info')}>
              Read the guide <ArrowRight size={15} weight="bold" />
            </button>
          </div>
          <div className={styles.featuredVisual}>
            <BookOpen size={88} weight="thin" />
          </div>
        </section>

        <div id="resources" className={styles.gridLabel}>
          {activeCat === 'All topics' ? 'All resources' : activeCat}
        </div>
        <div className={styles.grid}>
          {visible.map(r => {
            const { Icon } = r
            const TypeIcon = r.type === 'Video' ? VideoCamera : FileText
            return (
              <article key={r.title} className={styles.card} onClick={() => showToast(`Opening ${r.type.toLowerCase()}…`, 'info')}>
                <div className={`${styles.cardTop} ${styles[r.tint]}`}>
                  <Icon size={34} weight="regular" />
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardCat}>{r.category}</div>
                  <div className={styles.cardTitle}>{r.title}</div>
                  <div className={styles.cardDesc}>{r.desc}</div>
                  <div className={styles.cardMeta}>
                    <span className={styles.metaItem}><TypeIcon size={14} /> {r.type}</span>
                    <span className={styles.metaItem}><Clock size={14} /> {r.minutes} min {r.type === 'Video' ? 'watch' : 'read'}</span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </PublicLayout>
  )
}
