import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import Dashboard from '@/pages/Dashboard'
import Profile from '@/pages/Profile'
import FoodTracker from '@/pages/FoodTracker'
import WorkoutTracker from '@/pages/WorkoutTracker'
import Analytics from '@/pages/Analytics'
import ChatBot from '@/pages/ChatBot'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import NotFound from '@/pages/NotFound'
import '@/index.css'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/food-tracker"
              element={
                <ProtectedRoute>
                  <FoodTracker />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workout-tracker"
              element={
                <ProtectedRoute>
                  <WorkoutTracker />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatBot />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
