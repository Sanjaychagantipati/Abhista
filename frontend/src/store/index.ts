import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from './auth/authSlice'
import { customerProfileReducer } from './customer/customerProfileSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customerProfile: customerProfileReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
