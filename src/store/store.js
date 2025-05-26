import { configureStore } from "@reduxjs/toolkit"
import tripsReducer from "./slices/tripsSlice"
import usersReducer from "./slices/usersSlice"

export const store = configureStore({
  reducer: {
    trips: tripsReducer,
    users: usersReducer,
  },
})
