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
import { useDashboard } from '../../context/DashboardContext'
import { SERIES_COLORS, inYearRange, averageByYear, pivotByYear } from '../../lib/dataUtils'
import { formatNumber } from '../../utils/formatNumber'

/**
 * Inflation line chart. Accepts either a dedicated inflation dataset
 * (inflation_rate field) or falls back to gdp_growth shape; valueKey picks the
 * right field automatically.
 */
export default function InflationChart({ data = [] }) {
  const { selectedCountry, yearRange } = useDashboard()

  const valueKey = data.length && 'inflation_rate' in data[0] ? 'inflation_rate' : 'gdp_growth_rate'

  const rows = useMemo(() => {
    let ranged = data.filter((r) => inYearRange(r, yearRange))
    if (selectedCountry) ranged = ranged.filter((r) => r.country_name === selectedCountry)
    const label = selectedCountry || 'Average'
    return pivotByYear({ [label]: averageByYear(ranged, valueKey) })
  }, [data, selectedCountry, yearRange, valueKey])

  const seriesKey = selectedCountry || 'Average'

  return (
    <ChartCard
      title="Inflation Rate (%)"
      subtitle={selectedCountry || 'Average across African countries'}
    >
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
          <Line type="monotone" dataKey={seriesKey} stroke={SERIES_COLORS[4]} strokeWidth={2} dot={false} connectNulls />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
