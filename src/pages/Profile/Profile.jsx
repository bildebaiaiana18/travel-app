"use client"

import { useState, useRef } from "react"
import { useAuth } from "../../context/AuthContext"
import { useLanguage } from "../../context/LanguageContext"
import { useNotifications } from "../../context/NotificationContext"
import "./Profile.css"

const Profile = () => {
  const { user, updateProfile, updatePassword } = useAuth()
  const { t } = useLanguage()
  const { addNotification } = useNotifications()
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [loading, setLoading] = useState({
    profile: false,
    password: false,
    avatar: false,
  })

  const validatePassword = (password) => {
    // Минимум 8 символов, хотя бы одна цифра и одна буква
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    return re.test(password)
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoading({ ...loading, profile: true })

    try {
      await updateProfile(formData)
      addNotification({
        type: "success",
        title: t("profile.updated"),
      })
    } catch (error) {
      addNotification({
        type: "error",
        title: t("common.error"),
        message: error.message,
      })
    } finally {
      setLoading({ ...loading, profile: false })
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addNotification({
        type: "error",
        title: t("auth.error"),
        message: t("auth.passwordMismatch"),
      })
      return
    }

    setLoading({ ...loading, password: true })

    try {
      await updatePassword(passwordData.currentPassword, passwordData.newPassword)

      addNotification({
        type: "success",
        title: t("profile.passwordUpdated"),
        message: t("profile.passwordUpdatedMessage"),
      })

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      addNotification({
        type: "error",
        title: t("common.error"),
        message: error.message,
      })
    } finally {
      setLoading({ ...loading, password: false })
    }
  }

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0]

    if (!file) return

    // Проверяем тип файла
    if (!file.type.startsWith("image/")) {
      addNotification({
        type: "error",
        title: t("common.error"),
        message: "Пожалуйста, выберите изображение",
      })
      return
    }

    // Проверяем размер файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      addNotification({
        type: "error",
        title: t("common.error"),
        message: "Размер файла не должен превышать 5MB",
      })
      return
    }

    setLoading({ ...loading, avatar: true })

    try {
      // Конвертируем файл в base64
      const reader = new FileReader()

      reader.onload = async (e) => {
        try {
          const avatarData = e.target.result

          // Обновляем профиль с новой аватаркой
          await updateProfile({ avatar: avatarData })

          addNotification({
            type: "success",
            title: "Успешно",
            message: "Аватар успешно обновлён",
          })
        } catch (error) {
          console.error("Ошибка при обновлении аватара:", error)
          addNotification({
            type: "error",
            title: t("common.error"),
            message: error.message || "Ошибка при обновлении аватара",
          })
        } finally {
          setLoading({ ...loading, avatar: false })
        }
      }

      reader.onerror = () => {
        addNotification({
          type: "error",
          title: t("common.error"),
          message: "Ошибка при чтении файла",
        })
        setLoading({ ...loading, avatar: false })
      }

      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Ошибка при обработке файла:", error)
      addNotification({
        type: "error",
        title: t("common.error"),
        message: "Ошибка при обработке файла",
      })
      setLoading({ ...loading, avatar: false })
    }
  }

  return (
    <div className="profile-page">
      <h1>{t("profile.title")}</h1>

      <div className="profile-content">
        <div className="profile-avatar-section">
          <div className="avatar-container">
            <img
              src={user?.avatar || "/placeholder.svg?height=120&width=120"}
              alt={user?.name}
              className="profile-avatar"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="avatar-upload-btn"
              aria-label="Change avatar"
              disabled={loading.avatar}
            >
              {loading.avatar ? "⏳" : "📷"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
            />
          </div>
          <div className="user-info">
            <h2>{user?.name}</h2>
            <p className="user-role">
              {t("profile.role")}: {user?.role}
            </p>
          </div>
        </div>

        <div className="profile-forms">
          <div className="profile-form-section">
            <h3>{t("profile.editProfile")}</h3>
            <form onSubmit={handleProfileSubmit} className="profile-form">
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
                  disabled
                />
              </div>

              <button type="submit" disabled={loading.profile} className="btn btn-primary">
                {loading.profile ? t("common.loading") : t("common.save")}
              </button>
            </form>
          </div>

          <div className="profile-form-section">
            <h3>{t("profile.changePassword")}</h3>
            <form onSubmit={handlePasswordSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="currentPassword">{t("profile.currentPassword")}</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">{t("profile.newPassword")}</label>
                <input
                  type="password"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                />
                {passwordData.newPassword && (
                  <div className="password-strength">
                    <div
                      className={`strength-bar ${
                        passwordData.newPassword.length > 11
                          ? "strong"
                          : passwordData.newPassword.length > 7
                            ? "medium"
                            : "weak"
                      }`}
                    />
                    <span className="strength-text">
                      {passwordData.newPassword.length > 11
                        ? "Сильный пароль"
                        : passwordData.newPassword.length > 7
                          ? "Средний пароль"
                          : "Слишком короткий пароль"}
                    </span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">{t("auth.confirmPassword")}</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <button type="submit" disabled={loading.password} className="btn btn-primary">
                {loading.password ? t("common.loading") : t("common.saveChanges")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
