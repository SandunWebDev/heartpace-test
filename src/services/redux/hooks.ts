// This file serves as a central hub for re-exporting pre-typed Redux hooks.
// Use these throughout the app instead of plain `useDispatch` and `useSelector`.
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();