import userEvent from '@testing-library/user-event';

import {
	render,
	screen,
	cleanup,
	fireEvent,
	getByTestId,
	getByRole,
	getAllByRole,
} from '../../../configs/jest/testUtils';
import UsersTable, { UsersTableProps } from './UsersTable';
import { User, UserWithExtraData } from '../../../services/mockServer/server';
import { initialPreloadedState } from '../../../services/redux/store';
import {
	useAppDispatch,
	useAppSelector,
	shallowEqual,
} from '../../../services/redux/hooks';
import {
	usersActions,
	usersSelectors,
} from '../../../services/redux/slices/users/usersSlice';

const mockUserList: User[] = [
	{
		country: 'Marshall Islands',
		city: 'Michealstead',
		address: '7654 Kertzmann Tunnel',
		lastName: 'Mitchell',
		firstName: 'Nicolas',
		email: 'Nicolas_Mitchell@yahoo.com',
		phone: '(855) 900-0878',
		jobTitle: 'Legacy Communications Designer',
		birthDate: new Date('1978-07-09T12:03:30.048Z'),
		gender: 'male',
		id: '8b986a7e-f6c8-49e1-910d-cdfc7c1a2f86',
	},
	{
		country: 'Iran',
		city: 'Minatown',
		address: '7031 Christy Grove',
		lastName: 'Abbott',
		firstName: 'Monica',
		email: 'Monica_Abbott0@yahoo.com',
		phone: '(570) 410-1335',
		jobTitle: 'Legacy Solutions Specialist',
		birthDate: new Date('1970-03-20T23:31:14.935Z'),
		gender: 'female',
		id: '6b042125-686a-43e0-8a68-23cf5bee102e',
	},
	{
		country: 'Italy',
		city: 'Aldenstad',
		address: '1544 Connor Pass',
		lastName: 'Lowe',
		firstName: 'Amanda',
		email: 'Amanda.Lowe54@yahoo.com',
		phone: '(651) 617-8480',
		jobTitle: 'Lead Infrastructure Administrator',
		birthDate: new Date('1971-05-31T13:06:49.312Z'),
		gender: 'female',
		id: '60866539-4498-4282-9cd7-d18161293135',
	},
];

const initialReduxState = {
	...initialPreloadedState,
	users: {
		...initialPreloadedState.users,
		userList: mockUserList,
	},
};

const UsersTableWrapper = ({ ...props }: Partial<UsersTableProps>) => {
	const dispatch = useAppDispatch();

	const { userList } = useAppSelector(
		usersSelectors.selectGetAllUsersReqState,
		shallowEqual,
	);

	const globalFilter = useAppSelector(usersSelectors.selectGlobalFilter);
	const setGlobalFilter = (value: string) => {
		dispatch(usersActions.setGlobalFilter(value));
	};

	const setFilteredUserList = (filteredUserList: UserWithExtraData[]) => {
		dispatch(usersActions.setFilteredUserList(filteredUserList));
	};

	return (
		<UsersTable
			{...props}
			userList={userList}
			globalFilter={globalFilter}
			setGlobalFilter={setGlobalFilter}
			setFilteredUserList={setFilteredUserList}
		/>
	);
};

describe('UsersTable', () => {
	beforeEach(() => {
		// This mocking is a must. Because if not our table won't render any rows. (Since we are doing a virtualized table)
		// See github.com/TanStack/virtual/issues/641 for more info.
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
	});

	afterEach(() => {
		jest.clearAllMocks();
		cleanup();
	});

	it('renders the table with correct headers and rows', () => {
		render(<UsersTableWrapper />, { reduxPreloadedState: initialReduxState });

		// Check headers
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

		// Check rows
		const rows = screen.getAllByRole('row');
		expect(rows).toHaveLength(mockUserList.length + 1); // +1 for header row
		expect(screen.getByText(mockUserList[0].firstName)).toBeInTheDocument();
		expect(screen.getByText(mockUserList[1].firstName)).toBeInTheDocument();
		expect(screen.getByText(mockUserList[2].firstName)).toBeInTheDocument();
	});

	it("renders the row's each cell with correctly formatted values", () => {
		render(<UsersTableWrapper />, { reduxPreloadedState: initialReduxState });

		const rows = screen.getAllByRole('row');
		expect(rows).toHaveLength(mockUserList.length + 1); // +1 for header row

		// Checking first row's each cell
		const firstRow = rows[1];
		const firstRowCells = getAllByRole(firstRow, 'cell');
		firstRowCells.forEach((cell, cellIndex) => {
			switch (cellIndex) {
				// action column
				case 0: {
					expect(
						getByRole(cell, 'button', { name: /Edit User/i }),
					).toBeInTheDocument();
					expect(
						getByRole(cell, 'button', { name: /Delete User/i }),
					).toBeInTheDocument();
					break;
				}
				// id column
				case 1: {
					expect(cell.textContent).toEqual(mockUserList[0].id);
					break;
				}
				// firstName column
				case 2: {
					expect(cell.textContent).toEqual(mockUserList[0].firstName);
					break;
				}
				// lastName column
				case 3: {
					expect(cell.textContent).toEqual(mockUserList[0].lastName);
					break;
				}
				// gender column
				case 4: {
					expect(cell.textContent).toEqual('Male');
					break;
				}
				// birthDate column
				case 5: {
					expect(cell.textContent).toEqual('1978-07-09');
					break;
				}
				// age
				case 6: {
					expect(cell.textContent).toEqual('46');
					break;
				}
				// jobTitle column
				case 7: {
					expect(cell.textContent).toEqual(mockUserList[0].jobTitle);
					break;
				}
				// phone column
				case 8: {
					expect(cell.textContent).toEqual(mockUserList[0].phone);
					break;
				}
				// email column
				case 9: {
					expect(cell.textContent).toEqual(mockUserList[0].email);
					break;
				}
				// address column
				case 10: {
					expect(cell.textContent).toEqual(mockUserList[0].address);
					break;
				}
				// city column
				case 11: {
					expect(cell.textContent).toEqual(mockUserList[0].city);
					break;
				}
				// country column
				case 12: {
					expect(cell.textContent).toEqual(mockUserList[0].country);
					break;
				}
			}
		});
	});

	it('opens edit dialog with correct user details when edit button is clicked', () => {
		render(<UsersTableWrapper />, { reduxPreloadedState: initialReduxState });

		const rows = screen.getAllByRole('row');
		expect(rows).toHaveLength(mockUserList.length + 1); // +1 for header row

		// Clicking first row's edit button
		const firstRow = rows[1];
		const editButton = getByRole(firstRow, 'button', { name: /Edit User/i });
		fireEvent.click(editButton);

		// Checking dialog open
		const editDialog = screen.getByRole('dialog', { name: /Edit User/i });
		expect(editDialog).toBeInTheDocument();

		const firstNameInput: HTMLInputElement = getByTestId(
			editDialog,
			'firstName',
		).querySelector('input')!;
		const lastNameInput: HTMLInputElement = getByTestId(
			editDialog,
			'lastName',
		).querySelector('input')!;
		const genderInput: HTMLInputElement = getByTestId(
			editDialog,
			'gender',
		).querySelector('input')!;
		const birthDateInput: HTMLInputElement = getByTestId(
			editDialog,
			'birthDate',
		).querySelector('input')!;
		const jobTitleInput: HTMLInputElement = getByTestId(
			editDialog,
			'jobTitle',
		).querySelector('input')!;
		const phoneInput: HTMLInputElement = getByTestId(
			editDialog,
			'phone',
		).querySelector('input')!;
		const emailInput: HTMLInputElement = getByTestId(
			editDialog,
			'email',
		).querySelector('input')!;
		const addressInput: HTMLInputElement = getByTestId(
			editDialog,
			'address',
		).querySelector('input')!;
		const cityInput: HTMLInputElement = getByTestId(
			editDialog,
			'city',
		).querySelector('input')!;
		const countryInput: HTMLInputElement = getByTestId(
			editDialog,
			'country',
		).querySelector('input')!;

		// Checking individual input values
		expect(firstNameInput.value).toEqual(mockUserList[0].firstName);
		expect(lastNameInput.value).toEqual(mockUserList[0].lastName);
		expect(genderInput.value).toEqual(mockUserList[0].gender);
		expect(birthDateInput.value).toEqual('07/09/1978');
		expect(jobTitleInput.value).toEqual(mockUserList[0].jobTitle);
		expect(phoneInput.value).toEqual(mockUserList[0].phone);
		expect(emailInput.value).toEqual(mockUserList[0].email);
		expect(addressInput.value).toEqual(mockUserList[0].address);
		expect(cityInput.value).toEqual(mockUserList[0].city);
		expect(countryInput.value).toEqual(mockUserList[0].country);
	});

	it('opens delete dialog with correct user details when delete button is clicked', () => {
		const events = userEvent.setup();

		render(<UsersTableWrapper />, { reduxPreloadedState: initialReduxState });

		const rows = screen.getAllByRole('row');
		expect(rows).toHaveLength(mockUserList.length + 1); // +1 for header row

		// Clicking first row's delete button
		const firstRow = rows[1];
		const deleteButton = getByRole(firstRow, 'button', {
			name: /Delete User/i,
		});
		expect(deleteButton).toBeInTheDocument();

		fireEvent.click(deleteButton);
		events.click(deleteButton);

		// Checking dialog open
		const deleteDialog = screen.getByRole('dialog', { name: /Delete User/i });
		expect(deleteDialog).toBeInTheDocument();
		expect(deleteDialog.textContent).toContain(mockUserList[0].firstName);
	});
});
