import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { contractorProfileService } from '../../services/contractor/contractorProfileService'
import type {
  ContractorProfile,
  ContractorProfileRequest,
  ContractorProfileState,
} from '../../types/contractor/contractorProfileTypes'

const initialState: ContractorProfileState = {
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

export const loadContractorProfile = createAsyncThunk<
  ContractorProfile | null,
  void,
  { rejectValue: string }
>('contractorProfile/load', async (_, { rejectWithValue }) => {
  try {
    return await contractorProfileService.loadProfile()
  } catch (error) {
    return rejectWithValue(toErrorMessage(error, 'Unable to load contractor profile'))
  }
})

export const createContractorProfile = createAsyncThunk<
  ContractorProfile,
  ContractorProfileRequest,
  { rejectValue: string }
>('contractorProfile/create', async (payload, { rejectWithValue }) => {
  try {
    return await contractorProfileService.createProfile(payload)
  } catch (error) {
    return rejectWithValue(toErrorMessage(error, 'Unable to create contractor profile'))
  }
})

export const updateContractorProfile = createAsyncThunk<
  ContractorProfile,
  ContractorProfileRequest,
  { rejectValue: string }
>('contractorProfile/update', async (payload, { rejectWithValue }) => {
  try {
    return await contractorProfileService.updateProfile(payload)
  } catch (error) {
    return rejectWithValue(toErrorMessage(error, 'Unable to update contractor profile'))
  }
})

const contractorProfileSlice = createSlice({
  name: 'contractorProfile',
  initialState,
  reducers: {
    clearContractorProfileMessages(state) {
      state.error = null
      state.successMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadContractorProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadContractorProfile.fulfilled, (state, action) => {
        state.loading = false
        state.loaded = true
        state.profile = action.payload
      })
      .addCase(loadContractorProfile.rejected, (state, action) => {
        state.loading = false
        state.loaded = true
        state.error = action.payload ?? 'Unable to load contractor profile'
      })
      .addCase(createContractorProfile.pending, (state) => {
        state.saving = true
        state.error = null
        state.successMessage = null
      })
      .addCase(createContractorProfile.fulfilled, (state, action) => {
        state.saving = false
        state.profile = action.payload
        state.loaded = true
        state.successMessage = 'Profile created successfully'
      })
      .addCase(createContractorProfile.rejected, (state, action) => {
        state.saving = false
        state.error = action.payload ?? 'Unable to create contractor profile'
      })
      .addCase(updateContractorProfile.pending, (state) => {
        state.saving = true
        state.error = null
        state.successMessage = null
      })
      .addCase(updateContractorProfile.fulfilled, (state, action) => {
        state.saving = false
        state.profile = action.payload
        state.loaded = true
        state.successMessage = 'Profile updated successfully'
      })
      .addCase(updateContractorProfile.rejected, (state, action) => {
        state.saving = false
        state.error = action.payload ?? 'Unable to update contractor profile'
      })
  },
})

export const { clearContractorProfileMessages } = contractorProfileSlice.actions
export const contractorProfileReducer = contractorProfileSlice.reducer
