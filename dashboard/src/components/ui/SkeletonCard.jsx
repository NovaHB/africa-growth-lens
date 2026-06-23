export default function SkeletonCard() {
  return (
    <div className="card" style={{ padding: 20, height: 132 }}>
      <div className="shimmer" style={{ width: 90, height: 12, marginBottom: 18 }} />
      <div className="shimmer" style={{ width: 130, height: 28, marginBottom: 14 }} />
      <div className="shimmer" style={{ width: 70, height: 12 }} />
    </div>
  )
}
