import SkeletonCard from './SkeletonCard'
import EmptyState from './EmptyState'
import DownloadButton from './DownloadButton'
import { useDashboard } from '../../context/DashboardContext'
import { formatNumber } from '../../utils/formatNumber'

// Six headline metrics, mapped to their WDI indicator codes.
// `signed` cards (GDP growth, inflation) are colored by the sign of the value.
const METRICS = [
  { code: 'NY.GDP.MKTP.KD.ZG', label: 'GDP Growth Rate', type: 'percent', unit: 'annual %', signed: true, id: 'card-gdp-growth' },
  { code: 'NY.GDP.PCAP.KD', label: 'GDP Per Capita', type: 'currency', unit: 'USD (constant 2015)', signed: false, id: 'card-gdp-per-capita' },
  { code: 'FP.CPI.TOTL.ZG', label: 'Inflation Rate', type: 'percent', unit: 'annual %', signed: true, id: 'card-inflation' },
  { code: 'IT.NET.USER.ZS', label: 'Internet Penetration %', type: 'percent', unit: '% of population', signed: false, id: 'card-internet' },
  { code: 'IT.CEL.SETS.P2', label: 'Mobile Subscriptions per 100', type: 'default', unit: 'per 100 people', signed: false, id: 'card-mobile' },
  { code: 'EG.ELC.ACCS.ZS', label: 'Electricity Access %', type: 'percent', unit: '% of population', signed: false, id: 'card-electricity' },
]

function MetricCard({ id, label, value, year, type, unit, signed }) {
  const hasValue = value != null && !Number.isNaN(value)

  let color = 'var(--text-primary)'
  if (!hasValue) color = 'var(--text-secondary)'
  else if (signed) color = value >= 0 ? 'var(--positive)' : 'var(--negative)'

  return (
    <div id={id} className="card downloadable-card" style={{ padding: 18, position: 'relative' }}>
      <DownloadButton targetId={id} filename={label} />

      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
        {label}
      </div>

      <div className="mono" style={{ fontSize: 28, fontWeight: 700, color, margin: '10px 0 4px' }}>
        {formatNumber(value, type)}
      </div>

      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{unit}</div>

      <div className="mono" style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 6 }}>
        {hasValue && year != null ? `as of ${year}` : 'no data'}
      </div>
    </div>
  )
}

/**
 * Headline metric grid (3x2) for the selected country, sourced from
 * country_latest.json (one most-recent row per country per indicator).
 * All six cards always render; missing values show N/A.
 */
export default function CountryOverview({ data = [], loading = false }) {
  const { selectedCountry } = useDashboard()

  if (loading) {
    return (
      <div className="metric-grid">
        {METRICS.map((m) => (
          <SkeletonCard key={m.code} />
        ))}
      </div>
    )
  }

  if (!selectedCountry) {
    return (
      <div className="card">
        <EmptyState />
      </div>
    )
  }

  // Latest value per indicator for the selected country.
  const byIndicator = new Map()
  for (const row of data) {
    if (row.country_name === selectedCountry) {
      byIndicator.set(row.indicator_code, row)
    }
  }

  return (
    <div>
      <h2 className="section-title">{selectedCountry}</h2>
      <div className="metric-grid">
        {METRICS.map((m) => {
          const row = byIndicator.get(m.code)
          return (
            <MetricCard
              key={m.code}
              id={m.id}
              label={m.label}
              value={row ? row.value : null}
              year={row ? row.year : null}
              type={m.type}
              unit={m.unit}
              signed={m.signed}
            />
          )
        })}
      </div>
    </div>
  )
}
