import { useState } from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

import AddEditUserFormDialog from '../forms/AddEditUserFormDialog';

export default function UsersAddButton() {
	const [addUserFormDialogOpenStatus, setAddUserFormDialogOpenStatus] =
		useState(false);

	const renderDialogs = (
		<AddEditUserFormDialog
			formMode='ADD'
			open={addUserFormDialogOpenStatus}
			onClose={() => {
				setAddUserFormDialogOpenStatus(false);
			}}
		/>
	);

	return (
		<>
			{renderDialogs}

			<Box
				sx={{
					marginLeft: 'auto',
				}}>
				<Fab
					color='primary'
					onClick={() => {
						setAddUserFormDialogOpenStatus(true);
					}}>
					<PersonAddAltIcon />
				</Fab>
			</Box>
		</>
	);
}
