import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { AppDispatch, RootState } from '../../store'

export const useCustomerDispatch = () => useDispatch<AppDispatch>()
export const useCustomerSelector: TypedUseSelectorHook<RootState> = useSelector
