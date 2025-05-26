"use client"

import { useMemo } from "react"
import { useLanguage } from "../../context/LanguageContext"
import "./TripChart.css"

const TripChart = ({ trips }) => {
  const { t } = useLanguage()

  const chartData = useMemo(() => {
    const monthlyData = {}

    trips.forEach((trip) => {
      const month = new Date(trip.startDate).toLocaleString("default", { month: "short" })
      monthlyData[month] = (monthlyData[month] || 0) + 1
    })

    return Object.entries(monthlyData).map(([month, count]) => ({
      month,
      count,
      percentage: trips.length > 0 ? (count / trips.length) * 100 : 0,
    }))
  }, [trips])

  return (
    <div className="trip-chart">
      <h3>{t("dashboard.tripsChart")}</h3>
      <div className="chart-container">
        {chartData.map((data, index) => (
          <div key={index} className="chart-bar">
            <div className="chart-bar-fill" style={{ height: `${data.percentage}%` }} />
            <div className="chart-bar-label">{data.month}</div>
            <div className="chart-bar-value">{data.count}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TripChart
