import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { customerProfileService } from '../../services/customer/customerProfileService'
import type {
  CustomerProfile,
  CustomerProfileRequest,
  CustomerProfileState,
} from '../../types/customer/customerProfileTypes'

const initialState: CustomerProfileState = {
  profile: null,
  loading: false,
  saving: false,
  error: null,
  successMessage: null,
  loaded: false,
}

function toErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

export const loadCustomerProfile = createAsyncThunk<
  CustomerProfile | null,
  void,
  { rejectValue: string }
>('customerProfile/load', async (_, { rejectWithValue }) => {
  try {
    return await customerProfileService.loadProfile()
  } catch (error) {
    return rejectWithValue(toErrorMessage(error, 'Unable to load customer profile'))
  }
})

export const createCustomerProfile = createAsyncThunk<
  CustomerProfile,
  CustomerProfileRequest,
  { rejectValue: string }
>('customerProfile/create', async (payload, { rejectWithValue }) => {
  try {
    return await customerProfileService.createProfile(payload)
  } catch (error) {
    return rejectWithValue(toErrorMessage(error, 'Unable to create customer profile'))
  }
})

export const updateCustomerProfile = createAsyncThunk<
  CustomerProfile,
  CustomerProfileRequest,
  { rejectValue: string }
>('customerProfile/update', async (payload, { rejectWithValue }) => {
  try {
    return await customerProfileService.updateProfile(payload)
  } catch (error) {
    return rejectWithValue(toErrorMessage(error, 'Unable to update customer profile'))
  }
})

const customerProfileSlice = createSlice({
  name: 'customerProfile',
  initialState,
  reducers: {
    clearCustomerProfileMessages(state) {
      state.error = null
      state.successMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCustomerProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadCustomerProfile.fulfilled, (state, action) => {
        state.loading = false
        state.loaded = true
        state.profile = action.payload
      })
      .addCase(loadCustomerProfile.rejected, (state, action) => {
        state.loading = false
        state.loaded = true
        state.error = action.payload ?? 'Unable to load customer profile'
      })
      .addCase(createCustomerProfile.pending, (state) => {
        state.saving = true
        state.error = null
        state.successMessage = null
      })
      .addCase(createCustomerProfile.fulfilled, (state, action) => {
        state.saving = false
        state.profile = action.payload
        state.loaded = true
        state.successMessage = 'Profile created successfully'
      })
      .addCase(createCustomerProfile.rejected, (state, action) => {
        state.saving = false
        state.error = action.payload ?? 'Unable to create customer profile'
      })
      .addCase(updateCustomerProfile.pending, (state) => {
        state.saving = true
        state.error = null
        state.successMessage = null
      })
      .addCase(updateCustomerProfile.fulfilled, (state, action) => {
        state.saving = false
        state.profile = action.payload
        state.loaded = true
        state.successMessage = 'Profile updated successfully'
      })
      .addCase(updateCustomerProfile.rejected, (state, action) => {
        state.saving = false
        state.error = action.payload ?? 'Unable to update customer profile'
      })
  },
})

export const { clearCustomerProfileMessages } = customerProfileSlice.actions
export const customerProfileReducer = customerProfileSlice.reducer
