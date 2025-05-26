const API_URL = "http://localhost:3001"

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
})

const usersService = {
  async getUsers() {
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Ошибка загрузки пользователей")
      }

      return response.json()
    } catch (error) {
      throw new Error(error.message || "Ошибка загрузки пользователей")
    }
  },

  async updateUserRole(id, role) {
    try {
      // Сначала получаем текущие данные пользователя
      const userResponse = await fetch(`${API_URL}/users/${id}`)
      if (!userResponse.ok) {
        throw new Error("Пользователь не найден")
      }

      const currentUser = await userResponse.json()

      // Обновляем только роль
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...currentUser,
          role: role,
        }),
      })

      if (!response.ok) {
        throw new Error("Ошибка обновления роли")
      }

      return response.json()
    } catch (error) {
      throw new Error(error.message || "Ошибка обновления роли")
    }
  },

  async deleteUser(id) {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Ошибка удаления пользователя")
      }

      return { success: true }
    } catch (error) {
      throw new Error(error.message || "Ошибка удаления пользователя")
    }
  },

  async updateUserProfile(id, profileData) {
    try {
      // Получаем текущие данные пользователя
      const userResponse = await fetch(`${API_URL}/users/${id}`)
      if (!userResponse.ok) {
        throw new Error("Пользователь не найден")
      }

      const currentUser = await userResponse.json()

      // Обновляем профиль пользователя
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...currentUser,
          ...profileData,
          updatedAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("Ошибка обновления профиля")
      }

      return response.json()
    } catch (error) {
      throw new Error(error.message || "Ошибка обновления профиля")
    }
  },
}

export default usersService
