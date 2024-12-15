import userEvent from '@testing-library/user-event';

import { render, screen, cleanup } from '../../../configs/jest/testUtils';
import UsersAddButton from './UsersAddButton';

describe('UsersAddButton Component', () => {
	afterEach(() => {
		jest.clearAllMocks();
		cleanup();
	});

	it('renders the button', () => {
		render(<UsersAddButton />);

		const fabButton = screen.getByRole('button', { name: /Add User/i });
		expect(fabButton).toBeInTheDocument();
	});

	it('opens the add user dialog when the add button is clicked', async () => {
		const fireUserEvent = userEvent.setup();

		render(<UsersAddButton />);

		const fabButton = screen.getByRole('button', { name: /Add User/i });
		await fireUserEvent.click(fabButton);

		const addUserDialog = screen.getByRole('dialog', { name: /Add User/i });
		expect(addUserDialog).toBeInTheDocument();
	});
});
