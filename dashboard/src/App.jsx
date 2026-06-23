import { BrowserRouter, Routes, Route, Outlet, useOutletContext } from 'react-router-dom'
import { DashboardProvider } from './context/DashboardContext'
import { useData } from './hooks/useData'
import { uniqueCountries } from './lib/dataUtils'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import MobileNav from './components/layout/MobileNav'
import Landing from './pages/Landing'
import Overview from './pages/Overview'
import Countries from './pages/Countries'
import Indicators from './pages/Indicators'
import Rankings from './pages/Rankings'
import Trends from './pages/Trends'
import Comparison from './pages/Comparison'

function DashboardLayout() {
  const { data, loading, error } = useData()
  const countries = uniqueCountries(data.gdpGrowth || [])

  return (
    <div className="app-shell">
      <Sidebar />
      <MobileNav />
      <div className="content-area">
        <Header countries={countries} />
        <main className="page-body">
          <Outlet context={{ data, loading, error, countries }} />
        </main>
      </div>
    </div>
  )
}

// Convenience hook for pages to read the shared data context.
export function useDashboardData() {
  return useOutletContext()
}

export default function App() {
  return (
    <DashboardProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="countries" element={<Countries />} />
            <Route path="indicators" element={<Indicators />} />
            <Route path="rankings" element={<Rankings />} />
            <Route path="trends" element={<Trends />} />
            <Route path="comparison" element={<Comparison />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DashboardProvider>
  )
}
