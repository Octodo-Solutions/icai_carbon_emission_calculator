import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function RegionalBar({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barSize={32} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
        <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} unit=" t" />
        <Tooltip
          formatter={(val, name) => [`${val} tCO₂e`, name]}
          contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid var(--border)' }}
        />
        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
        <Bar dataKey="s1" name="Scope 1" stackId="a" fill="var(--s1)" />
        <Bar dataKey="s2" name="Scope 2" stackId="a" fill="var(--s2)" />
        <Bar dataKey="s3" name="Scope 3" stackId="a" fill="var(--s3)" radius={[3,3,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
