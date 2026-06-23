import { ArrowUp01Icon, ArrowDown01Icon, MinusSignIcon } from 'hugeicons-react'
import SkeletonCard from './SkeletonCard'
import DownloadButton from './DownloadButton'
import { formatNumber } from '../../utils/formatNumber'

const TREND_COLORS = {
  positive: 'var(--positive)',
  negative: 'var(--negative)',
  neutral: 'var(--text-secondary)',
}

const TREND_ICONS = {
  positive: ArrowUp01Icon,
  negative: ArrowDown01Icon,
  neutral: MinusSignIcon,
}

export default function StatCard({
  id,
  title,
  value,
  subtitle,
  icon: Icon,
  trend = 'neutral',
  trendValue,
  format,
  loading = false,
}) {
  if (loading) return <SkeletonCard />

  const TrendIcon = TREND_ICONS[trend] || MinusSignIcon
  const color = TREND_COLORS[trend] || TREND_COLORS.neutral
  const displayValue = format ? formatNumber(value, format) : value
  const cardId = id || `stat-${String(title).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

  return (
    <div id={cardId} className="card downloadable-card" style={{ padding: 20, position: 'relative' }}>
      <DownloadButton targetId={cardId} filename={title} />

      {Icon && (
        <div
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            width: 36,
            height: 36,
            borderRadius: 9,
            background: 'rgba(245, 158, 11, 0.12)',
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={20} />
        </div>
      )}

      <div style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}>
        {title}
      </div>

      <div
        className="mono"
        style={{ fontSize: 28, fontWeight: 600, margin: '10px 0 6px' }}
      >
        {displayValue}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {trendValue != null && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              color,
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            <TrendIcon size={15} />
            {trendValue}
          </span>
        )}
        {subtitle && (
          <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  )
}
