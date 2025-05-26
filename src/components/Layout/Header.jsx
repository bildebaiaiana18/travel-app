"use client"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
import { useLanguage } from "../../context/LanguageContext"
import "./Header.css"

const Header = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { language, changeLanguage, t } = useLanguage()

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">{t("app.title")}</h1>
        </div>

        <div className="header-right">
          <div className="header-controls">
            <button onClick={toggleTheme} className="theme-toggle" title={t("common.toggleTheme")}>
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            <select value={language} onChange={(e) => changeLanguage(e.target.value)} className="language-selector">
              <option value="ru">РУ</option>
              <option value="en">EN</option>
            </select>
          </div>

          <div className="user-menu">
            <div className="user-info">
              <img
                src={user?.avatar || "/placeholder.svg?height=32&width=32"}
                alt={user?.name}
                className="user-avatar"
              />
              <span className="user-name">{user?.name}</span>
            </div>
            <button onClick={logout} className="logout-btn">
              {t("auth.logout")}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
