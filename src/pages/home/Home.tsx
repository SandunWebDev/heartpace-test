import { useEffect } from 'react';
import Button from '@mui/material/Button';
import { JsonView, allExpanded, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import { faker } from '@faker-js/faker';

import { useAppDispatch, useAppSelector } from '../../services/redux/hooks';
import {
	usersActions,
	usersSelectors,
} from '../../services/redux/slices/users/usersSlice';
import { getUserById } from '../../services/api/users';
import UsersTable from './UsersTable';

import './Home.css';

const exampleUser = {
	id: faker.string.uuid(),
	firstName: 'James',
	lastName: 'Anderson',
	gender: 'Male',
	birthDate: new Date('1990/10/05'),
	jobTitle: 'Developer',
	phone: '0764859475',
	email: 'james@gmail.com',
	address: 'Main Street',
	city: 'London',
	country: 'UK',
};

export default function Home() {
	const dispatch = useAppDispatch();
	const { userList } = useAppSelector(usersSelectors.selectGetAllUsersReqState);

	useEffect(() => {
		dispatch(usersActions.getAllUsers());
	}, [dispatch]);

	return (
		<div className='Home'>
			<UsersTable userList={userList} />
		</div>
	);

	// Temporary code that will be used later.
	return (
		<>
			<h1>Zuvo HR Lite</h1>

			<JsonView
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				data={selectGetAllUsersReqState}
				shouldExpandNode={allExpanded}
				style={defaultStyles}
			/>

			<Button
				variant='contained'
				onClick={async () => {
					const users = await dispatch(usersActions.getAllUsers());
					console.log('All Users', users);
				}}>
				Get All Users
			</Button>

			<Button
				variant='contained'
				onClick={async () => {
					const user = await getUserById({
						userId: '6b042125-686a-43e0-8a68-23cf5bee102e',
					});
					console.log('Get User By Id', user);
				}}>
				Get User By Id
			</Button>

			<Button
				variant='contained'
				onClick={async () => {
					const addedUser = await dispatch(
						usersActions.addUser({ userData: exampleUser }),
					);
					console.log('Added User', addedUser);
				}}>
				Add User
			</Button>

			<Button
				variant='contained'
				onClick={async () => {
					const editedUser = await dispatch(
						usersActions.editUser({
							userId: '6b042125-686a-43e0-8a68-23cf5bee102e',
							userData: {
								firstName: 'ABCDEFG',
							},
						}),
					);
					console.log('Edited User', editedUser);
				}}>
				Edit User
			</Button>

			<Button
				variant='contained'
				onClick={async () => {
					const deletedUser = await dispatch(
						usersActions.deleteUser({
							userId: 'f8fbb3f0-46c3-4df2-a906-0f6fcd2192b6',
						}),
					);
					console.log('Deleted User', deletedUser);
				}}>
				Delete User
			</Button>
		</>
	);
}
