import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from './auth/authSlice'
import { customerProfileReducer } from './customer/customerProfileSlice'
import { customerRequirementReducer } from './customer/customerRequirementSlice'
import { contractorProfileReducer } from './contractor/contractorProfileSlice'
import { portfolioReducer } from './contractor/portfolioSlice'
import { leadReducer } from './contractor/leadSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customerProfile: customerProfileReducer,
    customerRequirement: customerRequirementReducer,
    contractorProfile: contractorProfileReducer,
    portfolio: portfolioReducer,
    lead: leadReducer,
  },
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
