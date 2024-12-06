import { useCallback } from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';

import { User } from '../../services/mockServer/server';

export default function Home() {
	const getAllUsers = useCallback(() => {
		return axios.get<{ users: User[] }>('/api/users').then((res) => {
			return res.data;
		});
	}, []);

	const getUserById = useCallback((userId: number) => {
		return axios.get<{ user: User }>(`/api/users/${userId}`).then((res) => {
			return res.data;
		});
	}, []);

	const addUser = useCallback((userData: User) => {
		return axios.post<{ user: User }>('/api/users', userData).then((res) => {
			return res.data;
		});
	}, []);

	const editUser = useCallback((userId: number, userData: User) => {
		return axios
			.patch<{ user: User }>(`/api/users/${userId}`, userData)
			.then((res) => {
				return res.data;
			});
	}, []);

	const deleteUser = useCallback((userId: number) => {
		return axios.delete<{ user: User }>(`/api/users/${userId}`).then((res) => {
			return res.data;
		});
	}, []);

	return (
		<>
			<h1>Zuvo HR Lite</h1>

			<Button
				variant='contained'
				onClick={async () => {
					const users = await getAllUsers();
					console.log('All Users', users);
				}}>
				Get All Users
			</Button>

			<Button
				variant='contained'
				onClick={async () => {
					const user = await getUserById(2);
					console.log('Get User By Id', user);
				}}>
				Get User By Id
			</Button>

			<Button
				variant='contained'
				onClick={async () => {
					const addedUser = await addUser(3);
					console.log('Added User', addedUser);
				}}>
				Add User
			</Button>

			<Button
				variant='contained'
				onClick={async () => {
					const editedUser = await editUser(4, { firstName: 'APPLE' });
					console.log('Edited User', editedUser);
				}}>
				Edit User
			</Button>

			<Button
				variant='contained'
				onClick={async () => {
					const deletedUser = await deleteUser(2);
					console.log('Deleted User', deletedUser);
				}}>
				Delete User
			</Button>
		</>
	);
}
