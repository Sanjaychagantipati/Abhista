import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { leadService } from '../../services/contractor/leadService'
import type { Lead, LeadState } from '../../types/contractor/leadTypes'

const initialState: LeadState = {
  items: [],
  loading: false,
  error: null,
}

function toErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

export const fetchOpenLeads = createAsyncThunk<
  Lead[],
  void,
  { rejectValue: string }
>('leads/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await leadService.getOpenLeads()
  } catch (error) {
    return rejectWithValue(toErrorMessage(error, 'Unable to load open leads'))
  }
})

const leadSlice = createSlice({
  name: 'lead',
  initialState,
  reducers: {
    clearLeadError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOpenLeads.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOpenLeads.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchOpenLeads.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Unable to load open leads'
      })
  },
})

export const { clearLeadError } = leadSlice.actions
export const leadReducer = leadSlice.reducer
