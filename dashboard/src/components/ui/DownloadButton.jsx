import { Download02Icon } from 'hugeicons-react'
import { downloadCard } from '../../utils/downloadCard'

/**
 * Small top-left download affordance for a shareable card.
 * Reveals on hover of the parent `.downloadable-card`; exports that card
 * (by `targetId`) to a 2x PNG with the Africa Growth Lens watermark.
 */
export default function DownloadButton({ targetId, filename }) {
  const handleClick = async (e) => {
    e.stopPropagation()
    try {
      await downloadCard(targetId, filename)
    } catch (err) {
      console.error('Card download failed', err)
    }
  }

  return (
    <button
      className="card-dl-btn"
      aria-label={`Download ${filename} card`}
      onClick={handleClick}
    >
      <Download02Icon size={16} />
    </button>
  )
}
