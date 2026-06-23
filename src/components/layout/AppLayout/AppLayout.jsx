import TopNav from '../TopNav/TopNav'
import Sidebar from '../Sidebar/Sidebar'
import styles from './AppLayout.module.css'

export default function AppLayout({ children }) {
  return (
    <div className={styles.shell}>
      <TopNav />
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  )
}
