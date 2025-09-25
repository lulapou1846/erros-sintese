// src/hooks/useAuth.ts
import { useState, useEffect } from 'react'

type SignInCredentials = {
  email: string
  password: string
}

type RegisterCredentials = {
  username: string
  email: string
  password: string
  client_name: string
  client_email: string
}

type User = {
  id: string
  username: string
  email: string
  profile_picture?: string
  created_at: string
  is_active: boolean
  client_id: string
}

type Client = {
  id: string
  name: string
  email: string
  database_name: string
  created_at: string
  is_active: boolean
}

const API_BASE_URL = '/api'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setClient(data.client)
        setIsAuthenticated(true)
      } else {
        localStorage.removeItem('access_token')
        setIsAuthenticated(false)
        setUser(null)
        setClient(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('access_token')
      setIsAuthenticated(false)
      setUser(null)
      setClient(null)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async ({ email, password }: SignInCredentials) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('access_token', data.access_token)
        setUser(data.user)
        setClient(data.client)
        setIsAuthenticated(true)
        return data
      } else {
        throw new Error(data.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async ({ username, email, password, client_name, client_email }: RegisterCredentials) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password, client_name, client_email })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('access_token', data.access_token)
        setUser(data.user)
        setClient(data.client)
        setIsAuthenticated(true)
        return data
      } else {
        throw new Error(data.error || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      }
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      localStorage.removeItem('access_token')
      setIsAuthenticated(false)
      setUser(null)
      setClient(null)
      setLoading(false)
    }
  }

  const updateProfile = async (profileData: Partial<User>) => {
    const token = localStorage.getItem('access_token')
    if (!token) throw new Error('No token found')

    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        return data
      } else {
        throw new Error(data.error || 'Profile update failed')
      }
    } catch (error) {
      console.error('Profile update failed:', error)
      throw error
    }
  }

  const uploadProfilePicture = async (file: File) => {
    const token = localStorage.getItem('access_token')
    if (!token) throw new Error('No token found')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${API_BASE_URL}/profile/upload-picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        return data
      } else {
        throw new Error(data.error || 'Picture upload failed')
      }
    } catch (error) {
      console.error('Picture upload failed:', error)
      throw error
    }
  }

  return {
    user,
    client,
    isAuthenticated,
    loading,
    signIn,
    register,
    signOut,
    updateProfile,
    uploadProfilePicture,
    checkAuthStatus
  }
}

