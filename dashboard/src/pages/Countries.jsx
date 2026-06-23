import { useDashboardData } from '../App'
import { useDashboard } from '../context/DashboardContext'
import CountrySearch from '../components/ui/CountrySearch'
import YearRangeSlider from '../components/ui/YearRangeSlider'
import EmptyState from '../components/ui/EmptyState'
import SkeletonChart from '../components/ui/SkeletonChart'
import GDPChart from '../components/charts/GDPChart'
import DigitalAdoptionChart from '../components/charts/DigitalAdoptionChart'
import InflationChart from '../components/charts/InflationChart'
import ElectricityChart from '../components/charts/ElectricityChart'

export default function Countries() {
  const { data, loading, countries } = useDashboardData()
  const { selectedCountry } = useDashboard()

  return (
    <div>
      <div className="card" style={{ padding: 18, marginBottom: 18 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 300px', minWidth: 240 }}>
            <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Country
            </label>
            <CountrySearch countries={countries} />
          </div>
          <div style={{ flex: '1 1 240px', minWidth: 220 }}>
            <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Year range
            </label>
            <YearRangeSlider />
          </div>
        </div>
      </div>

      {!selectedCountry ? (
        <div className="card">
          <EmptyState />
        </div>
      ) : loading ? (
        <div className="two-col">
          <SkeletonChart />
          <SkeletonChart />
        </div>
      ) : (
        <>
          <div className="two-col">
            <GDPChart data={data.gdpGrowth} />
            <DigitalAdoptionChart data={data.digitalAdoption} />
          </div>
          <div className="two-col">
            <InflationChart data={data.inflation} />
            <ElectricityChart data={data.electricityAccess} />
          </div>
        </>
      )}
    </div>
  )
}
