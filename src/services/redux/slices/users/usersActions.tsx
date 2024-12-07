import { createAsyncThunk } from '@reduxjs/toolkit';
import * as usersApi from '../../../api/users';
import {
	AddUserParams,
	EditUserParams,
	DeleteUserParams,
} from '../../../api/users';
import { User } from '../../../mockServer/server';

export const getAllUsers = createAsyncThunk<
	User[],
	void,
	{ rejectValue: string }
>('users/getAllUsers', async (_, { rejectWithValue }) => {
	try {
		return await usersApi.getAllUsers();
	} catch (error) {
		if (error instanceof Error) {
			return rejectWithValue(error.message);
		}

		return rejectWithValue('Error Occured');
	}
});

export const addUser = createAsyncThunk<
	User,
	AddUserParams,
	{ rejectValue: string }
>('users/addUser', async (args, { rejectWithValue }) => {
	try {
		return await usersApi.addUser(args);
	} catch (error) {
		if (error instanceof Error) {
			return rejectWithValue(error.message);
		}

		return rejectWithValue('Error Occured');
	}
});

export const editUser = createAsyncThunk<
	User,
	EditUserParams,
	{ rejectValue: string }
>('users/editUser', async (args, { rejectWithValue }) => {
	try {
		return await usersApi.editUser(args);
	} catch (error) {
		if (error instanceof Error) {
			return rejectWithValue(error.message);
		}

		return rejectWithValue('Error Occured');
	}
});

export const deleteUser = createAsyncThunk<
	User,
	DeleteUserParams,
	{ rejectValue: string }
>('users/deleteUser', async (args, { rejectWithValue }) => {
	try {
		return await usersApi.deleteUser(args);
	} catch (error) {
		if (error instanceof Error) {
			return rejectWithValue(error.message);
		}

		return rejectWithValue('Error Occured');
	}
});
