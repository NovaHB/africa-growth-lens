import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from './navConfig'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div style={{ padding: '0 8px 24px' }}>
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--accent)',
            fontWeight: 800,
            fontSize: 20,
            letterSpacing: '-0.01em',
          }}
        >
          Africa Growth Lens
        </div>
        <div style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>
          Economic Dashboard
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {NAV_ITEMS.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              isActive ? 'nav-item active' : 'nav-item'
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ color: '#4b5563', fontSize: 11, padding: '12px 8px 0' }}>
        Data: World Bank WDI
      </div>
    </aside>
  )
}
