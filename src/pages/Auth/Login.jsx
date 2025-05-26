"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useLanguage } from "../../context/LanguageContext"
import { useNotifications } from "../../context/NotificationContext"
import "./Auth.css"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [resetEmail, setResetEmail] = useState("")
  const [showReset, setShowReset] = useState(false)

  const { login, loading } = useAuth()
  const { t } = useLanguage()
  const { addNotification } = useNotifications()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(formData.email, formData.password)
      addNotification({
        type: "success",
        title: t("auth.loginSuccess"),
        message: t("auth.welcomeBack"),
      })
      navigate("/dashboard")
    } catch (error) {
      addNotification({
        type: "error",
        title: t("auth.loginError"),
        message: error.message,
      })
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    // Имитация сброса пароля
    addNotification({
      type: "success",
      title: t("auth.resetSent"),
      message: t("auth.resetMessage"),
    })
    setShowReset(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{t("auth.login")}</h2>

        {!showReset ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">{t("auth.email")}</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">{t("auth.password")}</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="auth-button">
              {loading ? t("common.loading") : t("auth.login")}
            </button>

            <div className="auth-links">
              <button type="button" onClick={() => setShowReset(true)} className="link-button">
                {t("auth.forgotPassword")}
              </button>
              <Link to="/register">{t("auth.noAccount")}</Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="auth-form">
            <div className="form-group">
              <label htmlFor="resetEmail">{t("auth.email")}</label>
              <input
                type="email"
                id="resetEmail"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-button">
              {t("auth.sendReset")}
            </button>

            <button type="button" onClick={() => setShowReset(false)} className="link-button">
              {t("common.back")}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Login
