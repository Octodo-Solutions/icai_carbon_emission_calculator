import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import styles from './MonthlyStackedBar.module.css'

export default function MonthlyStackedBar({ data }) {
  return (
    <div className={styles.wrap}>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barSize={28} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
          <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} unit=" t" />
          <Tooltip
            formatter={(val, name) => [`${val.toFixed(3)} tCO₂e`, name]}
            contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid var(--border)' }}
          />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
          <Bar dataKey="s1" name="Scope 1" stackId="a" fill="var(--s1)" radius={[0,0,0,0]} />
          <Bar dataKey="s2" name="Scope 2" stackId="a" fill="var(--s2)" radius={[0,0,0,0]} />
          <Bar dataKey="s3" name="Scope 3" stackId="a" fill="var(--s3)" radius={[3,3,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
