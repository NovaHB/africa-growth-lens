import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import ChartCard from './ChartCard'
import EmptyState from '../ui/EmptyState'
import { useDashboard } from '../../context/DashboardContext'
import { inYearRange, averageByYear, INDICATOR_NAMES } from '../../lib/dataUtils'
import { formatNumber } from '../../utils/formatNumber'

const DEFAULT_INDICATOR = 'NY.GDP.MKTP.KD.ZG'

export default function YoYChart({ data = [] }) {
  const { selectedCountry, activeIndicator, yearRange } = useDashboard()
  const indicator = activeIndicator || DEFAULT_INDICATOR

  const rows = useMemo(() => {
    let ranged = data.filter(
      (r) => r.indicator_code === indicator && inYearRange(r, yearRange)
    )
    if (selectedCountry) ranged = ranged.filter((r) => r.country_name === selectedCountry)
    return averageByYear(ranged, 'yoy_change')
  }, [data, indicator, selectedCountry, yearRange])

  return (
    <ChartCard
      title="Year-over-Year Change"
      subtitle={`${INDICATOR_NAMES[indicator] || indicator}${selectedCountry ? ` · ${selectedCountry}` : ' · average'}`}
    >
      {rows.length === 0 ? (
        <EmptyState
          title="No year-over-year data"
          message="Try another indicator, country, or year range."
        />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={rows} margin={{ top: 8, right: 16, bottom: 4, left: -8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef0f3" />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip
              formatter={(value) => [formatNumber(value), 'YoY change']}
              labelStyle={{ fontFamily: 'var(--font-mono)' }}
            />
            <Bar dataKey="value" radius={[3, 3, 0, 0]}>
              {rows.map((r) => (
                <Cell key={r.year} fill={r.value >= 0 ? 'var(--positive)' : 'var(--negative)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  )
}
