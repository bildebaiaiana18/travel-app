const API_URL = "http://localhost:3001"

const authService = {
  async login(email, password) {
    try {
      // Получаем всех пользователей
      const response = await fetch(`${API_URL}/users`)

      if (!response.ok) {
        throw new Error("Ошибка сервера")
      }

      const users = await response.json()

      // Ищем пользователя с указанными данными
      const user = users.find((u) => u.email === email && u.password === password)

      if (user) {
        const { password: _, ...userWithoutPassword } = user
        return {
          token: `fake-jwt-token-${user.id}`,
          user: userWithoutPassword,
        }
      } else {
        throw new Error("Неверные учетные данные")
      }
    } catch (error) {
      throw new Error(error.message || "Ошибка входа")
    }
  },

  async register(userData) {
    try {
      // Сначала проверяем, существует ли пользователь
      const usersResponse = await fetch(`${API_URL}/users`)
      const users = await usersResponse.json()

      const existingUser = users.find((u) => u.email === userData.email)
      if (existingUser) {
        throw new Error("Пользователь с таким email уже существует")
      }

      // Создаем нового пользователя с id в виде строки
      const newUser = {
        id: String(Date.now()), // id теперь строка
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || "user",
        avatar: "/placeholder.svg?height=120&width=120",
        createdAt: new Date().toISOString(),
      }

      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      })

      if (!response.ok) {
        throw new Error("Ошибка создания пользователя")
      }

      const createdUser = await response.json()
      const { password: _, ...userWithoutPassword } = createdUser

      return {
        token: `fake-jwt-token-${createdUser.id}`,
        user: userWithoutPassword,
      }
    } catch (error) {
      throw new Error(error.message || "Ошибка регистрации")
    }
  },

  async updatePassword(userId, currentPassword, newPassword) {
    try {
      // Сначала получаем текущего пользователя для проверки пароля
      const userResponse = await fetch(`${API_URL}/users/${userId}`)

      if (!userResponse.ok) {
        throw new Error("Пользователь не найден")
      }

      const user = await userResponse.json()

      // Проверяем текущий пароль
      if (user.password !== currentPassword) {
        throw new Error("Неверный текущий пароль")
      }

      // Обновляем пароль
      const updatedUser = {
        ...user,
        password: newPassword,
        updatedAt: new Date().toISOString(),
      }

      const updateResponse = await fetch(`${API_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      })

      if (!updateResponse.ok) {
        throw new Error("Ошибка обновления пароля")
      }

      const updatedUserData = await updateResponse.json()

      return {
        message: "Пароль успешно обновлен",
        token: `fake-jwt-token-${updatedUserData.id}`, // Возвращаем новый токен
      }
    } catch (error) {
      console.error("Password update error:", error)
      throw new Error(error.message || "Ошибка обновления пароля")
    }
  },

  async updateProfile(userId, profileData) {
    try {
      // Получаем текущие данные пользователя
      const userResponse = await fetch(`${API_URL}/users/${userId}`)

      if (!userResponse.ok) {
        throw new Error("Пользователь не найден")
      }

      const currentUser = await userResponse.json()

      // Обновляем профиль пользователя
      const updatedUser = {
        ...currentUser,
        ...profileData,
        updatedAt: new Date().toISOString(),
      }

      const updateResponse = await fetch(`${API_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      })

      if (!updateResponse.ok) {
        throw new Error("Ошибка обновления профиля")
      }

      const updatedUserData = await updateResponse.json()
      const { password: _, ...userWithoutPassword } = updatedUserData

      return {
        message: "Профиль успешно обновлен",
        user: userWithoutPassword,
      }
    } catch (error) {
      console.error("Profile update error:", error)
      throw new Error(error.message || "Ошибка обновления профиля")
    }
  },

  async resetPassword(email) {
    // Имитация сброса пароля
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: "Письмо для сброса пароля отправлено" })
      }, 1000)
    })
  },
}

export default authService
