import axios from 'axios';
import {
	User,
	SingleUserApiResponse,
	MultiUserApiResponse,
} from '../mockServer/server';

export const getAllUsers = (): Promise<User[]> => {
	return axios.get<MultiUserApiResponse>('/api/users').then((res) => {
		return res.data.users;
	});
};

export interface GetUserByIdParams {
	userId: string;
}
export const getUserById = ({ userId }: GetUserByIdParams): Promise<User> => {
	return axios
		.get<SingleUserApiResponse>(`/api/users/${userId}`)
		.then((res) => {
			return res.data.user;
		});
};

export interface AddUserParams {
	userData: User;
}
export const addUser = ({ userData }: AddUserParams): Promise<User> => {
	return axios
		.post<SingleUserApiResponse>('/api/users', userData)
		.then((res) => {
			return res.data.user;
		});
};

export interface EditUserParams {
	userId: string;
	userData: Partial<User>;
}
export const editUser = ({
	userId,
	userData,
}: EditUserParams): Promise<User> => {
	return axios
		.patch<SingleUserApiResponse>(`/api/users/${userId}`, userData)
		.then((res) => {
			return res.data.user;
		});
};

export interface DeleteUserParams {
	userId: string;
}
export const deleteUser = ({ userId }: DeleteUserParams): Promise<User> => {
	return axios
		.delete<SingleUserApiResponse>(`/api/users/${userId}`)
		.then((res) => {
			return res.data.user;
		});
};
