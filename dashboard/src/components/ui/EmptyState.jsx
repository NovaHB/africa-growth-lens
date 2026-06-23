import { Globe02Icon } from 'hugeicons-react'

export default function EmptyState({
  title = 'Select a Country to Begin',
  message = 'Search for an African country to explore its economic indicators',
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '64px 24px',
        color: 'var(--text-secondary)',
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 18,
          background: 'rgba(245, 158, 11, 0.12)',
          color: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
        }}
      >
        <Globe02Icon size={38} />
      </div>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <p style={{ marginTop: 8, maxWidth: 360, fontSize: 14 }}>{message}</p>
    </div>
  )
}
