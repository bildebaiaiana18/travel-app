"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useLanguage } from "../../context/LanguageContext"
import { useNotifications } from "../../context/NotificationContext"
import "./Auth.css"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  })

  const { register, loading } = useAuth()
  const { t } = useLanguage()
  const { addNotification } = useNotifications()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      addNotification({
        type: "error",
        title: t("auth.error"),
        message: t("auth.passwordMismatch"),
      })
      return
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      })

      addNotification({
        type: "success",
        title: t("auth.registerSuccess"),
        message: t("auth.welcomeMessage"),
      })

      navigate("/dashboard")
    } catch (error) {
      addNotification({
        type: "error",
        title: t("auth.registerError"),
        message: error.message,
      })
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{t("auth.register")}</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">{t("auth.name")}</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

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

          <div className="form-group">
            <label htmlFor="confirmPassword">{t("auth.confirmPassword")}</label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? t("common.loading") : t("auth.register")}
          </button>

          <div className="auth-links">
            <Link to="/login">{t("auth.hasAccount")}</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
