import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight01Icon } from 'hugeicons-react'

const STATS = [
  ['69', 'Countries'],
  ['15', 'Indicators'],
  ['22', 'Years'],
  ['13', 'Datasets'],
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 32px',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            fontSize: 20,
          }}
        >
          Africa Growth Lens
        </div>
        <Link
          to="/dashboard"
          className="btn-accent"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          View Dashboard <ArrowRight01Icon size={18} />
        </Link>
      </nav>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '40px 24px',
        }}
      >
        <div className="eyebrow">World Bank WDI Data</div>

        <h1
          style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 800,
            lineHeight: 1.05,
            maxWidth: 880,
            margin: '18px 0',
            letterSpacing: '-0.02em',
          }}
        >
          African Economic Data, Modeled and Ready
        </h1>

        <p
          style={{
            fontSize: 18,
            color: 'var(--text-secondary)',
            maxWidth: 620,
            lineHeight: 1.6,
          }}
        >
          A research-grade dashboard covering 69 countries, 15 indicators, and
          20+ years of World Bank data.
        </p>

        <button
          className="btn-accent"
          onClick={() => navigate('/dashboard')}
          style={{
            marginTop: 28,
            fontSize: 16,
            padding: '14px 26px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          Explore Dashboard <ArrowRight01Icon size={19} />
        </button>
      </div>

      <div
        className="mono"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 16,
          padding: '28px 24px 48px',
          color: 'var(--text-secondary)',
          fontSize: 14,
        }}
      >
        {STATS.map(([num, label], i) => (
          <span key={label} style={{ display: 'inline-flex', gap: 16 }}>
            <span>
              <strong style={{ color: 'var(--text-primary)' }}>{num}</strong> {label}
            </span>
            {i < STATS.length - 1 && <span style={{ opacity: 0.4 }}>|</span>}
          </span>
        ))}
      </div>
    </div>
  )
}
