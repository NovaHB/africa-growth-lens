import { useMemo, useState } from 'react'
import { ArrowUp01Icon, ArrowDown01Icon } from 'hugeicons-react'
import { formatNumber } from '../../utils/formatNumber'

const COLUMNS = [
  { key: 'country_rank', label: 'Rank', numeric: true },
  { key: 'country_name', label: 'Country', numeric: false },
  { key: 'region', label: 'Region', numeric: false },
  { key: 'income_group', label: 'Income Group', numeric: false },
  { key: 'value', label: 'Value', numeric: true },
  { key: 'yoy_change', label: 'YoY Change', numeric: true },
]

/**
 * Sortable rankings table. `rows` should already be filtered by indicator/search.
 * Rows may include an optional `yoy_change` field.
 */
export default function RankingsTable({ rows = [] }) {
  const [sort, setSort] = useState({ key: 'country_rank', dir: 'asc' })

  const sorted = useMemo(() => {
    const copy = [...rows]
    copy.sort((a, b) => {
      const av = a[sort.key]
      const bv = b[sort.key]
      if (av == null) return 1
      if (bv == null) return -1
      if (typeof av === 'number' && typeof bv === 'number') {
        return sort.dir === 'asc' ? av - bv : bv - av
      }
      return sort.dir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av))
    })
    return copy
  }, [rows, sort])

  const toggleSort = (key) =>
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: key === 'country_name' ? 'asc' : 'asc' }
    )

  return (
    <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                onClick={() => toggleSort(col.key)}
                style={{ textAlign: col.numeric ? 'right' : 'left', cursor: 'pointer' }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {col.label}
                  {sort.key === col.key &&
                    (sort.dir === 'asc' ? (
                      <ArrowUp01Icon size={13} />
                    ) : (
                      <ArrowDown01Icon size={13} />
                    ))}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={`${r.country_code}-${r.indicator_code}`}>
              <td className="mono" style={{ textAlign: 'right' }}>{r.country_rank}</td>
              <td>{r.country_name}</td>
              <td>{r.region === 'Sub-Saharan Africa' ? 'SSA' : 'MENA'}</td>
              <td>{r.income_group}</td>
              <td className="mono" style={{ textAlign: 'right' }}>{formatNumber(r.value)}</td>
              <td
                className="mono"
                style={{
                  textAlign: 'right',
                  color:
                    r.yoy_change == null
                      ? 'var(--text-secondary)'
                      : r.yoy_change >= 0
                        ? 'var(--positive)'
                        : 'var(--negative)',
                }}
              >
                {r.yoy_change == null
                  ? '—'
                  : `${r.yoy_change >= 0 ? '+' : ''}${formatNumber(r.yoy_change)}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {sorted.length === 0 && (
        <div style={{ padding: 28, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
          No countries match your filters.
        </div>
      )}
    </div>
  )
}
