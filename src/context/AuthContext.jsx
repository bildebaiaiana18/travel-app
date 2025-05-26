"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import authService from "../services/authService"

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null }
    case "LOGIN_SUCCESS":
      return { ...state, loading: false, user: action.payload, isAuthenticated: true }
    case "LOGIN_FAILURE":
      return { ...state, loading: false, error: action.payload, isAuthenticated: false }
    case "LOGOUT":
      return { ...state, user: null, isAuthenticated: false }
 case "UPDATE_PROFILE":
  return { ...state, user: { ...state.user, ...action.payload } }

    case "UPDATE_PASSWORD_START":
      return { ...state, loading: true, error: null }
    case "UPDATE_PASSWORD_SUCCESS":
      return { ...state, loading: false }
    case "UPDATE_PASSWORD_FAILURE":
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  })

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      try {
        const user = JSON.parse(userData)
        dispatch({ type: "LOGIN_SUCCESS", payload: user })
      } catch (error) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }
  }, [])

  const login = async (email, password) => {
    dispatch({ type: "LOGIN_START" })
    try {
      const response = await authService.login(email, password)
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
      dispatch({ type: "LOGIN_SUCCESS", payload: response.user })
      return response
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: error.message })
      throw error
    }
  }

  const register = async (userData) => {
    dispatch({ type: "LOGIN_START" })
    try {
      const response = await authService.register(userData)
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
      dispatch({ type: "LOGIN_SUCCESS", payload: response.user })
      return response
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: error.message })
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    dispatch({ type: "LOGOUT" })
  }

const updateProfile = async (updates) => {
  try {
    // Вызываем API для обновления данных на сервере
    const response = await authService.updateProfile(state.user.id, updates)
    const updatedUser = response.user

    // Сохраняем обновлённые данные в localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser))

    // Обновляем состояние в контексте
    dispatch({ type: "UPDATE_PROFILE", payload: updatedUser })

    return updatedUser
  } catch (error) {
    console.error("Ошибка при обновлении профиля:", error)
    throw error
  }
}


  const updatePassword = async (currentPassword, newPassword) => {
    dispatch({ type: "UPDATE_PASSWORD_START" })
    try {
      // Call your authService to update password
      const response = await authService.updatePassword(
        state.user.id,
        currentPassword,
        newPassword
      )
      
      // Update the token if it was changed
      if (response.token) {
        localStorage.setItem("token", response.token)
      }
      
      dispatch({ type: "UPDATE_PASSWORD_SUCCESS" })
      return response
    } catch (error) {
      dispatch({ type: "UPDATE_PASSWORD_FAILURE", payload: error.message })
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateProfile,
        updatePassword, // Add the new function to context
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}