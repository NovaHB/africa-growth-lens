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

const INTERNET = 'Individuals using the Internet (% of population)'
const MOBILE = 'Mobile cellular subscriptions (per 100 people)'

export default function DigitalAdoptionChart({ data = [] }) {
  const { selectedCountry, yearRange } = useDashboard()

  const rows = useMemo(() => {
    let ranged = data.filter((r) => inYearRange(r, yearRange))
    if (selectedCountry) ranged = ranged.filter((r) => r.country_name === selectedCountry)

    return pivotByYear({
      Internet: averageByYear(ranged.filter((r) => r.indicator_name === INTERNET)),
      Mobile: averageByYear(ranged.filter((r) => r.indicator_name === MOBILE)),
    })
  }, [data, selectedCountry, yearRange])

  return (
    <ChartCard
      title="Digital Adoption"
      subtitle={selectedCountry || 'Average across African countries'}
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={rows} margin={{ top: 8, right: 16, bottom: 4, left: -8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef0f3" />
          <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#6b7280' }} />
          <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
          <Tooltip
            formatter={(value, name) => [formatNumber(value), name]}
            labelStyle={{ fontFamily: 'var(--font-mono)' }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="Internet" stroke={SERIES_COLORS[1]} strokeWidth={2} dot={false} connectNulls />
          <Line type="monotone" dataKey="Mobile" stroke={SERIES_COLORS[0]} strokeWidth={2} dot={false} connectNulls />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
