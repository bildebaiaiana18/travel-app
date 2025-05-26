import { useNotifications } from "../../context/NotificationContext"
import NotificationItem from "./NotificationItem"
import "./NotificationList.css"

const NotificationList = () => {
  const { notifications } = useNotifications()

  if (notifications.length === 0) return null

  return (
    <div className="notification-list">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  )
}

export default NotificationList
