import { useEffect, useState } from 'react'

// Logical dataset name -> source file in /public/data.
// inflation falls back to gdp_growth if inflation.json has not been exported.
const DATASETS = {
  gdpGrowth: 'gdp_growth.json',
  digitalAdoption: 'digital_adoption.json',
  inflation: 'inflation.json',
  gdpPerCapita: 'gdp_per_capita.json',
  populationTrends: 'population_trends.json',
  tradeInvestment: 'trade_investment.json',
  humanDevelopment: 'human_development.json',
  electricityAccess: 'electricity_access.json',
  countryRankings: 'country_rankings.json',
  yoyChanges: 'yoy_changes.json',
  incomeGroupSummary: 'income_group_summary.json',
  countryLatest: 'country_latest.json',
}

const FALLBACKS = {
  inflation: 'gdp_growth.json',
}

const BASE = `${import.meta.env.BASE_URL}data/`

async function fetchJson(file) {
  const res = await fetch(`${BASE}${file}`)
  if (!res.ok) throw new Error(`Failed to load ${file} (${res.status})`)
  return res.json()
}

/**
 * Loads every dashboard dataset in parallel.
 * Returns { data, loading, error } where data is keyed by logical name.
 * A single dataset failing (e.g. missing optional file) does not break the rest.
 */
export function useData() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const keys = Object.keys(DATASETS)

    Promise.all(
      keys.map(async (key) => {
        try {
          return [key, await fetchJson(DATASETS[key])]
        } catch (err) {
          if (FALLBACKS[key]) {
            try {
              return [key, await fetchJson(FALLBACKS[key])]
            } catch {
              return [key, []]
            }
          }
          return [key, [], err]
        }
      })
    )
      .then((entries) => {
        if (cancelled) return
        const next = {}
        let firstError = null
        for (const [key, value, err] of entries) {
          next[key] = value
          if (err && !firstError) firstError = err
        }
        setData(next)
        setError(firstError)
        setLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err)
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading, error }
}
