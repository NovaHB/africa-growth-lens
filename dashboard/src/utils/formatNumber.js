export function formatNumber(value, type = 'default') {
  if (value === null || value === undefined || isNaN(value))
    return 'N/A';

  const num = parseFloat(value);

  if (type === 'percent') {
    return `${num.toFixed(1)}%`;
  }
  if (type === 'currency') {
    if (Math.abs(num) >= 1_000_000_000)
      return `$${(num / 1_000_000_000).toFixed(1)}B`;
    if (Math.abs(num) >= 1_000_000)
      return `$${(num / 1_000_000).toFixed(1)}M`;
    if (Math.abs(num) >= 1_000)
      return `$${(num / 1_000).toFixed(1)}K`;
    return `$${num.toFixed(0)}`;
  }
  if (Math.abs(num) >= 1_000_000_000)
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  if (Math.abs(num) >= 1_000_000)
    return `${(num / 1_000_000).toFixed(1)}M`;
  if (Math.abs(num) >= 1_000)
    return `${(num / 1_000).toFixed(1)}K`;
  return num.toFixed(1);
}
