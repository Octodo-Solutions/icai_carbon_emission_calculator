import { LineChart, Line, XAxis, YAxis, Tooltip, Area, AreaChart, ResponsiveContainer } from 'recharts'

export default function NationalTrendLine({ data, label = 'National Total' }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--navy)" stopOpacity={0.12} />
            <stop offset="95%" stopColor="var(--navy)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="quarter" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} unit=" t" domain={['auto', 'auto']} />
        <Tooltip
          formatter={(val) => [`${val} tCO₂e`, label]}
          contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid var(--border)' }}
        />
        <Area type="monotone" dataKey="value" stroke="var(--navy)" strokeWidth={2.5} fill="url(#trendGrad)" dot={{ r: 4, fill: 'var(--navy)' }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
