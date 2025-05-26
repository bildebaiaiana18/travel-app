import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useLanguage } from "../../context/LanguageContext"
import "./RecentTrips.css"
import { FaCommentDots, FaHeart} from "react-icons/fa"

const RecentTrips = ({ trips = [] }) => {
 const { t } = useLanguage()
  const [comments, setComments] = useState([])
  const [users, setUsers] = useState([])
  const [tripLikes, setTripLikes] = useState([])
  const [showComments, setShowComments] = useState({})
  const [newComment, setNewComment] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  let currentUser = null
  try {
    currentUser = JSON.parse(localStorage.getItem("user"))
  } catch (e) {
    console.error("Ошибка чтения пользователя", e)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [commentsRes, usersRes, likesRes] = await Promise.all([
          fetch("http://localhost:3001/comments"),
          fetch("http://localhost:3001/users"),
          fetch("http://localhost:3001/tripLikes")
        ])

        if (!commentsRes.ok || !usersRes.ok || !likesRes.ok)
          throw new Error("Ошибка загрузки данных")

        const [commentsData, usersData, tripLikesData] = await Promise.all([
          commentsRes.json(),
          usersRes.json(),
          likesRes.json()
        ])

        setComments(commentsData)
        setUsers(usersData)
        setTripLikes(tripLikesData)
      } catch (err) {
        setError(err.message)
        console.error("Ошибка при загрузке:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getStatusClass = (status) => {
    switch (status) {
      case "approved": return "status-approved"
      case "pending": return "status-pending"
      case "completed": return "status-completed"
      case "rejected": return "status-rejected"
      default: return "status-pending"
    }
  }

  const toggleComments = (tripId) => {
    setShowComments(prev => ({ ...prev, [tripId]: !prev[tripId] }))
  }

  const handleCommentChange = (tripId, value) => {
    setNewComment(prev => ({ ...prev, [tripId]: value }))
  }

  const handleAddComment = async (tripId) => {
    if (!currentUser?.id) return alert("Войдите в систему")

    const text = newComment[tripId]?.trim()
    if (!text) return

    const commentData = {
      tripId,
      userId: currentUser.id,
      text,
      createdAt: new Date().toISOString()
    }

    try {
      const res = await fetch("http://localhost:3001/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentData)
      })

      const newEntry = await res.json()
      setComments(prev => [...prev, newEntry])
      setNewComment(prev => ({ ...prev, [tripId]: "" }))
    } catch (err) {
      console.error("Ошибка при добавлении комментария:", err)
    }
  }

  const getTripLikesCount = (tripId) =>
    tripLikes.filter(like => like.tripId === tripId).length

  const hasUserLikedTrip = (tripId) =>
    tripLikes.some(like => like.tripId === tripId && like.userId === currentUser?.id)

  const toggleTripLike = async (tripId) => {
    if (!currentUser?.id) return alert("Войдите в систему")

    const existing = tripLikes.find(
      l => l.tripId === tripId && l.userId === currentUser.id
    )

    if (existing) {
      await fetch(`http://localhost:3001/tripLikes/${existing.id}`, {
        method: "DELETE"
      })
      setTripLikes(prev => prev.filter(l => l.id !== existing.id))
    } else {
      const res = await fetch("http://localhost:3001/tripLikes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId, userId: currentUser.id })
      })
      const newLike = await res.json()
      setTripLikes(prev => [...prev, newLike])
    }
  }
    const getUserName = (userId) => {
    const user = users.find(u => u.id === userId)
    return user ? user.name : "Анонимный пользователь"
  }


  if (loading) return <div>Загрузка...</div>
  if (error) return <div>Ошибка: {error}</div>

  return (
    <div className="recent-trips">
      <div className="recent-trips-list">
        {trips.length === 0 ? (
          <div className="no-trips">
            <p>{t("trips.noTrips")}</p>
            <Link to="/trips/create" className="btn btn-primary">
              {t("trips.createFirst")}
            </Link>
          </div>
        ) : (
          trips.map((trip) => (
            <div key={trip.id} className="recent-trip-item">
              <div className="trip-info">
                <h4 className="trip-title">{trip.destination}</h4>
                <p className="trip-dates">
                  {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                </p>
              </div>

              <div className="trip-status-area">
                <div className={`trip-status ${getStatusClass(trip.status)}`}>
                  {t(`trips.status.${trip.status}`)}
                </div>
                <div style={{ display: "flex", alignItems: "center",  justifyContent: "space-around",marginTop: "15px"  }}>
                <button 
                  className="comment-icon" 
                  style={{ background: "none", border: "none", cursor: "pointer"}}  
                  onClick={() => toggleComments(trip.id)}
                  aria-label="Показать/скрыть комментарии"
                >
                  <FaCommentDots />
                </button>
                  <button
                    className={`like-button ${hasUserLikedTrip(trip.id) ? "liked" : ""}`}
                    onClick={() => toggleTripLike(trip.id)}
                  >
                    <FaHeart />
                    <span>{getTripLikesCount(trip.id)}</span>
                  </button>
                  </div>
              </div>

              <div style={{ marginTop: "10px" }}></div>

              {showComments[trip.id] && (
                <div className="comments-section">
                  <div className="comments-list">
                    {comments
                      .filter(c => c.tripId === trip.id)
                      .map(c => (
                        <div key={c.id} className="comment">
                          <strong>{getUserName(c.userId)}</strong>
                          <p>{c.text}</p>
                        </div>
                      ))}
                    {comments.filter(c => c.tripId === trip.id).length === 0 && (
                      <p className="no-comments">Нет комментариев</p>
                    )}
                  </div>
                  <div className="add-comment">
                    <input
                      type="text"
                      value={newComment[trip.id] || ""}
                      onChange={e => handleCommentChange(trip.id, e.target.value)}
                      placeholder={currentUser ? "Оставить комментарий..." : "Войдите, чтобы комментировать"}
                      disabled={!currentUser}
                    />
                    <button 
                      onClick={() => handleAddComment(trip.id)}
                      disabled={!currentUser || !newComment[trip.id]?.trim()}
                    >
                      Отправить
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default RecentTrips
