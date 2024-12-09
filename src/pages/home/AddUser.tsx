import { useState } from 'react';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { faker } from '@faker-js/faker';

import { useAppDispatch, useAppSelector } from '../../services/redux/hooks';
import {
	usersActions,
	usersSelectors,
} from '../../services/redux/slices/users/usersSlice';
import { Gender } from '../../services/mockServer/server';
import { countryList } from '../../utils/countryList';
import FormikTextField from '../../components/formikFields/FormikTextField';
import FormDialog from '../../components/dialogs/FormDialog';

// Some default error texts that will be used with yup validations.
export const errorTexts = {
	required: () => 'Required',
	onlyLetters: () => 'Must only contain letters',
	minChars: (chars: number) => `Must be at least ${chars} characters`,
	maxChars: (chars: number) => `Must be lower than ${chars} characters`,
};

const addUserFormInitialValue = {
	firstName: 'SANDUN',
	lastName: 'AKALANKA',
	gender: 'male',
	birthDate: '1993-01-08',
	jobTitle: 'aaaa',
	phone: '234324',
	email: 'sdfsf@sdf.com',
	address: 'fsdfsfsdf',
	city: '23234',
	country: 'Sri Lanka',
};

const addUserFormValidationScheme = Yup.object().shape({
	firstName: Yup.string()
		.trim()
		.required(errorTexts.required())
		.matches(/^[a-zA-Z\s\-]+$/, errorTexts.onlyLetters())
		.max(50, errorTexts.maxChars(50)),

	lastName: Yup.string()
		.trim()
		.required(errorTexts.required())
		.matches(/^[a-zA-Z\s\-]+$/, errorTexts.onlyLetters())
		.max(50, errorTexts.maxChars(50)),

	gender: Yup.string()
		.required(errorTexts.required())
		.oneOf(['male', 'female', 'other'], 'Invalid gender selected'),

	birthDate: Yup.date()
		.required(errorTexts.required())
		.max(new Date(), 'Birth date cannot be in the future'),

	jobTitle: Yup.string().trim().max(100, errorTexts.maxChars(100)),

	phone: Yup.string().matches(
		/^\+?[0-9][0-9\s\-]{0,14}$/,
		'Invalid phone number format',
	),

	email: Yup.string()
		.trim()
		.required(errorTexts.required())
		.email('Invalid email format'),

	address: Yup.string()
		.trim()
		.required(errorTexts.required())
		.max(256, errorTexts.maxChars(100)),

	city: Yup.string()
		.trim()
		.required(errorTexts.required())
		.max(50, errorTexts.maxChars(50)),

	country: Yup.string()
		.required(errorTexts.required())
		.oneOf(
			countryList.map((country) => country.name),
			'Invalid gender selected',
		),
});

export default function AddUser() {
	const theme = useTheme();
	const colorMode = theme.palette.mode;

	const dispatch = useAppDispatch();
	const { addUserReqError } = useAppSelector(
		usersSelectors.selectAddUserReqState,
	);

	const [open, setOpen] = useState(false);
	const handleDialogOpen = () => {
		setOpen(true);
	};
	const handleDialogClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<Button
				variant='outlined'
				endIcon={<AddCircleIcon />}
				onClick={handleDialogOpen}>
				ADD USER
			</Button>

			<FormDialog
				headerTitle={'Add User'}
				open={open}
				onClose={handleDialogClose}>
				<Formik
					initialValues={addUserFormInitialValue}
					validationSchema={addUserFormValidationScheme}
					onSubmit={async (formData, { setSubmitting }) => {
						try {
							const addUserData = {
								...formData,
								id: faker.string.uuid(),
								birthDate: new Date(formData.birthDate),
								gender: formData.gender as Gender,
							};

							await dispatch(
								usersActions.addUser({ userData: addUserData }),
							).then(unwrapResult);

							toast.success('User successfully added.', {
								position: 'top-right',
								autoClose: 2000,
								hideProgressBar: false,
								closeOnClick: true,
								pauseOnHover: true,
								draggable: false,
								theme: colorMode === 'light' ? 'light' : 'dark',
							});
							setSubmitting(false);
							handleDialogClose();
						} catch {
							// Error will be shown on UI.
						}
					}}>
					{({ isSubmitting }) => {
						return (
							<Form
								noValidate // disabling html5 native validation
							>
								<FormikTextField
									label='First Name'
									name='firstName'
									type='text'
									required
									disabled={isSubmitting}
									size='small'
								/>
								<FormikTextField
									label='Last Name'
									name='lastName'
									type='text'
									required
									disabled={isSubmitting}
									size='small'
								/>
								<FormikTextField
									select
									label='Gender'
									name='gender'
									required
									disabled={isSubmitting}
									size='small'>
									<MenuItem value={'male'}>Male</MenuItem>
									<MenuItem value={'female'}>Female</MenuItem>
									<MenuItem value={'other'}>Other</MenuItem>
								</FormikTextField>
								<FormikTextField
									label='Birth Date'
									name='birthDate'
									type='date'
									required
									disabled={isSubmitting}
									size='small'
								/>
								<FormikTextField
									label='Job Title'
									name='jobTitle'
									type='text'
									disabled={isSubmitting}
									size='small'
								/>
								<FormikTextField
									label='Phone'
									name='phone'
									type='tel'
									disabled={isSubmitting}
									size='small'
								/>
								<FormikTextField
									label='Email'
									name='email'
									type='email'
									required
									disabled={isSubmitting}
									size='small'
								/>
								<FormikTextField
									label='Address'
									name='address'
									type='text'
									required
									disabled={isSubmitting}
									size='small'
								/>
								<FormikTextField
									label='City'
									name='city'
									type='text'
									required
									disabled={isSubmitting}
									size='small'
								/>
								<FormikTextField
									select
									label='Country'
									name='country'
									required
									disabled={isSubmitting}
									size='small'>
									{countryList.map((country, index) => (
										<MenuItem key={index} value={country.name}>
											{country.name}
										</MenuItem>
									))}
								</FormikTextField>

								{addUserReqError && (
									<Alert severity='error'>{addUserReqError}</Alert>
								)}

								<Button
									disabled={isSubmitting}
									variant='contained'
									onClick={handleDialogClose}>
									Close
								</Button>
								<Button
									type='submit'
									disabled={isSubmitting}
									variant='contained'
									endIcon={
										isSubmitting ? (
											<CircularProgress size='15px' color='inherit' />
										) : null
									}>
									Submit
								</Button>
							</Form>
						);
					}}
				</Formik>
			</FormDialog>
		</div>
	);
}
