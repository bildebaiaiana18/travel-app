"use client"

import { useEffect, useState } from "react"
import { useNotifications } from "../../context/NotificationContext"
import "./NotificationItem.css"

const NotificationItem = ({ notification }) => {
  const { removeNotification } = useNotifications()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => removeNotification(notification.id), 300)
  }

  const getTypeClass = () => {
    switch (notification.type) {
      case "success":
        return "notification-success"
      case "error":
        return "notification-error"
      case "warning":
        return "notification-warning"
      default:
        return "notification-info"
    }
  }

  return (
    <div className={`notification-item ${getTypeClass()} ${isVisible ? "visible" : ""}`}>
      <div className="notification-content">
        <div className="notification-title">{notification.title}</div>
        {notification.message && <div className="notification-message">{notification.message}</div>}
      </div>
      <button onClick={handleClose} className="notification-close">
        ×
      </button>
    </div>
  )
}

export default NotificationItem
