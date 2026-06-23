export default function SkeletonChart({ height = 320 }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div className="shimmer" style={{ width: 160, height: 16, marginBottom: 20 }} />
      <div className="shimmer" style={{ width: '100%', height }} />
    </div>
  )
}
