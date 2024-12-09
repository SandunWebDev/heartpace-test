import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '../../services/redux/hooks';
import {
	usersActions,
	usersSelectors,
} from '../../services/redux/slices/users/usersSlice';
import FormDialog from '../../components/dialogs/FormDialog';

export interface DeleteUserFormDialog {
	deleteUserCurrentId: string;
	onClose: () => void;
	open: boolean;
}

export default function DeleteUserFormDialog({
	deleteUserCurrentId,
	open,
	onClose,
}: DeleteUserFormDialog) {
	const theme = useTheme();
	const colorMode = theme.palette.mode;

	const dispatch = useAppDispatch();
	const { deleteUserReqStatus, deleteUserReqError } = useAppSelector(
		usersSelectors.selectDeleteUserReqState,
	);

	if (!open) {
		return null;
	}

	return (
		<FormDialog headerTitle={'Delete User'} open={open} onClose={onClose}>
			<form>
				<Box>Are you sure you want to delete this user?</Box>
				<Box>
					<Button
						disabled={deleteUserReqStatus === 'LOADING'}
						variant='contained'
						onClick={async () => {
							onClose();
						}}>
						Close
					</Button>
					<Button
						disabled={deleteUserReqStatus === 'LOADING'}
						variant='contained'
						onClick={async () => {
							try {
								await dispatch(
									usersActions.deleteUser({ userId: deleteUserCurrentId }),
								).then(unwrapResult);

								toast.success('User successfully deleted.', {
									position: 'top-right',
									autoClose: 2000,
									hideProgressBar: false,
									closeOnClick: true,
									pauseOnHover: true,
									draggable: false,
									theme: colorMode === 'light' ? 'light' : 'dark',
								});
							} catch (err) {
								toast.error(deleteUserReqError, {
									position: 'top-right',
									autoClose: 2000,
									hideProgressBar: false,
									closeOnClick: true,
									pauseOnHover: true,
									draggable: false,
									theme: colorMode === 'light' ? 'light' : 'dark',
								});
							}

							onClose();
						}}
						endIcon={
							deleteUserReqStatus === 'LOADING' ? (
								<CircularProgress size='15px' color='inherit' />
							) : null
						}>
						Delete
					</Button>
				</Box>
			</form>
		</FormDialog>
	);
}
