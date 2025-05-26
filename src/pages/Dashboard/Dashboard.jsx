"use client"

import { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useLanguage } from "../../context/LanguageContext"
import { fetchTrips } from "../../store/slices/tripsSlice"
import StatsCard from "../../components/Dashboard/StatsCard"
import TripChart from "../../components/Dashboard/TripChart"
import RecentTrips from "../../components/Dashboard/RecentTrips"
import "./Dashboard.css"

const Dashboard = () => {
  const dispatch = useDispatch()
  const { user } = useAuth()
  const { t } = useLanguage()
  const { items: trips, loading } = useSelector((state) => state.trips)

  useEffect(() => {
    dispatch(fetchTrips())
  }, [dispatch])

  const stats = useMemo(() => {
    const userTrips = user?.role === "admin" ? trips : trips.filter((trip) => trip.userId === user?.id)

    return {
      total: userTrips.length,
      pending: userTrips.filter((trip) => trip.status === "pending").length,
      approved: userTrips.filter((trip) => trip.status === "approved").length,
      completed: userTrips.filter((trip) => trip.status === "completed").length,
    }
  }, [trips, user])

  if (loading) {
    return <div className="loading">{t("common.loading")}</div>
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>
          {t("dashboard.welcome")}, {user?.name}!
        </h1>
        <Link to="/trips/create" className="btn btn-primary">
          {t("trips.createNew")}
        </Link>
      </div>

      <div className="dashboard-stats">
        <StatsCard title={t("dashboard.totalTrips")} value={stats.total} icon="✈️" color="blue" />
        <StatsCard title={t("dashboard.pendingTrips")} value={stats.pending} icon="⏳" color="orange" />
        <StatsCard title={t("dashboard.approvedTrips")} value={stats.approved} icon="✅" color="green" />
        <StatsCard title={t("dashboard.completedTrips")} value={stats.completed} icon="🏁" color="purple" />
      </div>

      <div className="dashboard-content">
        <div className="dashboard-chart">
          <TripChart trips={trips} />
        </div>
        <div className="dashboard-recent">
          <RecentTrips trips={trips.slice(0, 5)} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
