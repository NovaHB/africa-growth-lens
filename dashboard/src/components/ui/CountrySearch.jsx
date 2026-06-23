import { useMemo, useRef, useState } from 'react'
import { Search01Icon, Cancel01Icon } from 'hugeicons-react'
import { useDashboard } from '../../context/DashboardContext'

/**
 * Country search input with live-filtered dropdown.
 * `countries`: array of { country_code, country_name, region }.
 * `onSelect`: optional override; defaults to setting the global selectedCountry.
 */
export default function CountrySearch({ countries = [], onSelect }) {
  const { selectedCountry, setSelectedCountry } = useDashboard()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const blurTimer = useRef(null)

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return countries.slice(0, 8)
    return countries
      .filter((c) => c.country_name.toLowerCase().includes(q))
      .slice(0, 8)
  }, [query, countries])

  const handleSelect = (country) => {
    if (onSelect) onSelect(country)
    else setSelectedCountry(country.country_name)
    setQuery('')
    setOpen(false)
  }

  return (
    <div
      style={{ position: 'relative', width: '100%' }}
      onBlur={() => {
        blurTimer.current = setTimeout(() => setOpen(false), 120)
      }}
      onFocus={() => {
        clearTimeout(blurTimer.current)
        setOpen(true)
      }}
    >
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          boxShadow: 'none',
        }}
      >
        <Search01Icon size={18} color="#6b7280" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          placeholder="Search African countries..."
          style={{
            border: 'none',
            outline: 'none',
            flex: 1,
            fontSize: 14,
            background: 'transparent',
            color: 'var(--text-primary)',
          }}
        />
        {selectedCountry && (
          <button
            aria-label="Clear selected country"
            onClick={() => setSelectedCountry(null)}
            style={{ background: 'transparent', border: 'none', display: 'flex' }}
          >
            <Cancel01Icon size={16} color="#6b7280" />
          </button>
        )}
      </div>

      {selectedCountry && !query && (
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, paddingLeft: 4 }}>
          Selected: <strong style={{ color: 'var(--text-primary)' }}>{selectedCountry}</strong>
        </div>
      )}

      {open && matches.length > 0 && (
        <ul
          className="card"
          style={{
            listStyle: 'none',
            margin: '6px 0 0',
            padding: 6,
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 40,
            maxHeight: 280,
            overflowY: 'auto',
          }}
        >
          {matches.map((c) => (
            <li key={c.country_code}>
              <button
                onMouseDown={() => handleSelect(c)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: 'transparent',
                  border: 'none',
                  padding: '9px 10px',
                  borderRadius: 8,
                  fontSize: 14,
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <span>{c.country_name}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                  {c.region === 'Sub-Saharan Africa' ? 'SSA' : 'MENA'}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
