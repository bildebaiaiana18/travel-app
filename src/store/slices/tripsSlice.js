import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import tripsService from "../../services/tripsService"

export const fetchTrips = createAsyncThunk("trips/fetchTrips", async (params) => {
  const response = await tripsService.getTrips(params)
  return response
})

export const createTrip = createAsyncThunk("trips/createTrip", async (tripData) => {
  const response = await tripsService.createTrip(tripData)
  return response
})

export const updateTrip = createAsyncThunk("trips/updateTrip", async ({ id, updates }) => {
  const response = await tripsService.updateTrip(id, updates)
  return response
})

export const deleteTrip = createAsyncThunk("trips/deleteTrip", async (id) => {
  await tripsService.deleteTrip(id)
  return id
})

const tripsSlice = createSlice({
  name: "trips",
  initialState: {
    items: [],
    loading: false,
    error: null,
    filters: {
      search: "",
      status: "",
      dateFrom: "",
      dateTo: "",
    },
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {
        search: "",
        status: "",
        dateFrom: "",
        dateTo: "",
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrips.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.data
        state.pagination.total = action.payload.total
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(createTrip.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(updateTrip.fulfilled, (state, action) => {
        const index = state.items.findIndex((trip) => trip.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(deleteTrip.fulfilled, (state, action) => {
        state.items = state.items.filter((trip) => trip.id !== action.payload)
      })
  },
})

export const { setFilters, setPagination, clearFilters } = tripsSlice.actions
export default tripsSlice.reducer
