import { useMemo, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useDashboardData } from '../App'
import { useDashboard } from '../context/DashboardContext'
import SkeletonChart from '../components/ui/SkeletonChart'
import ChartCard from '../components/charts/ChartCard'
import { SERIES_COLORS, inYearRange, pivotByYear } from '../lib/dataUtils'
import { formatNumber } from '../utils/formatNumber'

/**
 * Indicator explorer: pick an indicator, see its average value per year broken
 * down by income group (from mart_income_group_summary).
 */
export default function Indicators() {
  const { data, loading } = useDashboardData()
  const { yearRange } = useDashboard()
  const summary = data.incomeGroupSummary || []

  const indicators = useMemo(() => {
    const map = new Map()
    for (const r of summary) {
      if (!map.has(r.indicator_code)) map.set(r.indicator_code, r.indicator_name)
    }
    return [...map.entries()].map(([code, name]) => ({ code, name }))
  }, [summary])

  const [active, setActive] = useState(null)
  const activeCode = active || indicators[0]?.code

  const { rows, groups } = useMemo(() => {
    const filtered = summary.filter(
      (r) => r.indicator_code === activeCode && inYearRange(r, yearRange)
    )
    const groupSet = [...new Set(filtered.map((r) => r.income_group))].filter(Boolean)
    const seriesMap = {}
    for (const g of groupSet) {
      seriesMap[g] = filtered
        .filter((r) => r.income_group === g)
        .map((r) => ({ year: r.year, value: r.avg_value }))
    }
    return { rows: pivotByYear(seriesMap), groups: groupSet }
  }, [summary, activeCode, yearRange])

  if (loading) return <SkeletonChart height={420} />

  const activeName = indicators.find((i) => i.code === activeCode)?.name || ''

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {indicators.map((ind) => (
          <button
            key={ind.code}
            className={ind.code === activeCode ? 'filter-pill active' : 'filter-pill'}
            onClick={() => setActive(ind.code)}
            title={ind.name}
          >
            {ind.name.length > 32 ? `${ind.name.slice(0, 30)}…` : ind.name}
          </button>
        ))}
      </div>

      <ChartCard title={activeName} subtitle="Average by income group, per year">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={rows} margin={{ top: 8, right: 16, bottom: 4, left: -8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef0f3" />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip
              labelStyle={{ fontFamily: 'var(--font-mono)' }}
              formatter={(value, name) => [formatNumber(value), name]}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {groups.map((g, i) => (
              <Line
                key={g}
                type="monotone"
                dataKey={g}
                stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
                strokeWidth={2}
                dot={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
