import { useMemo } from 'react'
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
import ChartCard from './ChartCard'
import EmptyState from '../ui/EmptyState'
import { useDashboard } from '../../context/DashboardContext'
import {
  SERIES_COLORS,
  inYearRange,
  averageByYear,
  pivotByYear,
} from '../../lib/dataUtils'
import { formatNumber } from '../../utils/formatNumber'

/**
 * GDP growth line chart.
 * - Country selected: single amber line for that country.
 * - Otherwise: top N countries by average growth, or regional averages.
 */
export default function GDPChart({ data = [], topN = 5 }) {
  const { selectedCountry, yearRange } = useDashboard()

  const { rows, seriesKeys } = useMemo(() => {
    const ranged = data.filter((r) => inYearRange(r, yearRange))

    if (selectedCountry) {
      const points = averageByYear(
        ranged.filter((r) => r.country_name === selectedCountry),
        'gdp_growth_rate'
      )
      return {
        rows: pivotByYear({ [selectedCountry]: points }),
        seriesKeys: [selectedCountry],
      }
    }

    // Rank countries by mean growth, take topN.
    const byCountry = new Map()
    for (const r of ranged) {
      if (r.gdp_growth_rate == null) continue
      if (!byCountry.has(r.country_name)) byCountry.set(r.country_name, [])
      byCountry.get(r.country_name).push(r)
    }
    const ranked = [...byCountry.entries()]
      .map(([name, rs]) => ({
        name,
        mean: rs.reduce((s, r) => s + r.gdp_growth_rate, 0) / rs.length,
        rows: rs,
      }))
      .sort((a, b) => b.mean - a.mean)
      .slice(0, topN)

    const seriesMap = {}
    for (const c of ranked) {
      seriesMap[c.name] = averageByYear(c.rows, 'gdp_growth_rate')
    }
    return { rows: pivotByYear(seriesMap), seriesKeys: ranked.map((c) => c.name) }
  }, [data, selectedCountry, yearRange, topN])

  return (
    <ChartCard
      title="GDP Growth Rate (%)"
      subtitle={selectedCountry || `Top ${topN} countries by average growth`}
    >
      {rows.length === 0 ? (
        <EmptyState title="No data in range" message="Adjust the year range to see GDP growth." />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={rows} margin={{ top: 8, right: 16, bottom: 4, left: -8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef0f3" />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip
              formatter={(value, name) => [formatNumber(value, 'percent'), name]}
              labelStyle={{ fontFamily: 'var(--font-mono)' }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {seriesKeys.map((key, i) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
                strokeWidth={2}
                dot={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  )
}
