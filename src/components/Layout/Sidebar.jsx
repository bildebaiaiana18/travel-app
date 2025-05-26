"use client"
import { NavLink } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useLanguage } from "../../context/LanguageContext"
import "./Sidebar.css"

const Sidebar = () => {
  const { user } = useAuth()
  const { t } = useLanguage()

  const menuItems = [
    { path: "/dashboard", label: t("menu.dashboard"), icon: "📊" },
    { path: "/trips", label: t("menu.trips"), icon: "✈️" },
    { path: "/profile", label: t("menu.profile"), icon: "👤" },
  ]

  if (user?.role === "admin") {
    menuItems.push({ path: "/admin", label: t("menu.admin"), icon: "⚙️" })
  }

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
