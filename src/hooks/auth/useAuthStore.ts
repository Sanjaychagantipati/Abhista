import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { AppDispatch, RootState } from '../../store'

export const useAuthDispatch = () => useDispatch<AppDispatch>()
export const useAuthSelector: TypedUseSelectorHook<RootState> = useSelector
