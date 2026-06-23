import { useDashboard, MIN_YEAR, MAX_YEAR } from '../../context/DashboardContext'

/**
 * Dual-handle year range slider (2000–2022) backed by global yearRange.
 * Implemented as two overlaid range inputs with an amber active track.
 */
export default function YearRangeSlider() {
  const { yearRange, setYearRange } = useDashboard()
  const [start, end] = yearRange
  const span = MAX_YEAR - MIN_YEAR

  const pct = (v) => ((v - MIN_YEAR) / span) * 100

  const setStart = (v) => setYearRange([Math.min(Number(v), end), end])
  const setEnd = (v) => setYearRange([start, Math.max(Number(v), start)])

  return (
    <div style={{ width: '100%' }}>
      <div style={{ position: 'relative', height: 28 }}>
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 0,
            right: 0,
            height: 4,
            borderRadius: 4,
            background: 'var(--border)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 12,
            height: 4,
            borderRadius: 4,
            background: 'var(--accent)',
            left: `${pct(start)}%`,
            right: `${100 - pct(end)}%`,
          }}
        />
        <input
          type="range"
          min={MIN_YEAR}
          max={MAX_YEAR}
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="range-thumb"
          aria-label="Start year"
        />
        <input
          type="range"
          min={MIN_YEAR}
          max={MAX_YEAR}
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="range-thumb"
          aria-label="End year"
        />
      </div>

      <div
        className="mono"
        style={{ marginTop: 6, fontSize: 13, color: 'var(--text-secondary)' }}
      >
        {start} — {end}
      </div>
    </div>
  )
}
