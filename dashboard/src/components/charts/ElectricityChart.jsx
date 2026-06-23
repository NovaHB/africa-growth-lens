import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import ChartCard from './ChartCard'
import { useDashboard } from '../../context/DashboardContext'
import { inYearRange, averageByYear } from '../../lib/dataUtils'
import { formatNumber } from '../../utils/formatNumber'

export default function ElectricityChart({ data = [] }) {
  const { selectedCountry, yearRange } = useDashboard()

  const rows = useMemo(() => {
    let ranged = data.filter((r) => inYearRange(r, yearRange))
    if (selectedCountry) ranged = ranged.filter((r) => r.country_name === selectedCountry)
    return averageByYear(ranged, 'electricity_access_pct')
  }, [data, selectedCountry, yearRange])

  return (
    <ChartCard
      title="Access to Electricity (%)"
      subtitle={selectedCountry || 'Average across African countries'}
    >
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={rows} margin={{ top: 8, right: 16, bottom: 4, left: -8 }}>
          <defs>
            <linearGradient id="elecFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef0f3" />
          <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#6b7280' }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#6b7280' }} />
          <Tooltip
            formatter={(value) => [formatNumber(value, 'percent'), 'Electricity access']}
            labelStyle={{ fontFamily: 'var(--font-mono)' }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#f59e0b"
            strokeWidth={2}
            fill="url(#elecFill)"
            connectNulls
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
