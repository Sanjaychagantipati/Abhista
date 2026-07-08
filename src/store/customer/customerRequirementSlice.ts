import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RequirementService } from '../../services/customer/RequirementService'
import type {
  CustomerRequirementState,
  RequirementResponse,
} from '../../types/customer/RequirementTypes'

const initialState: CustomerRequirementState = {
  requirements: [],
  currentRequirement: null,
  loading: false,
  saving: false,
  error: null,
  loaded: false,
}

function toErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

export const loadMyRequirements = createAsyncThunk<
  RequirementResponse[],
  void,
  { rejectValue: string }
>('customerRequirement/loadAll', async (_, { rejectWithValue }) => {
  try {
    return await RequirementService.getMyRequirements()
  } catch (error) {
    return rejectWithValue(toErrorMessage(error, 'Unable to load requirements'))
  }
})

export const loadRequirementById = createAsyncThunk<
  RequirementResponse,
  number,
  { rejectValue: string }
>('customerRequirement/loadById', async (id, { rejectWithValue }) => {
  try {
    return await RequirementService.getRequirementById(id)
  } catch (error) {
    return rejectWithValue(toErrorMessage(error, 'Unable to load requirement details'))
  }
})

const customerRequirementSlice = createSlice({
  name: 'customerRequirement',
  initialState,
  reducers: {
    clearCurrentRequirement(state) {
      state.currentRequirement = null
      state.error = null
    },
    clearRequirementError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // loadAll
      .addCase(loadMyRequirements.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadMyRequirements.fulfilled, (state, action) => {
        state.loading = false
        state.loaded = true
        state.requirements = action.payload
      })
      .addCase(loadMyRequirements.rejected, (state, action) => {
        state.loading = false
        state.loaded = true
        state.error = action.payload ?? 'Unable to load requirements'
      })
      // loadById
      .addCase(loadRequirementById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadRequirementById.fulfilled, (state, action) => {
        state.loading = false
        state.currentRequirement = action.payload
      })
      .addCase(loadRequirementById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Unable to load requirement details'
      })
  },
})

export const { clearCurrentRequirement, clearRequirementError } =
  customerRequirementSlice.actions
export const customerRequirementReducer = customerRequirementSlice.reducer
