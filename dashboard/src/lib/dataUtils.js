// Shared helpers for shaping mart JSON into chart-ready series.

// Multi-series palette (accent first, then distinct hues that read on light bg).
export const SERIES_COLORS = [
  '#f59e0b', // accent amber
  '#2563eb', // blue
  '#10b981', // green
  '#8b5cf6', // violet
  '#ef4444', // red
  '#0891b2', // cyan
]

export const INDICATOR_NAMES = {
  'NY.GDP.MKTP.KD.ZG': 'GDP growth (annual %)',
  'NY.GDP.PCAP.KD': 'GDP per capita (constant 2015 US$)',
  'FP.CPI.TOTL.ZG': 'Inflation, consumer prices (annual %)',
  'BX.KLT.DINV.WD.GD.ZS': 'Foreign direct investment (% of GDP)',
  'NE.TRD.GNFS.ZS': 'Trade (% of GDP)',
  'IT.NET.USER.ZS': 'Internet users (% of population)',
  'IT.CEL.SETS.P2': 'Mobile subscriptions (per 100)',
  'FX.OWN.TOTL.ZS': 'Account ownership (% age 15+)',
  'EG.ELC.ACCS.ZS': 'Access to electricity (%)',
  'SP.POP.TOTL': 'Population, total',
  'SP.POP.GROW': 'Population growth (annual %)',
  'SP.URB.TOTL.IN.ZS': 'Urban population (% of total)',
  'SE.ADT.LITR.ZS': 'Adult literacy rate (%)',
  'SH.DYN.MORT': 'Under-5 mortality (per 1,000)',
  'SP.DYN.LE00.IN': 'Life expectancy (years)',
}

// Distinct {country_code, country_name, region} sorted by name.
export function uniqueCountries(rows = []) {
  const map = new Map()
  for (const r of rows) {
    if (r.country_code && !map.has(r.country_code)) {
      map.set(r.country_code, {
        country_code: r.country_code,
        country_name: r.country_name,
        region: r.region,
      })
    }
  }
  return [...map.values()].sort((a, b) =>
    a.country_name.localeCompare(b.country_name)
  )
}

export function inYearRange(row, [start, end], key = 'year') {
  return row[key] >= start && row[key] <= end
}

// Average a value field per year across the given rows -> [{ year, value }].
export function averageByYear(rows, valueKey = 'value') {
  const buckets = new Map()
  for (const r of rows) {
    const v = r[valueKey]
    if (v == null) continue
    if (!buckets.has(r.year)) buckets.set(r.year, { sum: 0, n: 0 })
    const b = buckets.get(r.year)
    b.sum += v
    b.n += 1
  }
  return [...buckets.entries()]
    .map(([year, { sum, n }]) => ({ year: Number(year), value: sum / n }))
    .sort((a, b) => a.year - b.year)
}

// Wide rows keyed by year, one column per series key -> for multi-line charts.
export function pivotByYear(seriesMap) {
  // seriesMap: { seriesKey: [{ year, value }] }
  const byYear = new Map()
  for (const [key, points] of Object.entries(seriesMap)) {
    for (const p of points) {
      if (!byYear.has(p.year)) byYear.set(p.year, { year: p.year })
      byYear.get(p.year)[key] = p.value
    }
  }
  return [...byYear.values()].sort((a, b) => a.year - b.year)
}
