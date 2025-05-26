"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useLanguage } from "../../context/LanguageContext"
import { useNotifications } from "../../context/NotificationContext"
import { createTrip } from "../../store/slices/tripsSlice"
import "./TripForm.css"

const CreateTrip = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useLanguage()
  const { addNotification } = useNotifications()

  const [formData, setFormData] = useState({
    destination: "",
    purpose: "",
    startDate: "",
    endDate: "",
    budget: "",
    description: "",
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await dispatch(createTrip(formData)).unwrap()
      addNotification({
        type: "success",
        title: t("trips.created"),
      })
      navigate("/trips")
    } catch (error) {
      addNotification({
        type: "error",
        title: t("common.error"),
        message: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="trip-form-page">
      <div className="trip-form-header">
        <h1>{t("trips.createNew")}</h1>
        <button onClick={() => navigate("/trips")} className="btn btn-outline">
          {t("common.back")}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="trip-form">
        <div className="form-group">
          <label htmlFor="destination">{t("trips.destination")}</label>
          <input
            type="text"
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="purpose">{t("trips.purpose")}</label>
          <input type="text" id="purpose" name="purpose" value={formData.purpose} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">{t("trips.startDate")}</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">{t("trips.endDate")}</label>
            <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="budget">{t("trips.budget")}</label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Описание</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="4" />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate("/trips")} className="btn btn-outline">
            {t("common.cancel")}
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? t("common.loading") : t("common.save")}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateTrip
