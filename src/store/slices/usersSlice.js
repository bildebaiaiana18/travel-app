import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import usersService from "../../services/usersService"

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await usersService.getUsers()
  return response
})

export const updateUserRole = createAsyncThunk("users/updateUserRole", async ({ id, role }) => {
  const response = await usersService.updateUserRole(id, role)
  return response
})

export const deleteUser = createAsyncThunk("users/deleteUser", async (id) => {
  await usersService.deleteUser(id)
  return id
})

const usersSlice = createSlice({
  name: "users",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const index = state.items.findIndex((user) => user.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.items = state.items.filter((user) => user.id !== action.payload)
      })
  },
})

export default usersSlice.reducer
