import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { authService } from '../../services/auth/authService'
import type { AuthState, AuthUser, LoginRequest, LoginResponse } from '../../types/auth/authTypes'

function readStoredUser() {
  const rawUser = localStorage.getItem('user')

  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser) as AuthUser
  } catch {
    localStorage.removeItem('user')
    return null
  }
}

function persistAuth(loginResponse: LoginResponse) {
  localStorage.setItem('accessToken', loginResponse.accessToken)
  localStorage.setItem('user', JSON.stringify(loginResponse.user))
}

function clearStoredAuth() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('user')
}

function toErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

const storedToken = localStorage.getItem('accessToken')
const storedUser = readStoredUser()

const initialState: AuthState = {
  accessToken: storedToken,
  user: storedUser,
  loading: false,
  error: null,
  isAuthenticated: Boolean(storedToken),
}

export const loginThunk = createAsyncThunk<LoginResponse, LoginRequest, { rejectValue: string }>(
  'auth/login',
  async (request, { rejectWithValue }) => {
    try {
      const response = await authService.login(request)
      persistAuth(response)
      return response
    } catch (error) {
      return rejectWithValue(toErrorMessage(error, 'Unable to login'))
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      clearStoredAuth()
      state.accessToken = null
      state.user = null
      state.loading = false
      state.error = null
      state.isAuthenticated = false
    },
    setUser(state, action: { payload: AuthUser }) {
      localStorage.setItem('user', JSON.stringify(action.payload))
      state.user = action.payload
    },
    clearAuth(state) {
      clearStoredAuth()
      state.accessToken = null
      state.user = null
      state.loading = false
      state.error = null
      state.isAuthenticated = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false
        state.accessToken = action.payload.accessToken
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Unable to login'
        state.isAuthenticated = false
      })
  },
})

export const { clearAuth, logout, setUser } = authSlice.actions
export const authReducer = authSlice.reducer
