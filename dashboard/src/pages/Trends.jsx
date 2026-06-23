import { useMemo } from 'react'
import { useDashboardData } from '../App'
import { useDashboard } from '../context/DashboardContext'
import YearRangeSlider from '../components/ui/YearRangeSlider'
import SkeletonChart from '../components/ui/SkeletonChart'
import YoYChart from '../components/charts/YoYChart'
import GDPChart from '../components/charts/GDPChart'
import ElectricityChart from '../components/charts/ElectricityChart'

export default function Trends() {
  const { data, loading } = useDashboardData()
  const { activeIndicator, setActiveIndicator } = useDashboard()

  const indicators = useMemo(() => {
    const map = new Map()
    for (const r of data.yoyChanges || []) {
      if (!map.has(r.indicator_code)) map.set(r.indicator_code, r.indicator_name)
    }
    return [...map.entries()].map(([code, name]) => ({ code, name }))
  }, [data.yoyChanges])

  const current = activeIndicator || indicators[0]?.code || ''

  if (loading) return <SkeletonChart height={420} />

  return (
    <div>
      <div className="card" style={{ padding: 18, marginBottom: 18 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end' }}>
          <div style={{ flex: '0 1 320px' }}>
            <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Indicator (for year-over-year)
            </label>
            <select
              className="input-text"
              value={current}
              onChange={(e) => setActiveIndicator(e.target.value)}
            >
              {indicators.map((ind) => (
                <option key={ind.code} value={ind.code}>
                  {ind.name}
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
      </div>

      <div style={{ marginBottom: 18 }}>
        <YoYChart data={data.yoyChanges} />
      </div>

      <div className="two-col">
        <GDPChart data={data.gdpGrowth} topN={5} />
        <ElectricityChart data={data.electricityAccess} />
      </div>
    </div>
  )
}
