import DownloadButton from '../ui/DownloadButton'

function slug(s) {
  return `chart-${String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
}

export default function ChartCard({ title, subtitle, children, action, downloadable = true }) {
  const id = slug(title)

  return (
    <div id={id} className="card downloadable-card" style={{ padding: 20, position: 'relative' }}>
      {downloadable && <DownloadButton targetId={id} filename={title} />}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
          marginBottom: 16,
          // leave room for the absolute download button in the top-right
          paddingRight: 40,
        }}
      >
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>{title}</h3>
          {subtitle && (
            <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 2 }}>
              {subtitle}
            </div>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}
