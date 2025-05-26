"use client"

import { useEffect, useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useLanguage } from "../../context/LanguageContext"
import { useNotifications } from "../../context/NotificationContext"
import { fetchTrips, deleteTrip } from "../../store/slices/tripsSlice"
import "./Trips.css"

const Trips = () => {
  const dispatch = useDispatch()
  const { user } = useAuth()
  const { t } = useLanguage()
  const { addNotification } = useNotifications()
  const { items: trips, loading, filters } = useSelector((state) => state.trips)

  const [localFilters, setLocalFilters] = useState({
    search: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  })

  useEffect(() => {
    dispatch(fetchTrips())
  }, [dispatch])

  const filteredTrips = useMemo(() => {
    let result = user?.role === "admin" ? trips : trips.filter((trip) => trip.userId === user?.id)

    if (localFilters.search) {
      result = result.filter(
        (trip) =>
          trip.destination.toLowerCase().includes(localFilters.search.toLowerCase()) ||
          trip.purpose.toLowerCase().includes(localFilters.search.toLowerCase()),
      )
    }

    if (localFilters.status) {
      result = result.filter((trip) => trip.status === localFilters.status)
    }

    if (localFilters.dateFrom) {
      result = result.filter((trip) => new Date(trip.startDate) >= new Date(localFilters.dateFrom))
    }

    if (localFilters.dateTo) {
      result = result.filter((trip) => new Date(trip.endDate) <= new Date(localFilters.dateTo))
    }

    return result
  }, [trips, localFilters, user])

  const handleDelete = async (id) => {
    if (window.confirm(t("trips.confirmDelete"))) {
      try {
        await dispatch(deleteTrip(id)).unwrap()
        addNotification({
          type: "success",
          title: t("trips.deleted"),
        })
      } catch (error) {
        addNotification({
          type: "error",
          title: t("common.error"),
          message: error.message,
        })
      }
    }
  }

  const handleFilterChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setLocalFilters({
      search: "",
      status: "",
      dateFrom: "",
      dateTo: "",
    })
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "approved":
        return "status-approved"
      case "pending":
        return "status-pending"
      case "completed":
        return "status-completed"
      case "rejected":
        return "status-rejected"
      default:
        return "status-pending"
    }
  }

  if (loading) {
    return <div className="loading">{t("common.loading")}</div>
  }

  return (
    <div className="trips-page">
      <div className="trips-header">
        <h1>{t("trips.title")}</h1>
        <Link to="/trips/create" className="btn btn-primary">
          {t("trips.createNew")}
        </Link>
      </div>

      <div className="trips-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder={t("trips.searchPlaceholder")}
            value={localFilters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={localFilters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="status-filter"
          >
            <option value="">{t("trips.allStatuses")}</option>
            <option value="pending">{t("trips.status.pending")}</option>
            <option value="approved">{t("trips.status.approved")}</option>
            <option value="completed">{t("trips.status.completed")}</option>
            <option value="rejected">{t("trips.status.rejected")}</option>
          </select>
        </div>

        <div className="filter-group">
          <input
            type="date"
            value={localFilters.dateFrom}
            onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
            className="date-filter"
          />
        </div>

        <div className="filter-group">
          <input
            type="date"
            value={localFilters.dateTo}
            onChange={(e) => handleFilterChange("dateTo", e.target.value)}
            className="date-filter"
          />
        </div>

        <button onClick={handleClearFilters} className="btn btn-outline">
          {t("common.reset")}
        </button>
      </div>

      <div className="trips-list">
        {filteredTrips.length === 0 ? (
          <div className="no-trips">
            <p>{t("trips.noTrips")}</p>
            <Link to="/trips/create" className="btn btn-primary">
              {t("trips.createFirst")}
            </Link>
          </div>
        ) : (
          filteredTrips.map((trip) => (
            <div key={trip.id} className="trip-card">
              <div className="trip-info">
                <h3 className="trip-destination">{trip.destination}</h3>
                <p className="trip-purpose">{trip.purpose}</p>
                <div className="trip-dates">
                  {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                </div>
                <div className="trip-budget">
                  {t("trips.budget")}: ${trip.budget}
                </div>
              </div>

              <div className="trip-actions">
                <div className={`trip-status ${getStatusClass(trip.status)}`}>{t(`trips.status.${trip.status}`)}</div>
                <div className="action-buttons">
                  <Link to={`/trips/edit/${trip.id}`} className="btn btn-outline">
                    {t("common.edit")}
                  </Link>
                  <button onClick={() => handleDelete(trip.id)} className="btn btn-error">
                    {t("common.delete")}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Trips
