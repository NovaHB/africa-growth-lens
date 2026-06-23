import { useDashboardData } from '../App'
import SkeletonChart from '../components/ui/SkeletonChart'
import CountryOverview from '../components/ui/CountryOverview'
import GDPChart from '../components/charts/GDPChart'
import DigitalAdoptionChart from '../components/charts/DigitalAdoptionChart'
import InflationChart from '../components/charts/InflationChart'

export default function Overview() {
  const { data, loading } = useDashboardData()

  return (
    <div>
      <CountryOverview data={data.countryLatest} loading={loading} />

      <div className="two-col">
        {loading ? <SkeletonChart /> : <GDPChart data={data.gdpGrowth} topN={5} />}
        {loading ? <SkeletonChart /> : <DigitalAdoptionChart data={data.digitalAdoption} />}
      </div>

      <div style={{ marginTop: 18 }}>
        {loading ? <SkeletonChart /> : <InflationChart data={data.inflation} />}
      </div>
    </div>
  )
}
