import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { AppDispatch, RootState } from '../../store'

export const useContractorDispatch = () => useDispatch<AppDispatch>()
export const useContractorSelector: TypedUseSelectorHook<RootState> = useSelector
