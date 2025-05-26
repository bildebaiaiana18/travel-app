"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLanguage } from "../../context/LanguageContext"
import { useNotifications } from "../../context/NotificationContext"
import { fetchUsers, updateUserRole, deleteUser } from "../../store/slices/usersSlice"
import { fetchTrips, updateTrip } from "../../store/slices/tripsSlice"
import "./AdminPanel.css"

const AdminPanel = () => {
  const dispatch = useDispatch()
  const { t } = useLanguage()
  const { addNotification } = useNotifications()
  const { items: users, loading: usersLoading } = useSelector((state) => state.users)
  const { items: trips, loading: tripsLoading } = useSelector((state) => state.trips)

  const [activeTab, setActiveTab] = useState("trips")

  useEffect(() => {
    dispatch(fetchUsers())
    dispatch(fetchTrips())
  }, [dispatch])

  const handleRoleChange = async (userId, newRole) => {
    try {
      await dispatch(updateUserRole({ id: userId, role: newRole })).unwrap()
      addNotification({
        type: "success",
        title: "Роль изменена",
      })
    } catch (error) {
      addNotification({
        type: "error",
        title: t("common.error"),
        message: error.message,
      })
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm(t("admin.confirmDelete"))) {
      try {
        await dispatch(deleteUser(userId)).unwrap()
        addNotification({
          type: "success",
          title: "Пользователь удален",
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

  const handleTripStatusChange = async (tripId, newStatus) => {
    try {
      await dispatch(updateTrip({ id: tripId, updates: { status: newStatus } })).unwrap()
      addNotification({
        type: "success",
        title: `Статус поездки изменен на "${t(`trips.status.${newStatus}`)}"`,
      })
    } catch (error) {
      addNotification({
        type: "error",
        title: t("common.error"),
        message: error.message,
      })
    }
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

  const getStatusActions = (trip) => {
    const actions = []

    if (trip.status === "pending") {
      actions.push(
        <button
          key="approve"
          onClick={() => handleTripStatusChange(trip.id, "approved")}
          className="btn btn-success btn-sm"
        >
          ✅ Одобрить
        </button>,
        <button
          key="reject"
          onClick={() => handleTripStatusChange(trip.id, "rejected")}
          className="btn btn-error btn-sm"
        >
          ❌ Отклонить
        </button>,
      )
    }

    if (trip.status === "approved") {
      // Проверяем, прошла ли дата окончания поездки
      const endDate = new Date(trip.endDate)
      const today = new Date()

      if (endDate < today) {
        actions.push(
          <button
            key="complete"
            onClick={() => handleTripStatusChange(trip.id, "completed")}
            className="btn btn-primary btn-sm"
          >
            🏁 Завершить
          </button>,
        )
      }
    }

    if (trip.status === "rejected" || trip.status === "completed") {
      actions.push(
        <button
          key="reopen"
          onClick={() => handleTripStatusChange(trip.id, "pending")}
          className="btn btn-outline btn-sm"
        >
          🔄 Вернуть в ожидание
        </button>,
      )
    }

    return actions
  }

  const pendingTrips = trips.filter((trip) => trip.status === "pending")
  const approvedTrips = trips.filter((trip) => trip.status === "approved")
  const completedTrips = trips.filter((trip) => trip.status === "completed")
  const rejectedTrips = trips.filter((trip) => trip.status === "rejected")

  return (
    <div className="admin-panel">
      <h1>{t("admin.title")}</h1>

      <div className="admin-tabs">
        <button className={`tab-button ${activeTab === "trips" ? "active" : ""}`} onClick={() => setActiveTab("trips")}>
          {t("admin.allTrips")} ({trips.length})
          {pendingTrips.length > 0 && <span className="notification-badge">{pendingTrips.length}</span>}
        </button>
        <button className={`tab-button ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
          {t("admin.users")} ({users.length})
        </button>
        <button className={`tab-button ${activeTab === "stats" ? "active" : ""}`} onClick={() => setActiveTab("stats")}>
          {t("admin.statistics")}
        </button>
      </div>

      <div className="admin-content">
        {activeTab === "trips" && (
          <div className="trips-section">
            {tripsLoading ? (
              <div className="loading">{t("common.loading")}</div>
            ) : (
              <div className="trips-management">
                {pendingTrips.length > 0 && (
                  <div className="trips-category">
                    <h3 className="category-title pending">🕐 Ожидают одобрения ({pendingTrips.length})</h3>
                    <div className="trips-grid">
                      {pendingTrips.map((trip) => (
                        <div key={trip.id} className="admin-trip-card priority">
                          <div className="trip-header">
                            <h4>{trip.destination}</h4>
                            <div className={`trip-status ${getStatusClass(trip.status)}`}>
                              {t(`trips.status.${trip.status}`)}
                            </div>
                          </div>
                          <div className="trip-details">
                            <p>
                              <strong>Цель:</strong> {trip.purpose}
                            </p>
                            <p>
                              <strong>Даты:</strong> {new Date(trip.startDate).toLocaleDateString()} -{" "}
                              {new Date(trip.endDate).toLocaleDateString()}
                            </p>
                            <p>
                              <strong>Бюджет:</strong> ${trip.budget}
                            </p>
                            <p>
                              <strong>Пользователь:</strong>{" "}
                              {users.find((u) => u.id === trip.userId)?.name || "Неизвестно"}
                            </p>
                          </div>
                          <div className="trip-actions">{getStatusActions(trip)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {approvedTrips.length > 0 && (
                  <div className="trips-category">
                    <h3 className="category-title approved">✅ Одобренные поездки ({approvedTrips.length})</h3>
                    <div className="trips-grid">
                      {approvedTrips.map((trip) => (
                        <div key={trip.id} className="admin-trip-card">
                          <div className="trip-header">
                            <h4>{trip.destination}</h4>
                            <div className={`trip-status ${getStatusClass(trip.status)}`}>
                              {t(`trips.status.${trip.status}`)}
                            </div>
                          </div>
                          <div className="trip-details">
                            <p>
                              <strong>Цель:</strong> {trip.purpose}
                            </p>
                            <p>
                              <strong>Даты:</strong> {new Date(trip.startDate).toLocaleDateString()} -{" "}
                              {new Date(trip.endDate).toLocaleDateString()}
                            </p>
                            <p>
                              <strong>Бюджет:</strong> ${trip.budget}
                            </p>
                            <p>
                              <strong>Пользователь:</strong>{" "}
                              {users.find((u) => u.id === trip.userId)?.name || "Неизвестно"}
                            </p>
                          </div>
                          <div className="trip-actions">{getStatusActions(trip)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {completedTrips.length > 0 && (
                  <div className="trips-category">
                    <h3 className="category-title completed">🏁 Завершенные поездки ({completedTrips.length})</h3>
                    <div className="trips-grid">
                      {completedTrips.slice(0, 6).map((trip) => (
                        <div key={trip.id} className="admin-trip-card">
                          <div className="trip-header">
                            <h4>{trip.destination}</h4>
                            <div className={`trip-status ${getStatusClass(trip.status)}`}>
                              {t(`trips.status.${trip.status}`)}
                            </div>
                          </div>
                          <div className="trip-details">
                            <p>
                              <strong>Цель:</strong> {trip.purpose}
                            </p>
                            <p>
                              <strong>Даты:</strong> {new Date(trip.startDate).toLocaleDateString()} -{" "}
                              {new Date(trip.endDate).toLocaleDateString()}
                            </p>
                            <p>
                              <strong>Бюджет:</strong> ${trip.budget}
                            </p>
                            <p>
                              <strong>Пользователь:</strong>{" "}
                              {users.find((u) => u.id === trip.userId)?.name || "Неизвестно"}
                            </p>
                          </div>
                          <div className="trip-actions">{getStatusActions(trip)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {rejectedTrips.length > 0 && (
                  <div className="trips-category">
                    <h3 className="category-title rejected">❌ Отклоненные поездки ({rejectedTrips.length})</h3>
                    <div className="trips-grid">
                      {rejectedTrips.slice(0, 3).map((trip) => (
                        <div key={trip.id} className="admin-trip-card">
                          <div className="trip-header">
                            <h4>{trip.destination}</h4>
                            <div className={`trip-status ${getStatusClass(trip.status)}`}>
                              {t(`trips.status.${trip.status}`)}
                            </div>
                          </div>
                          <div className="trip-details">
                            <p>
                              <strong>Цель:</strong> {trip.purpose}
                            </p>
                            <p>
                              <strong>Даты:</strong> {new Date(trip.startDate).toLocaleDateString()} -{" "}
                              {new Date(trip.endDate).toLocaleDateString()}
                            </p>
                            <p>
                              <strong>Бюджет:</strong> ${trip.budget}
                            </p>
                            <p>
                              <strong>Пользователь:</strong>{" "}
                              {users.find((u) => u.id === trip.userId)?.name || "Неизвестно"}
                            </p>
                          </div>
                          <div className="trip-actions">{getStatusActions(trip)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div className="users-section">
            {usersLoading ? (
              <div className="loading">{t("common.loading")}</div>
            ) : (
              <div className="users-table">
                <div className="table-header">
                  <div>Пользователь</div>
                  <div>Email</div>
                  <div>Роль</div>
                  <div>Действия</div>
                </div>
                {users.map((user) => (
                  <div key={user.id} className="table-row">
                    <div className="user-info">
                      <img
                        src={user.avatar || "/placeholder.svg?height=40&width=40"}
                        alt={user.name}
                        className="user-avatar-small"
                      />
                      <span>{user.name}</span>
                    </div>
                    <div>{user.email}</div>
                    <div>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="role-select"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <button onClick={() => handleDeleteUser(user.id)} className="btn btn-error btn-sm">
                        {t("common.delete")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "stats" && (
          <div className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Всего пользователей</h3>
                <div className="stat-value">{users.length}</div>
              </div>
              <div className="stat-card">
                <h3>Всего поездок</h3>
                <div className="stat-value">{trips.length}</div>
              </div>
              <div className="stat-card pending">
                <h3>Ожидают одобрения</h3>
                <div className="stat-value">{pendingTrips.length}</div>
              </div>
              <div className="stat-card approved">
                <h3>Одобренные</h3>
                <div className="stat-value">{approvedTrips.length}</div>
              </div>
              <div className="stat-card completed">
                <h3>Завершенные</h3>
                <div className="stat-value">{completedTrips.length}</div>
              </div>
              <div className="stat-card rejected">
                <h3>Отклоненные</h3>
                <div className="stat-value">{rejectedTrips.length}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
