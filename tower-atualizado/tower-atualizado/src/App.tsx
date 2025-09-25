import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { useAuth } from "./hooks/useAuth"

import { CategoriasProvider } from "./components/CategoriasContext";

function Root() {
  return (
    <CategoriasProvider>
      <App /> {/* seu Router / Dashboard */}
    </CategoriasProvider>
  );
}

import LoginPage from "./components/LoginPage"
import RegisterPage from "./components/RegisterPage"
import Sidebar from "./components/Sidebar"
import Dashboard from "./components/Dashboard"

function App() {
  const { isAuthenticated, loading } = useAuth()
  const [activeSection, setActiveSection] = useState("dashboard")

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <CategoriasProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#374151",
            color: "#fff",
            border: "1px solid #4B5563",
          },
          success: {
            style: {
              background: "#059669",
              color: "#fff",
            },
          },
          error: {
            style: {
              background: "#DC2626",
              color: "#fff",
            },
          },
        }}
      />

      <Router>
        <div className="min-h-screen bg-gray-900">
          <Routes>
            <Route
              path="/login"
              element={
                !isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />
              }
            />
            <Route
              path="/register"
              element={
                !isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" replace />
              }
            />
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? (
                  <div className="flex">
                    <Sidebar
                      activeSection={activeSection}
                      onSectionChange={setActiveSection}
                    />
                    <Dashboard activeSection={activeSection} />
                  </div>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/"
              element={
                <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
              }
            />
          </Routes>
        </div>
      </Router>
    </CategoriasProvider>
  )
}

export default App
