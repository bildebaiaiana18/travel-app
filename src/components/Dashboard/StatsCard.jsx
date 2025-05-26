import "./StatsCard.css"

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className={`stats-card stats-card-${color}`}>
      <div className="stats-card-icon">{icon}</div>
      <div className="stats-card-content">
        <div className="stats-card-value">{value}</div>
        <div className="stats-card-title">{title}</div>
      </div>
    </div>
  )
}

export default StatsCard
