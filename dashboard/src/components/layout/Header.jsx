import { useLocation } from 'react-router-dom'
import CountrySearch from '../ui/CountrySearch'
import { PAGE_TITLES } from './navConfig'

export default function Header({ countries = [] }) {
  const { pathname } = useLocation()
  const title = PAGE_TITLES[pathname] || 'Dashboard'

  return (
    <header className="header">
      <h2 style={{ fontSize: 20, fontWeight: 700 }}>{title}</h2>

      <div style={{ flex: 1, maxWidth: 360 }}>
        <CountrySearch countries={countries} />
      </div>

      <div
        className="mono"
        style={{ color: 'var(--text-secondary)', fontSize: 12, whiteSpace: 'nowrap' }}
      >
        Last Updated: 2022
      </div>
    </header>
  )
}
