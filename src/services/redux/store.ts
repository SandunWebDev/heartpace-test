import type { Action, ThunkAction } from '@reduxjs/toolkit';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import usersReducer, {
	initialState as usersSliceInitialState,
} from './slices/users/usersSlice';

export const initialPreloadedState = {
	users: usersSliceInitialState,
};

const rootReducer = combineReducers({
	users: usersReducer,
});

export const setupStore = (preloadedState?: Partial<RootState>) => {
	return configureStore({
		reducer: rootReducer,
		preloadedState,
	});
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
	ThunkReturnType,
	RootState,
	unknown,
	Action
>;
