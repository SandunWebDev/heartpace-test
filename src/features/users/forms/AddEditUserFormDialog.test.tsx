import userEvent from '@testing-library/user-event';

import { mockFilteredUserList } from '../../../services/mockServer/userList';
import { render, screen, cleanup } from '../../../configs/jest/testUtils';
import AddEditUserFormDialog from './AddEditUserFormDialog';

const onCloseMock = jest.fn();

describe('AddEditUserFormDialog Component', () => {
	afterEach(() => {
		jest.clearAllMocks();
		cleanup();
	});

	test('renders the dialog in Add mode', () => {
		render(
			<AddEditUserFormDialog
				open={true}
				formMode='ADD'
				onClose={onCloseMock}
			/>,
		);

		// Check dialog title
		expect(screen.getByText(/Add User/i)).toBeInTheDocument();

		// Getting each input
		const firstNameInput: HTMLInputElement = screen
			.getByTestId('firstName')
			.querySelector('input')!;
		const lastNameInput: HTMLInputElement = screen
			.getByTestId('lastName')
			.querySelector('input')!;
		const genderInput: HTMLInputElement = screen
			.getByTestId('gender')
			.querySelector('input')!;
		const birthDateInput: HTMLInputElement = screen
			.getByTestId('birthDate')
			.querySelector('input')!;
		const jobTitleInput: HTMLInputElement = screen
			.getByTestId('jobTitle')
			.querySelector('input')!;
		const phoneInput: HTMLInputElement = screen
			.getByTestId('phone')
			.querySelector('input')!;
		const emailInput: HTMLInputElement = screen
			.getByTestId('email')
			.querySelector('input')!;
		const addressInput: HTMLInputElement = screen
			.getByTestId('address')
			.querySelector('input')!;
		const cityInput: HTMLInputElement = screen
			.getByTestId('city')
			.querySelector('input')!;
		const countryInput: HTMLInputElement = screen
			.getByTestId('country')
			.querySelector('input')!;

		// Check all input exist and value is empty
		expect(firstNameInput.value).toEqual('');
		expect(lastNameInput.value).toEqual('');
		expect(genderInput.value).toEqual('');
		expect(birthDateInput.value).toEqual('MM/DD/YYYY');
		expect(jobTitleInput.value).toEqual('');
		expect(phoneInput.value).toEqual('');
		expect(emailInput.value).toEqual('');
		expect(addressInput.value).toEqual('');
		expect(cityInput.value).toEqual('');
		expect(countryInput.value).toEqual('');
	});

	test('renders the dialog in Edit mode with prefilled data', () => {
		const mockEditUserData = mockFilteredUserList[0];

		render(
			<AddEditUserFormDialog
				open={true}
				formMode='EDIT'
				onClose={onCloseMock}
				editUserCurrentData={mockEditUserData}
			/>,
		);

		// Check dialog title
		expect(screen.getByText(/Edit User/i)).toBeInTheDocument();

		// Getting each input
		const firstNameInput: HTMLInputElement = screen
			.getByTestId('firstName')
			.querySelector('input')!;
		const lastNameInput: HTMLInputElement = screen
			.getByTestId('lastName')
			.querySelector('input')!;
		const genderInput: HTMLInputElement = screen
			.getByTestId('gender')
			.querySelector('input')!;
		const birthDateInput: HTMLInputElement = screen
			.getByTestId('birthDate')
			.querySelector('input')!;
		const jobTitleInput: HTMLInputElement = screen
			.getByTestId('jobTitle')
			.querySelector('input')!;
		const phoneInput: HTMLInputElement = screen
			.getByTestId('phone')
			.querySelector('input')!;
		const emailInput: HTMLInputElement = screen
			.getByTestId('email')
			.querySelector('input')!;
		const addressInput: HTMLInputElement = screen
			.getByTestId('address')
			.querySelector('input')!;
		const cityInput: HTMLInputElement = screen
			.getByTestId('city')
			.querySelector('input')!;
		const countryInput: HTMLInputElement = screen
			.getByTestId('country')
			.querySelector('input')!;

		// Check all input to have passed data
		expect(firstNameInput.value).toEqual(mockEditUserData.firstName);
		expect(lastNameInput.value).toEqual(mockEditUserData.lastName);
		expect(genderInput.value).toEqual(mockEditUserData.gender);
		expect(birthDateInput.value).toEqual('07/09/1978');
		expect(jobTitleInput.value).toEqual(mockEditUserData.jobTitle);
		expect(phoneInput.value).toEqual(mockEditUserData.phone);
		expect(emailInput.value).toEqual(mockEditUserData.email);
		expect(addressInput.value).toEqual(mockEditUserData.address);
		expect(cityInput.value).toEqual(mockEditUserData.city);
		expect(countryInput.value).toEqual(mockEditUserData.country);
	});

	test('validate required fields', async () => {
		const fireUserEvent = userEvent.setup();

		render(
			<AddEditUserFormDialog
				open={true}
				formMode='ADD'
				onClose={onCloseMock}
			/>,
		);

		// Submitting form with out any data to run validation on all fields
		await fireUserEvent.click(screen.getByText(/Submit/i));

		// Getting each input's helper text
		const firstNameHelperText: HTMLInputElement = screen
			.getByTestId('firstName')
			.querySelector('.MuiFormHelperText-root')!;
		const lastNameHelperText: HTMLInputElement = screen
			.getByTestId('lastName')
			.querySelector('.MuiFormHelperText-root')!;
		const genderHelperText: HTMLInputElement = screen
			.getByTestId('gender')
			.querySelector('.MuiFormHelperText-root')!;
		const birthDateHelperText: HTMLInputElement = screen
			.getByTestId('birthDate')
			.querySelector('.MuiFormHelperText-root')!;
		const jobTitleHelperText: HTMLInputElement = screen
			.getByTestId('jobTitle')
			.querySelector('.MuiFormHelperText-root')!;
		const phoneHelperText: HTMLInputElement = screen
			.getByTestId('phone')
			.querySelector('.MuiFormHelperText-root')!;
		const emailHelperText: HTMLInputElement = screen
			.getByTestId('email')
			.querySelector('.MuiFormHelperText-root')!;
		const addressHelperText: HTMLInputElement = screen
			.getByTestId('address')
			.querySelector('.MuiFormHelperText-root')!;
		const cityHelperText: HTMLInputElement = screen
			.getByTestId('city')
			.querySelector('.MuiFormHelperText-root')!;
		const countryHelperText: HTMLInputElement = screen
			.getByTestId('country')
			.querySelector('.MuiFormHelperText-root')!;

		// Check required input showing "Required" validation
		expect(firstNameHelperText.textContent).toEqual('Required');
		expect(lastNameHelperText.textContent).toEqual('Required');
		expect(genderHelperText.textContent).toEqual('Required');
		expect(birthDateHelperText.textContent).toEqual('Required');
		expect(jobTitleHelperText).toBeNull();
		expect(phoneHelperText).toBeNull();
		expect(emailHelperText.textContent).toEqual('Required');
		expect(addressHelperText.textContent).toEqual('Required');
		expect(cityHelperText.textContent).toEqual('Required');
		expect(countryHelperText.textContent).toEqual('Required');
	});

	it('calls onClose when Close button is clicked', async () => {
		const fireUserEvent = userEvent.setup();

		render(
			<AddEditUserFormDialog
				open={true}
				formMode='ADD'
				onClose={onCloseMock}
			/>,
		);

		await fireUserEvent.click(screen.getByText('Close'));
		expect(onCloseMock).toHaveBeenCalled();
	});
});
