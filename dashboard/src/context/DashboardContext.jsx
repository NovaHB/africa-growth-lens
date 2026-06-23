import { createContext, useContext, useState } from 'react'

const DashboardContext = createContext(null)

export const MIN_YEAR = 2000
export const MAX_YEAR = 2022

export function DashboardProvider({ children }) {
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [yearRange, setYearRange] = useState([MIN_YEAR, MAX_YEAR])
  const [activeIndicator, setActiveIndicator] = useState(null)

  const value = {
    selectedCountry,
    setSelectedCountry,
    selectedRegion,
    setSelectedRegion,
    yearRange,
    setYearRange,
    activeIndicator,
    setActiveIndicator,
  }

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return ctx
}
