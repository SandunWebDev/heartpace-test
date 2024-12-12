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
import UsersStatus from './other/UsersStatus';
import UsersAddButton from './other/UsersAddButton';
import UsersSearch from './other/UsersSearch';
import UsersAgeGroupVsGenderChart from './charts/UsersAgeGroupVsGenderChart';
import UsersCountryChart from './charts/UsersCountryChart';
import UsersTable from './tables/UsersTable';
import { UserWithExtraData } from '../../services/mockServer/server';

export default function Users() {
	const dispatch = useAppDispatch();
	const { userList, getAllUsersReqStatus, getAllUsersReqError } =
		useAppSelector(usersSelectors.selectGetAllUsersReqState, shallowEqual);
	const filteredUserList = useAppSelector(
		usersSelectors.selectFilteredUserList,
	);
	const globalFilter = useAppSelector(usersSelectors.selectGlobalFilter);
	const setGlobalFilter = (value: string) => {
		dispatch(usersActions.setGlobalFilter(value));
	};
	const setFilteredUserList = (filteredUserList: UserWithExtraData[]) => {
		dispatch(usersActions.setFilteredUserList(filteredUserList));
	};

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
				<Box>
					<Typography variant='h6' gutterBottom>
						Users List
					</Typography>

					<Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
						<UsersStatus
							totalUserAmount={userList.length}
							filteredUserAmount={filteredUserList.length}
						/>

						<UsersAddButton />
					</Box>

					<Box sx={{ margin: '30px 0 30px 0' }}>
						<UsersSearch
							value={globalFilter}
							onChange={(value) => {
								dispatch(usersActions.setGlobalFilter(value));
							}}
							onClose={() => {
								dispatch(usersActions.setGlobalFilter(''));
							}}
						/>
					</Box>

					<UsersTable
						userList={userList}
						globalFilter={globalFilter}
						setGlobalFilter={setGlobalFilter}
						setFilteredUserList={setFilteredUserList}
					/>

					<Box
						sx={(theme) => {
							return {
								display: 'flex',
								width: '100%',
								marginTop: '45px',
								paddingBottom: '35px',
								gap: '80px',
								[theme.breakpoints.down('lg')]: {
									flexWrap: 'wrap',
								},
							};
						}}>
						<UsersAgeGroupVsGenderChart
							title='Users By Age Group'
							filteredUserRows={filteredUserList}
						/>
						<UsersCountryChart
							title='Users By Continent'
							filteredUserRows={filteredUserList}
						/>
					</Box>
				</Box>
			)}
		</Box>
	);
}
