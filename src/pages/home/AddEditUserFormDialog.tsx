import Button from '@mui/material/Button';
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
import { User } from '../../services/mockServer/server';

// Some default error texts that will be used with yup validations.
export const errorTexts = {
	required: () => 'Required',
	onlyLetters: () => 'Must only contain letters',
	minChars: (chars: number) => `Must be at least ${chars} characters`,
	maxChars: (chars: number) => `Must be lower than ${chars} characters`,
};

const userFormValidationScheme = Yup.object().shape({
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

	jobTitle: Yup.string().trim().max(100, errorTexts.maxChars(100)).optional(),

	phone: Yup.string()
		.matches(/^\+?[0-9][0-9\s\-]{0,14}$/, 'Invalid phone number format')
		.nullable(),

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
			'Invalid country selected',
		),
});

export interface AddEditUserFormDialog {
	formMode: 'ADD' | 'EDIT';
	editUserCurrentData: User;
	onClose: () => void;
	open: boolean;
}

export default function AddEditUserFormDialog({
	formMode = 'ADD',
	editUserCurrentData = {},
	open,
	onClose,
}: AddEditUserFormDialog) {
	const theme = useTheme();
	const colorMode = theme.palette.mode;

	const dispatch = useAppDispatch();
	const { addUserReqError } = useAppSelector(
		usersSelectors.selectAddUserReqState,
	);
	const { editUserReqError } = useAppSelector(
		usersSelectors.selectEditUserReqState,
	);

	const userFormDefaultValues = {
		firstName: '',
		lastName: '',
		gender: '',
		birthDate: '',
		jobTitle: '',
		phone: '',
		email: '',
		address: '',
		city: '',
		country: '',
	};

	const userFormInitialValues = {
		...userFormDefaultValues,
		...editUserCurrentData,
	};

	if (!open) {
		return null;
	}

	return (
		<FormDialog
			headerTitle={formMode === 'ADD' ? 'Add User' : 'Edit User'}
			open={open}
			onClose={onClose}>
			<Formik
				initialValues={userFormInitialValues}
				validationSchema={userFormValidationScheme}
				onSubmit={async (formData, { setSubmitting }) => {
					if (formMode === 'ADD') {
						try {
							const addUserData = {
								...formData,
								id: faker.string.uuid(),
								birthDate: new Date(formData.birthDate as string),
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
							onClose();
						} catch {
							// Error will be shown on UI.
						}
					} else if (formMode === 'EDIT') {
						try {
							const editUserData = {
								...formData,
							};

							await dispatch(
								usersActions.editUser({
									userId: editUserData.id,
									userData: editUserData,
								}),
							).then(unwrapResult);

							toast.success('User successfully edited.', {
								position: 'top-right',
								autoClose: 2000,
								hideProgressBar: false,
								closeOnClick: true,
								pauseOnHover: true,
								draggable: false,
								theme: colorMode === 'light' ? 'light' : 'dark',
							});
							setSubmitting(false);
							onClose();
						} catch {
							// Error will be shown on UI.
						}
					}
				}}>
				{({ isSubmitting, setFieldValue }) => {
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
								setFieldValue={setFieldValue}
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

							{formMode === 'ADD' && addUserReqError && (
								<Alert severity='error'>{addUserReqError}</Alert>
							)}

							{formMode === 'EDIT' && editUserReqError && (
								<Alert severity='error'>{editUserReqError}</Alert>
							)}

							<Button
								disabled={isSubmitting}
								variant='contained'
								onClick={onClose}>
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
	);
}
