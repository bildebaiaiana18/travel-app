import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./store/store"
import { AuthProvider } from "./context/AuthContext"
import { ThemeProvider } from "./context/ThemeContext"
import { LanguageProvider } from "./context/LanguageContext"
import { NotificationProvider } from "./context/NotificationContext"
import Layout from "./components/Layout/Layout"
import Login from "./pages/Auth/Login"
import Register from "./pages/Auth/Register"
import Dashboard from "./pages/Dashboard/Dashboard"
import Trips from "./pages/Trips/Trips"
import CreateTrip from "./pages/Trips/CreateTrip"
import EditTrip from "./pages/Trips/EditTrip"
import Profile from "./pages/Profile/Profile"
import AdminPanel from "./pages/Admin/AdminPanel"
import ProtectedRoute from "./components/Auth/ProtectedRoute"
import "./App.css"

function App() {
  return (
    <Provider store={store}>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <Router>
                <div className="App">
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <Layout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<Navigate to="/dashboard" replace />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="trips" element={<Trips />} />
                      <Route path="trips/create" element={<CreateTrip />} />
                      <Route path="trips/edit/:id" element={<EditTrip />} />
                      <Route path="profile" element={<Profile />} />
                      <Route
                        path="admin"
                        element={
                          <ProtectedRoute requiredRole="admin">
                            <AdminPanel />
                          </ProtectedRoute>
                        }
                      />
                    </Route>
                  </Routes>
                </div>
              </Router>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </Provider>
  )
}

export default App
