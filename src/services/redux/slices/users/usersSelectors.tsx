import type { RootState } from '../../store';

export const selectGetAllUsersReqState = (state: RootState) => {
	const { userList, getAllUsersReqStatus, getAllUsersReqError } = state.users;

	return {
		userList,
		getAllUsersReqStatus,
		getAllUsersReqError,
	};
};

export const selectAddUserReqState = (state: RootState) => {
	const { addUserReqStatus, addUserReqError } = state.users;

	return {
		addUserReqStatus,
		addUserReqError,
	};
};

export const selectEditUserReqState = (state: RootState) => {
	const { editUserReqStatus, editUserReqError } = state.users;

	return {
		editUserReqStatus,
		editUserReqError,
	};
};

export const selectDeleteUserReqState = (state: RootState) => {
	const { deleteUserReqStatus, deleteUserReqError } = state.users;

	return {
		deleteUserReqStatus,
		deleteUserReqError,
	};
};

export const selectFilteredUserList = (state: RootState) => {
	return state.users.filteredUserList;
};
