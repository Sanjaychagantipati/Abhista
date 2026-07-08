import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { portfolioService } from '../../services/contractor/portfolioService'
import type { Portfolio, CreatePortfolioRequest, PortfolioState } from '../../types/contractor/portfolioTypes'

const initialState: PortfolioState = {
	items: [],
	loading: false,
	saving: false,
	error: null,
	successMessage: null,
}

function toErrorMessage(error: unknown, fallback: string) {
	return error instanceof Error ? error.message : fallback
}

export const fetchMyPortfolio = createAsyncThunk<
	Portfolio[],
	void,
	{ rejectValue: string }
>('portfolio/fetchAll', async (_, { rejectWithValue }) => {
	try {
		return await portfolioService.getMyPortfolio()
	} catch (error) {
		return rejectWithValue(toErrorMessage(error, 'Unable to load portfolio items'))
	}
})

export const createPortfolio = createAsyncThunk<
	Portfolio,
	CreatePortfolioRequest,
	{ rejectValue: string }
>('portfolio/create', async (payload, { rejectWithValue }) => {
	try {
		return await portfolioService.addPortfolio(payload)
	} catch (error) {
		return rejectWithValue(toErrorMessage(error, 'Unable to add portfolio item'))
	}
})

export const deletePortfolioItem = createAsyncThunk<
	number,
	number,
	{ rejectValue: string }
>('portfolio/delete', async (id, { rejectWithValue }) => {
	try {
		await portfolioService.deletePortfolio(id)
		return id
	} catch (error) {
		return rejectWithValue(toErrorMessage(error, 'Unable to delete portfolio item'))
	}
})

const portfolioSlice = createSlice({
	name: 'portfolio',
	initialState,
	reducers: {
		clearPortfolioMessages(state) {
			state.error = null
			state.successMessage = null
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchMyPortfolio.pending, (state) => {
				state.loading = true
				state.error = null
			})
			.addCase(fetchMyPortfolio.fulfilled, (state, action) => {
				state.loading = false
				state.items = action.payload
			})
			.addCase(fetchMyPortfolio.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload ?? 'Unable to load portfolio items'
			})
			.addCase(createPortfolio.pending, (state) => {
				state.saving = true
				state.error = null
				state.successMessage = null
			})
			.addCase(createPortfolio.fulfilled, (state, action) => {
				state.saving = false
				state.items.push(action.payload)
				state.successMessage = 'Portfolio item added successfully'
			})
			.addCase(createPortfolio.rejected, (state, action) => {
				state.saving = false
				state.error = action.payload ?? 'Unable to add portfolio item'
			})
			.addCase(deletePortfolioItem.pending, (state) => {
				state.loading = true
				state.error = null
				state.successMessage = null
			})
			.addCase(deletePortfolioItem.fulfilled, (state, action) => {
				state.loading = false
				state.items = state.items.filter((item) => item.id !== action.payload)
				state.successMessage = 'Portfolio item deleted successfully'
			})
			.addCase(deletePortfolioItem.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload ?? 'Unable to delete portfolio item'
			})
	},
})

export const { clearPortfolioMessages } = portfolioSlice.actions
export const portfolioReducer = portfolioSlice.reducer
