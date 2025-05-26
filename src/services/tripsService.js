const API_URL = "http://localhost:3001";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
});

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Ошибка запроса");
  }
  return response.json();
};

const tripsService = {
  async getTrips(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = `${API_URL}/trips${queryParams ? `?${queryParams}` : ""}`;
      const response = await fetch(url, { headers: getAuthHeaders() });
      const data = await handleResponse(response);
      
      return {
        data,
        total: data.length,
      };
    } catch (error) {
      throw new Error(error.message || "Ошибка загрузки поездок");
    }
  },

  async getTripById(id) {
    try {
      const response = await fetch(`${API_URL}/trips/${id}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error(error.message || "Поездка не найдена");
    }
  },

async createTrip(tripData) {
  try {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    const response = await fetch(`${API_URL}/trips`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        ...tripData,
        id: String(Date.now()), // <-- теперь строка
        userId: String(currentUser.id), // <-- теперь строка
        createdAt: new Date().toISOString(),
        status: "pending",
      }),
    });

    return handleResponse(response);
  } catch (error) {
    throw new Error(error.message || "Ошибка создания поездки");
  }
},


  async updateTrip(id, updates) {
  try {
    const currentTrip = await this.getTripById(id);

    const response = await fetch(`${API_URL}/trips/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        ...currentTrip,
        ...updates,
        id: String(currentTrip.id), // на всякий случай
        userId: String(currentTrip.userId), // на всякий случай
        updatedAt: new Date().toISOString(),
      }),
    });

    return handleResponse(response);
  } catch (error) {
    throw new Error(error.message || "Ошибка обновления поездки");
  }
}
,

  async deleteTrip(id) {
    try {
      const response = await fetch(`${API_URL}/trips/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      await handleResponse(response);
      return { success: true };
    } catch (error) {
      throw new Error(error.message || "Ошибка удаления поездки");
    }
  },
};

export default tripsService;