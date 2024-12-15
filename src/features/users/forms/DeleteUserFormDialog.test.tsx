import userEvent from '@testing-library/user-event';

import {
	mockUserList,
	mockFilteredUserList,
} from '../../../services/mockServer/userList';
import { render, screen, cleanup } from '../../../configs/jest/testUtils';
import { initialPreloadedState } from '../../../services/redux/store';
import DeleteUserFormDialog from './DeleteUserFormDialog';

const initialReduxState = {
	...initialPreloadedState,
	users: {
		...initialPreloadedState.users,
		userList: mockUserList,
		filteredUserList: mockFilteredUserList,
	},
};
const onCloseMock = jest.fn();

describe('DeleteUserFormDialog Component', () => {
	afterEach(() => {
		jest.clearAllMocks();
		cleanup();
	});

	test('renders the dialog with title', () => {
		const deleteUserData = mockFilteredUserList[0];

		render(
			<DeleteUserFormDialog
				open={true}
				deleteUserCurrentId={deleteUserData.id}
				onClose={onCloseMock}
			/>,
			{ reduxPreloadedState: initialReduxState },
		);

		// Check dialog title
		expect(screen.getByText(/Delete User/i)).toBeInTheDocument();
	});

	test('renders the dialog with deleting user details', () => {
		const deleteUserData = mockFilteredUserList[0];

		render(
			<DeleteUserFormDialog
				open={true}
				deleteUserCurrentId={deleteUserData.id}
				onClose={onCloseMock}
			/>,
			{ reduxPreloadedState: initialReduxState },
		);

		// Check dialog title
		expect(
			screen.getByText(deleteUserData.firstName, { exact: false }),
		).toBeInTheDocument();
		expect(
			screen.getByText(deleteUserData.lastName, { exact: false }),
		).toBeInTheDocument();
	});

	it('calls onClose when Close button is clicked', async () => {
		const fireUserEvent = userEvent.setup();
		const deleteUserData = mockFilteredUserList[0];

		render(
			<DeleteUserFormDialog
				open={true}
				deleteUserCurrentId={deleteUserData.id}
				onClose={onCloseMock}
			/>,
			{ reduxPreloadedState: initialReduxState },
		);

		await fireUserEvent.click(screen.getByText('Close'));
		expect(onCloseMock).toHaveBeenCalled();
	});
});
