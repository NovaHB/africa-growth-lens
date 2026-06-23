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
import { Cancel01Icon } from 'hugeicons-react'
import { useDashboardData } from '../App'
import { useDashboard } from '../context/DashboardContext'
import CountrySearch from '../components/ui/CountrySearch'
import YearRangeSlider from '../components/ui/YearRangeSlider'
import EmptyState from '../components/ui/EmptyState'
import ChartCard from '../components/charts/ChartCard'
import { SERIES_COLORS, inYearRange, averageByYear, pivotByYear } from '../lib/dataUtils'
import { formatNumber } from '../utils/formatNumber'

// Single-value marts that map cleanly to one line per country.
const METRICS = [
  { id: 'gdpGrowth', label: 'GDP Growth (%)', valueKey: 'gdp_growth_rate', type: 'percent' },
  { id: 'gdpPerCapita', label: 'GDP per Capita (US$)', valueKey: 'gdp_per_capita', type: 'currency' },
  { id: 'inflation', label: 'Inflation (%)', valueKey: 'inflation_rate', type: 'percent' },
  { id: 'electricityAccess', label: 'Electricity Access (%)', valueKey: 'electricity_access_pct', type: 'percent' },
]

export default function Comparison() {
  const { data, countries } = useDashboardData()
  const { yearRange } = useDashboard()

  const [selected, setSelected] = useState([])
  const [metricId, setMetricId] = useState(METRICS[0].id)
  const metric = METRICS.find((m) => m.id === metricId)

  const addCountry = (country) => {
    setSelected((cur) => {
      if (cur.find((c) => c.country_code === country.country_code)) return cur
      if (cur.length >= 3) return cur
      return [...cur, country]
    })
  }

  const removeCountry = (code) =>
    setSelected((cur) => cur.filter((c) => c.country_code !== code))

  const dataset = data[metric.id] || []
  // inflation may fall back to gdp_growth shape; pick whichever field exists.
  const valueKey =
    dataset.length && metric.valueKey in dataset[0] ? metric.valueKey : 'gdp_growth_rate'

  const rows = useMemo(() => {
    const seriesMap = {}
    for (const c of selected) {
      const points = averageByYear(
        dataset.filter((r) => r.country_name === c.country_name && inYearRange(r, yearRange)),
        valueKey
      )
      seriesMap[c.country_name] = points
    }
    return pivotByYear(seriesMap)
  }, [selected, dataset, valueKey, yearRange])

  return (
    <div>
      <div className="card" style={{ padding: 18, marginBottom: 18 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 280px', minWidth: 240 }}>
            <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Add country (max 3)
            </label>
            <CountrySearch countries={countries} onSelect={addCountry} />
          </div>

          <div style={{ flex: '0 1 240px' }}>
            <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Indicator
            </label>
            <select
              className="input-text"
              value={metricId}
              onChange={(e) => setMetricId(e.target.value)}
            >
              {METRICS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: '1 1 220px', minWidth: 200 }}>
            <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Year range
            </label>
            <YearRangeSlider />
          </div>
        </div>

        {selected.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
            {selected.map((c, i) => (
              <span key={c.country_code} className="chip">
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: SERIES_COLORS[i % SERIES_COLORS.length],
                  }}
                />
                {c.country_name}
                <button aria-label={`Remove ${c.country_name}`} onClick={() => removeCountry(c.country_code)}>
                  <Cancel01Icon size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {selected.length < 2 ? (
        <div className="card">
          <EmptyState
            title="Select at least 2 countries"
            message="Add two or three African countries above to compare them side by side."
          />
        </div>
      ) : (
        <ChartCard title={metric.label} subtitle="Country comparison">
          <ResponsiveContainer width="100%" height={380}>
            <LineChart data={rows} margin={{ top: 8, right: 16, bottom: 4, left: -8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef0f3" />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip
                labelStyle={{ fontFamily: 'var(--font-mono)' }}
                formatter={(value, name) => [formatNumber(value, metric.type), name]}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {selected.map((c, i) => (
                <Line
                  key={c.country_code}
                  type="monotone"
                  dataKey={c.country_name}
                  stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </div>
  )
}
