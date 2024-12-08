import { createSlice } from '@reduxjs/toolkit';
import { differenceInYears } from 'date-fns';

import type { FetchStatus } from '../../types';
import { User } from '../../../mockServer/server';
import * as asyncUsersActions from './usersActions';
import * as allUsersSelectors from './usersSelectors';

const { getAllUsers, addUser, editUser, deleteUser } = asyncUsersActions;

export interface UsersState {
	userList: User[];
	getAllUsersReqStatus: FetchStatus;
	getAllUsersReqError: string | null;

	addUserReqStatus: FetchStatus;
	addUserReqError: string | null;

	editUserReqStatus: FetchStatus;
	editUserReqError: string | null;

	deleteUserReqStatus: FetchStatus;
	deleteUserReqError: string | null;
}

const initialState: UsersState = {
	userList: [],
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
	reducers: {},
	extraReducers: (builder) => {
		builder
			// getAllUsers
			.addCase(getAllUsers.pending, (state) => {
				state.getAllUsersReqStatus = 'LOADING';
				state.getAllUsersReqError = null;
			})
			.addCase(getAllUsers.fulfilled, (state, action) => {
				state.getAllUsersReqStatus = 'IDLE';

				// Addding some addtional calulated properties.
				const userList = action.payload;
				const userListWithAdditionalData = userList.map((item) => {
					const birthDate = new Date(item.birthDate);
					const todayDate = new Date();
					const age = differenceInYears(todayDate, birthDate);

					return { ...item, age };
				});

				state.userList = userListWithAdditionalData;
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
