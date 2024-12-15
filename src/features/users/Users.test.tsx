import userEvent from '@testing-library/user-event';

import {
	render,
	screen,
	cleanup,
	getByTestId,
	findByTestId,
	getByRole,
	getByText,
	waitFor,
	within,
} from '../../configs/jest/testUtils';
import { User } from '../../services/mockServer/server';
import createMockServer, {
	Server,
	AppRegistry,
} from '../../services/mockServer/server';
import Users from './Users';

const mockUserList: User[] = [
	{
		id: '8b986a7e-f6c8-49e1-910d-cdfc7c1a2f86',
		firstName: 'Nicolas',
		lastName: 'Mitchell',
		country: 'Marshall Islands',
		city: 'Michealstead',
		address: '7654 Kertzmann Tunnel',
		email: 'Nicolas_Mitchell@yahoo.com',
		phone: '(855) 900-0878',
		jobTitle: 'Legacy Communications Designer',
		birthDate: new Date('1978-07-12T16:03:54.090Z'),
		gender: 'male',
	},
	{
		id: '6b042125-686a-43e0-8a68-23cf5bee102e',
		firstName: 'Monica',
		lastName: 'Abbott',
		country: 'Iran',
		city: 'Minatown',
		address: '7031 Christy Grove',
		email: 'Monica_Abbott0@yahoo.com',
		phone: '(570) 410-1335',
		jobTitle: 'Legacy Solutions Specialist',
		birthDate: new Date('1970-03-24T03:31:38.977Z'),
		gender: 'female',
	},
	{
		id: '60866539-4498-4282-9cd7-d18161293135',
		firstName: 'Amanda',
		lastName: 'Lowe',
		country: 'Italy',
		city: 'Aldenstad',
		address: '1544 Connor Pass',
		email: 'Amanda.Lowe54@yahoo.com',
		phone: '(651) 617-8480',
		jobTitle: 'Lead Infrastructure Administrator',
		birthDate: new Date('1971-06-03T17:07:13.353Z'),
		gender: 'female',
	},
	{
		id: '8b48ee23-0707-4a4a-b908-464b728c436e',
		firstName: 'Nelson',
		lastName: 'Greenfelder',
		country: 'Martinique',
		city: 'Melissaboro',
		address: '7258 Center Road',
		email: 'Nelson_Greenfelder@yahoo.com',
		phone: null,
		jobTitle: 'International Response Analyst',
		birthDate: new Date('1978-08-27T07:55:45.607Z'),
		gender: 'male',
	},
	{
		id: 'f8fbb3f0-46c3-4df2-a906-0f6fcd2192b6',
		firstName: 'Julio',
		lastName: 'Wiza',
		country: 'Virgin Islands (British)',
		city: 'Mesquite',
		address: '597 E 12th Street',
		email: 'Julio_Wiza@hotmail.com',
		phone: '(597) 810-6174',
		birthDate: new Date('2004-11-15T19:51:14.094Z'),
		gender: 'other',
	},
];

describe('Users', () => {
	let server: Server<AppRegistry>;

	beforeEach(async () => {
		// This mocking is a must. Because if not our table won't render any rows. (Since we are doing a virtualized table)
		// See github.com/TanStack/virtual/issues/641 for more info
		jest
			.spyOn(Element.prototype, 'getBoundingClientRect')
			.mockImplementation(() => ({
				width: 120,
				height: 120,
				top: 0,
				left: 0,
				bottom: 0,
				right: 0,
				x: 0,
				y: 0,
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				toJSON: () => {},
			}));

		// ****************************
		server = createMockServer('test'); // starting mock server that will mock the fetch calls
		server.createList('user', 5); // making mock server to have 5 initial users

		render(<Users />);

		await waitFor(() => {
			//  waiting userList fetching to be end.
			expect(
				screen.queryByText('Loading', { exact: false }),
			).not.toBeInTheDocument();
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
		cleanup();
		server.shutdown();
	});

	it('renders the table with correct headers and rows', () => {
		// Check headers have pre specified column list
		const headers = screen
			.getAllByRole('columnheader')
			.map((header) => getByTestId(header, 'UsersTable__headerName__Text'));
		expect(headers).toHaveLength(13); // including "actions" column
		expect(headers.map((header) => header.textContent)).toEqual(
			expect.arrayContaining([
				'', // actions column
				'ID',
				'First Name',
				'Last Name',
				'Gender',
				'Birth Date',
				'Age',
				'Job Title',
				'Phone',
				'Email',
				'Address',
				'City',
				'Country',
			]),
		);

		// Check all initial users are rendered
		const rows = screen.getAllByRole('row');
		expect(rows).toHaveLength(mockUserList.length + 1); // +1 for header row
		expect(screen.getByText(mockUserList[0].firstName)).toBeInTheDocument();
		expect(screen.getByText(mockUserList[1].firstName)).toBeInTheDocument();
		expect(screen.getByText(mockUserList[2].firstName)).toBeInTheDocument();
		expect(screen.getByText(mockUserList[3].firstName)).toBeInTheDocument();
		expect(screen.getByText(mockUserList[4].firstName)).toBeInTheDocument();
	});

	it('should be able to globally search users', async () => {
		const fireUserEvent = userEvent.setup();

		// Globally searching user
		const globalSearchInput: HTMLInputElement =
			screen.getByPlaceholderText('Search Users');
		await fireUserEvent.type(globalSearchInput, 'Amanda');

		// Check after global search, only "Amanda" search result is available
		const rows = screen.getAllByRole('row');
		expect(rows).toHaveLength(1 + 1); // +1 for header row
		expect(getByText(rows[1], 'Amanda')).toBeInTheDocument();
	});

	it('should be able to clear global search by clicking on input x button', async () => {
		const fireUserEvent = userEvent.setup();

		const globalSearchInput: HTMLInputElement =
			screen.getByPlaceholderText('Search Users');
		const globalSearchCloseButton: HTMLInputElement = screen.getByTestId(
			'UsersSearch__closeIcon',
		);

		// Check before search is performed close button is not visible
		expect(globalSearchCloseButton).not.toBeVisible();

		// Check after search is performed, only one matching row is available and close button is visible as well
		await fireUserEvent.type(globalSearchInput, 'Amanda');
		const rowsAfterSearch = screen.getAllByRole('row');
		expect(rowsAfterSearch).toHaveLength(1 + 1); // +1 for header row
		expect(getByText(rowsAfterSearch[1], 'Amanda')).toBeInTheDocument();
		expect(globalSearchCloseButton).toBeVisible();

		// Check after closed button is clicked input is cleared and all rows are showing
		await fireUserEvent.click(globalSearchCloseButton);
		expect(globalSearchInput.value).toEqual('');
		const rowsAfterSearchCleared = screen.getAllByRole('row');
		expect(rowsAfterSearchCleared).toHaveLength(mockUserList.length + 1); // +1 for header row
	});

	it('should be able to see how many filtered/total users currently showing', async () => {
		const fireUserEvent = userEvent.setup();

		const globalSearchInput: HTMLInputElement =
			screen.getByPlaceholderText('Search Users');
		const globalSearchCloseButton: HTMLInputElement = screen.getByTestId(
			'UsersSearch__closeIcon',
		);

		// Check after search is performed, filtered/total amount is 1/X
		await fireUserEvent.type(globalSearchInput, 'Amanda');
		const rowsAfterSearch = screen.getAllByRole('row');
		expect(rowsAfterSearch).toHaveLength(1 + 1); // +1 for header row
		expect(screen.getByText('1 / 5')).toBeInTheDocument();

		// Check after search is cleared, filtered/total amount is same.
		await fireUserEvent.click(globalSearchCloseButton);
		const rowsAfterSearchCleared = screen.getAllByRole('row');
		expect(rowsAfterSearchCleared).toHaveLength(mockUserList.length + 1); // +1 for header row
		expect(screen.getByText('5 / 5')).toBeInTheDocument();
	});

	it('should be able to sort by a column', async () => {
		const fireUserEvent = userEvent.setup();

		const firstNameColumn = screen.getByRole('columnheader', {
			name: 'First Name',
		});
		const firstNameSortClickArea = getByTestId(
			firstNameColumn,
			'UsersTable__headerName',
		);

		// Check before sorting, rows are in source order
		const rowsBfSort = screen.getAllByRole('row');
		const firstNameSortIndicatorBfSort1 = getByTestId(
			firstNameColumn,
			'UsersTable__headerName__SortIndicator',
		);
		expect(firstNameSortIndicatorBfSort1.textContent).toEqual('');
		expect(rowsBfSort).toHaveLength(mockUserList.length + 1); // +1 for header row
		expect(rowsBfSort[1].textContent).toContain(mockUserList[0].firstName); // Nicolas
		expect(rowsBfSort[2].textContent).toContain(mockUserList[1].firstName); // Monica
		expect(rowsBfSort[3].textContent).toContain(mockUserList[2].firstName); // Amanda
		expect(rowsBfSort[4].textContent).toContain(mockUserList[3].firstName); // Nelson
		expect(rowsBfSort[5].textContent).toContain(mockUserList[4].firstName); // Julio

		// Check after first sorting click, rows are in "asc" order
		await fireUserEvent.click(firstNameSortClickArea);
		const rowsAfSort1 = screen.getAllByRole('row');
		const firstNameSortIndicatorAfSort1 = getByTestId(
			firstNameColumn,
			'UsersTable__headerName__SortIndicator',
		);
		expect(firstNameSortIndicatorAfSort1.textContent).toContain('🔼');
		expect(rowsAfSort1[1].textContent).toContain('Amanda');
		expect(rowsAfSort1[2].textContent).toContain('Julio');
		expect(rowsAfSort1[3].textContent).toContain('Monica');
		expect(rowsAfSort1[4].textContent).toContain('Nelson');
		expect(rowsAfSort1[5].textContent).toContain('Nicolas');

		// Check after second sorting click, rows are in "dsc" order
		await fireUserEvent.click(firstNameSortClickArea);
		const rowsAfSort2 = screen.getAllByRole('row');
		const firstNameSortIndicatorAfSort2 = getByTestId(
			firstNameColumn,
			'UsersTable__headerName__SortIndicator',
		);
		expect(firstNameSortIndicatorAfSort2.textContent).toContain('🔽');
		expect(rowsAfSort2[1].textContent).toContain('Nicolas');
		expect(rowsAfSort2[2].textContent).toContain('Nelson');
		expect(rowsAfSort2[3].textContent).toContain('Monica');
		expect(rowsAfSort2[4].textContent).toContain('Julio');
		expect(rowsAfSort2[5].textContent).toContain('Amanda');

		// Check after third sorting click, rows are back in original order.
		await fireUserEvent.click(firstNameSortClickArea);
		const rowsAfSort3 = screen.getAllByRole('row');
		const firstNameSortIndicatorAfSort3 = getByTestId(
			firstNameColumn,
			'UsersTable__headerName__SortIndicator',
		);
		expect(firstNameSortIndicatorAfSort3.textContent).toContain('');
		expect(rowsAfSort3[1].textContent).toContain(mockUserList[0].firstName); // Nicolas
		expect(rowsAfSort3[2].textContent).toContain(mockUserList[1].firstName); // Monica
		expect(rowsAfSort3[3].textContent).toContain(mockUserList[2].firstName); // Amanda
		expect(rowsAfSort3[4].textContent).toContain(mockUserList[3].firstName); // Nelson
		expect(rowsAfSort3[5].textContent).toContain(mockUserList[4].firstName); // Julio
	});

	it('should be able to filter rows by a column', async () => {
		const fireUserEvent = userEvent.setup();

		const firstNameColumn = screen.getByRole('columnheader', {
			name: 'First Name',
		});
		const firstNameAutocomplete = await findByTestId(
			firstNameColumn,
			'UserColumnFilter',
		);
		const firstNameAutocompleteInput = await within(
			firstNameAutocomplete,
		).findByRole('combobox');

		// Check before filter is performed, displaying all columns
		const rowsBfFilter = screen.getAllByRole('row');
		expect(rowsBfFilter).toHaveLength(mockUserList.length + 1); // +1 for header row

		// Typing on filter an selecting the option from autocomplete list
		await fireUserEvent.type(firstNameAutocompleteInput, 'Ama'); // Partially typing "Amanda"
		const option = await screen.findByTestId('UserColumnFilter__option');
		expect(option).toBeInTheDocument();
		await userEvent.click(option);

		// Check after filter is performed, only Amanda row is shown
		const rowsAfFilter = screen.getAllByRole('row');
		expect(rowsAfFilter).toHaveLength(1 + 1); // +1 for header row
		expect(rowsAfFilter[1].textContent).toContain('Amanda');
	});

	it('should be able to add new user', async () => {
		const fireUserEvent = userEvent.setup();

		// Check before adding user, rows are same as original number of rows
		const rowsBfAddingUser = screen.getAllByRole('row');
		expect(rowsBfAddingUser).toHaveLength(mockUserList.length + 1); // +1 for header row

		const addUserButton = screen.getByRole('button', { name: 'Add User' });
		await fireUserEvent.click(addUserButton);

		// Checking dialog open
		const addUserDialog = screen.getByRole('dialog', { name: /Add User/i });
		expect(addUserDialog).toBeInTheDocument();

		// Getting reference to each input
		const firstNameInput: HTMLInputElement = getByTestId(
			addUserDialog,
			'firstName',
		).querySelector('input')!;
		const lastNameInput: HTMLInputElement = getByTestId(
			addUserDialog,
			'lastName',
		).querySelector('input')!;
		const genderSelect: HTMLInputElement = getByTestId(addUserDialog, 'gender');
		const genderSelectList = await within(genderSelect).findByRole('combobox');
		const birthDateInput: HTMLInputElement = getByTestId(
			addUserDialog,
			'birthDate',
		).querySelector('input')!;
		const jobTitleInput: HTMLInputElement = getByTestId(
			addUserDialog,
			'jobTitle',
		).querySelector('input')!;
		const phoneInput: HTMLInputElement = getByTestId(
			addUserDialog,
			'phone',
		).querySelector('input')!;
		const emailInput: HTMLInputElement = getByTestId(
			addUserDialog,
			'email',
		).querySelector('input')!;
		const addressInput: HTMLInputElement = getByTestId(
			addUserDialog,
			'address',
		).querySelector('input')!;
		const cityInput: HTMLInputElement = getByTestId(
			addUserDialog,
			'city',
		).querySelector('input')!;
		const countrySelect: HTMLInputElement = getByTestId(
			addUserDialog,
			'country',
		);
		const countrySelectList =
			await within(countrySelect).findByRole('combobox');

		// Inputting Data
		await fireUserEvent.type(firstNameInput, 'John');
		await fireUserEvent.type(lastNameInput, 'Doe');

		await fireUserEvent.click(genderSelectList);
		const genderOptions = await screen.findAllByTestId('gender__option');
		await userEvent.click(genderOptions[0]); // Selecting "Male"

		await fireUserEvent.type(birthDateInput, '1996-05-10');
		await fireUserEvent.type(jobTitleInput, 'Developer');
		await fireUserEvent.type(phoneInput, '76 45874551');
		await fireUserEvent.type(emailInput, 'johndoe@gmail.com');
		await fireUserEvent.type(addressInput, '138, Main Street');
		await fireUserEvent.type(cityInput, 'Sydney');

		await fireUserEvent.click(countrySelectList);
		const countryOptions = await screen.findAllByTestId('country__option');
		await userEvent.click(countryOptions[12]); // Selecting "Australia"

		// Submitting Data
		const submitButton = screen.getByRole('button', { name: /submit/i });
		await fireUserEvent.click(submitButton);

		// Check after user is added, that row is available
		const rowsAfAddUser = screen.getAllByRole('row');
		expect(rowsAfAddUser).toHaveLength(mockUserList.length + 1 + 1); // +1 for header row and "Newly added Row"
		expect(screen.getByText('John')).toBeInTheDocument();
	});

	it('should be able to edit user', async () => {
		const fireUserEvent = userEvent.setup();

		// Get the first row's edit button and invoke it.
		const rows = screen.getAllByRole('row');
		const editUserButton = getByRole(rows[1], 'button', { name: 'Edit User' });
		await fireUserEvent.click(editUserButton);

		// Checking dialog open
		const editUserDialog = screen.getByRole('dialog', { name: /Edit User/i });
		expect(editUserDialog).toBeInTheDocument();

		// Getting reference to each input
		const firstNameInput: HTMLInputElement = getByTestId(
			editUserDialog,
			'firstName',
		).querySelector('input')!;
		const lastNameInput: HTMLInputElement = getByTestId(
			editUserDialog,
			'lastName',
		).querySelector('input')!;
		const genderSelect: HTMLInputElement = getByTestId(
			editUserDialog,
			'gender',
		);
		const genderSelectInput: HTMLInputElement =
			genderSelect.querySelector('input')!;
		const birthDateInput: HTMLInputElement = getByTestId(
			editUserDialog,
			'birthDate',
		).querySelector('input')!;
		const jobTitleInput: HTMLInputElement = getByTestId(
			editUserDialog,
			'jobTitle',
		).querySelector('input')!;
		const phoneInput: HTMLInputElement = getByTestId(
			editUserDialog,
			'phone',
		).querySelector('input')!;
		const emailInput: HTMLInputElement = getByTestId(
			editUserDialog,
			'email',
		).querySelector('input')!;
		const addressInput: HTMLInputElement = getByTestId(
			editUserDialog,
			'address',
		).querySelector('input')!;
		const cityInput: HTMLInputElement = getByTestId(
			editUserDialog,
			'city',
		).querySelector('input')!;
		const countrySelect: HTMLInputElement = getByTestId(
			editUserDialog,
			'country',
		);
		const countrySelectInput: HTMLInputElement =
			countrySelect.querySelector('input')!;

		// Checking individual input values match to edit button clicked row
		expect(firstNameInput.value).toEqual(mockUserList[0].firstName);
		expect(lastNameInput.value).toEqual(mockUserList[0].lastName);
		expect(genderSelectInput.value).toEqual(mockUserList[0].gender);
		expect(birthDateInput.value).toEqual('07/13/1978');
		expect(jobTitleInput.value).toEqual(mockUserList[0].jobTitle);
		expect(phoneInput.value).toEqual(mockUserList[0].phone);
		expect(emailInput.value).toEqual(mockUserList[0].email);
		expect(addressInput.value).toEqual(mockUserList[0].address);
		expect(cityInput.value).toEqual(mockUserList[0].city);
		expect(countrySelectInput.value).toEqual(mockUserList[0].country);

		// Editing some input's values
		await fireUserEvent.clear(firstNameInput);
		await fireUserEvent.type(firstNameInput, 'THIS IS EDITED FIRST NAME');

		// Submitting Data
		const submitButton = screen.getByRole('button', { name: /submit/i });
		await fireUserEvent.click(submitButton);

		// Check after user is edit, that row is consisting edited data.
		const rowsAfEditUser = screen.getAllByRole('row');
		expect(rowsAfEditUser).toHaveLength(mockUserList.length + 1); // +1 for header row
		expect(
			getByText(rowsAfEditUser[1], 'THIS IS EDITED FIRST NAME'),
		).toBeInTheDocument();
	});

	it('should be able to delete user', async () => {
		const fireUserEvent = userEvent.setup();

		// Check before adding user, rows are same as original number of rows
		const rowsBfAddingUser = screen.getAllByRole('row');
		expect(rowsBfAddingUser).toHaveLength(mockUserList.length + 1); // +1 for header row

		// Get the first row's delete button and invoke it.
		const rows = screen.getAllByRole('row');
		const deleteUserButton = getByRole(rows[1], 'button', {
			name: 'Delete User',
		});
		await fireUserEvent.click(deleteUserButton);

		// Checking delete user values match to delete button clicked row
		const deleteUserDialog = screen.getByRole('dialog', {
			name: /Delete User/i,
		});
		expect(deleteUserDialog).toBeInTheDocument();

		// Check delete dialog consist deleting user's data
		expect(
			getByText(deleteUserDialog, mockUserList[0].firstName, { exact: false }),
		).toBeInTheDocument();

		// Submitting Data
		const submitButton = screen.getByRole('button', { name: /delete/i });
		await fireUserEvent.click(submitButton);

		// Check after user is deleted, that row no longer exist
		const rowsAfEditUser = screen.getAllByRole('row');

		expect(rowsAfEditUser).toHaveLength(mockUserList.length + 1 - 1); // +1 for header row, - 1for deleted row
		expect(screen.queryByText(mockUserList[0].firstName)).toBeNull();
	});

	it('should be able to see UsersByAgeGroup chart', () => {
		const chart = screen.getByTestId('UsersAgeGroupVsGenderChart');
		expect(getByText(chart, 'Users By Age Group')).toBeInTheDocument();
	});

	it('should be able to see UsersByContinent chart', () => {
		const chart = screen.getByTestId('UsersCountryChart');
		expect(getByText(chart, 'Users By Continent')).toBeInTheDocument();
	});
});
