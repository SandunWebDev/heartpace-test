import { createSlice } from '@reduxjs/toolkit';

import type { FetchStatus } from '../../types';
import { User, UserWithExtraData } from '../../../mockServer/server';
import { getUserListWithAddiData } from './usersTransformers';
import * as asyncUsersActions from './usersActions';
import * as allUsersSelectors from './usersSelectors';

const { getAllUsers, addUser, editUser, deleteUser } = asyncUsersActions;

export interface UsersState {
	userList: User[];
	filteredUserList: UserWithExtraData[];
	globalFilter: string;

	getAllUsersReqStatus: FetchStatus;
	getAllUsersReqError: string | null;

	addUserReqStatus: FetchStatus;
	addUserReqError: string | null;

	editUserReqStatus: FetchStatus;
	editUserReqError: string | null;

	deleteUserReqStatus: FetchStatus;
	deleteUserReqError: string | null;
}

export const initialState: UsersState = {
	userList: [],
	filteredUserList: [],
	globalFilter: '',

	getAllUsersReqStatus: 'IDLE',
	getAllUsersReqError: null,

	addUserReqStatus: 'IDLE',
	addUserReqError: null,

	editUserReqStatus: 'IDLE',
	editUserReqError: null,

	deleteUserReqStatus: 'IDLE',
	deleteUserReqError: null,
};

export const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {
		setFilteredUserList(state, action) {
			state.filteredUserList = action.payload;
		},
		setGlobalFilter(state, action) {
			state.globalFilter = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			// getAllUsers
			.addCase(getAllUsers.pending, (state) => {
				state.getAllUsersReqStatus = 'LOADING';
				state.getAllUsersReqError = null;
			})
			.addCase(getAllUsers.fulfilled, (state, action) => {
				state.getAllUsersReqStatus = 'IDLE';
				state.userList = action.payload;
				state.filteredUserList = getUserListWithAddiData(action.payload);
			})
			.addCase(getAllUsers.rejected, (state, action) => {
				state.getAllUsersReqStatus = 'ERROR';
				state.getAllUsersReqError = action.payload ?? null;
			})

			// addUser
			.addCase(addUser.pending, (state) => {
				state.addUserReqStatus = 'LOADING';
				state.addUserReqError = null;
			})
			.addCase(addUser.fulfilled, (state, action) => {
				state.addUserReqStatus = 'IDLE';
				state.userList.push(action.payload);
			})
			.addCase(addUser.rejected, (state, action) => {
				state.addUserReqStatus = 'ERROR';
				state.addUserReqError = action.payload ?? null;
			})

			// editUser
			.addCase(editUser.pending, (state) => {
				state.editUserReqStatus = 'LOADING';
				state.editUserReqError = null;
			})
			.addCase(editUser.fulfilled, (state, action) => {
				const { userId } = action.meta.arg;
				state.editUserReqStatus = 'IDLE';

				const arrayIndex = state.userList.findIndex((item) => {
					return item.id === userId;
				});
				state.userList[arrayIndex] = action.payload;
			})
			.addCase(editUser.rejected, (state, action) => {
				state.editUserReqStatus = 'ERROR';
				state.editUserReqError = action.payload ?? null;
			})

			// deleteUser
			.addCase(deleteUser.pending, (state) => {
				state.deleteUserReqStatus = 'LOADING';
				state.deleteUserReqError = null;
			})
			.addCase(deleteUser.fulfilled, (state, action) => {
				const { userId } = action.meta.arg;
				state.deleteUserReqStatus = 'IDLE';

				const arrayIndex = state.userList.findIndex((item) => {
					return item.id === userId;
				});
				state.userList.splice(arrayIndex, 1);
			})
			.addCase(deleteUser.rejected, (state, action) => {
				state.deleteUserReqStatus = 'ERROR';
				state.deleteUserReqError = action.payload ?? null;
			});
	},
});

export const usersActions = {
	...usersSlice.actions,
	...asyncUsersActions,
};

export const usersSelectors = allUsersSelectors;

export default usersSlice.reducer;
