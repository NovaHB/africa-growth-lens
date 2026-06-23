import {
  Home01Icon,
  Globe02Icon,
  BarChartIcon,
  ChampionIcon,
  ChartUpIcon,
  GitCompareIcon,
} from 'hugeicons-react'

// Shared navigation definition used by both Sidebar and MobileNav.
// Note: BarChartIcon / ChampionIcon / ChartUpIcon are the closest valid names
// in this hugeicons-react build (the spec's *02/*01 variants do not exist).
export const NAV_ITEMS = [
  { label: 'Overview', to: '/dashboard', icon: Home01Icon, end: true },
  { label: 'Countries', to: '/dashboard/countries', icon: Globe02Icon },
  { label: 'Indicators', to: '/dashboard/indicators', icon: BarChartIcon },
  { label: 'Rankings', to: '/dashboard/rankings', icon: ChampionIcon },
  { label: 'Trends', to: '/dashboard/trends', icon: ChartUpIcon },
  { label: 'Comparison', to: '/dashboard/comparison', icon: GitCompareIcon },
]

export const PAGE_TITLES = {
  '/dashboard': 'Overview',
  '/dashboard/countries': 'Countries',
  '/dashboard/indicators': 'Indicators',
  '/dashboard/rankings': 'Rankings',
  '/dashboard/trends': 'Trends',
  '/dashboard/comparison': 'Comparison',
}
