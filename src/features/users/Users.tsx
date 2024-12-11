import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PeopleIcon from '@mui/icons-material/People';

import {
	useAppDispatch,
	useAppSelector,
	shallowEqual,
} from '../../services/redux/hooks';
import {
	usersActions,
	usersSelectors,
} from '../../services/redux/slices/users/usersSlice';
import LoadingView from '../../components/loaders/LoadingView';
import UsersTable from './UsersTable';

export default function Users() {
	const dispatch = useAppDispatch();
	const { userList, getAllUsersReqStatus, getAllUsersReqError } =
		useAppSelector(usersSelectors.selectGetAllUsersReqState, shallowEqual);

	useEffect(() => {
		dispatch(usersActions.getAllUsers());
	}, [dispatch]);

	const isDataLoading = getAllUsersReqStatus === 'LOADING';
	const isDataLoadingError = getAllUsersReqStatus === 'ERROR';

	return (
		<Box>
			<Box sx={{ marginBottom: '30px' }}>
				<Typography
					variant='h3'
					color='textPrimary'
					sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
					<PeopleIcon fontSize='large' sx={{ fontSize: 'inherit' }} />
					Users
				</Typography>
				<Typography variant='subtitle2' color='textsecondary'>
					All Company Users
				</Typography>
			</Box>

			<LoadingView
				isLoading={isDataLoading}
				isError={Boolean(isDataLoadingError)}
				loadingText='Loading User List'
				errorText={getAllUsersReqError}
			/>

			{!isDataLoading && !isDataLoadingError && (
				<UsersTable
					userList={userList}
					getAllUsersReqStatus={getAllUsersReqStatus}
					getAllUsersReqError={getAllUsersReqError}
				/>
			)}
		</Box>
	);
}
