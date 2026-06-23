import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu01Icon, Cancel01Icon } from 'hugeicons-react'
import { NAV_ITEMS } from './navConfig'

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="mobile-trigger"
        aria-label="Open navigation"
        onClick={() => setOpen(true)}
      >
        <Menu01Icon size={22} />
      </button>

      {open && (
        <div className="mobile-overlay">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 24,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--accent)',
                fontWeight: 800,
                fontSize: 18,
              }}
            >
              Africa Growth Lens
            </div>
            <button
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
              }}
            >
              <Cancel01Icon size={26} />
            </button>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {NAV_ITEMS.map(({ label, to, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  isActive ? 'nav-item active' : 'nav-item'
                }
              >
                <Icon size={20} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div style={{ color: '#4b5563', fontSize: 11, marginTop: 'auto' }}>
            Data: World Bank WDI
          </div>
        </div>
      )}
    </>
  )
}
