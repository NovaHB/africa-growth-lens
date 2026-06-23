import { useMemo, useState } from 'react'
import { useDashboardData } from '../App'
import SkeletonChart from '../components/ui/SkeletonChart'
import RankingsTable from '../components/charts/RankingsTable'

export default function Rankings() {
  const { data, loading } = useDashboardData()
  const rankings = data.countryRankings || []
  const yoy = data.yoyChanges || []

  // Distinct indicators present in the rankings data.
  const indicators = useMemo(() => {
    const map = new Map()
    for (const r of rankings) {
      if (!map.has(r.indicator_code)) map.set(r.indicator_code, r.indicator_name)
    }
    return [...map.entries()].map(([code, name]) => ({ code, name }))
  }, [rankings])

  const [active, setActive] = useState(null)
  const [search, setSearch] = useState('')

  const activeCode = active || indicators[0]?.code

  // Lookup of YoY change by country+indicator+year.
  const yoyLookup = useMemo(() => {
    const m = new Map()
    for (const r of yoy) {
      m.set(`${r.country_code}|${r.indicator_code}|${r.year}`, r.yoy_change)
    }
    return m
  }, [yoy])

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rankings
      .filter((r) => r.indicator_code === activeCode)
      .filter((r) => !q || r.country_name.toLowerCase().includes(q))
      .map((r) => ({
        ...r,
        yoy_change: yoyLookup.get(`${r.country_code}|${r.indicator_code}|${r.year}`) ?? null,
      }))
  }, [rankings, activeCode, search, yoyLookup])

  if (loading) return <SkeletonChart height={420} />

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

      <input
        className="input-text"
        placeholder="Search countries..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: 320, marginBottom: 16 }}
      />

      <RankingsTable rows={rows} />
    </div>
  )
}
