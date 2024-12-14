import { useState } from 'react';
import userEvent from '@testing-library/user-event';

import { render, screen, cleanup } from '../../../configs/jest/testUtils';
import UsersSearch, { UsersSearchProps } from './UsersSearch';

interface UserSearchWrapperProps extends Partial<UsersSearchProps> {
	mockOnChange: jest.Mock;
	mockOnClose: jest.Mock;
}
const UserSearchWrapper = ({
	mockOnChange,
	mockOnClose,
	...props
}: UserSearchWrapperProps) => {
	const [value, setValue] = useState('');
	mockOnChange.mockImplementation((v: string) => {
		setValue(v);
	});

	mockOnClose.mockImplementation(() => {
		setValue('');
	});

	return (
		<UsersSearch
			{...props}
			value={value}
			onChange={mockOnChange}
			onClose={mockOnClose}
		/>
	);
};

describe('UsersStatus Component', () => {
	afterEach(cleanup);

	it('snapshot', () => {
		const mockOnChange = jest.fn();
		const mockOnClose = jest.fn();

		const { asFragment } = render(
			<UserSearchWrapper
				placeholder='Search Users'
				mockOnChange={mockOnChange}
				mockOnClose={mockOnClose}
			/>,
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it('should be able to type values', async () => {
		const fireUserEvent = userEvent.setup();
		const mockOnChange = jest.fn();
		const mockOnClose = jest.fn();

		render(
			<UserSearchWrapper
				placeholder='Search Users'
				mockOnChange={mockOnChange}
				mockOnClose={mockOnClose}
			/>,
		);

		const input: HTMLInputElement = screen.getByPlaceholderText('Search Users');

		await fireUserEvent.type(input, 'John');

		expect(mockOnChange).toHaveBeenCalledTimes(4);
		expect(input.value).toEqual('John');
	});

	it('should be able to clear existing value', async () => {
		const fireUserEvent = userEvent.setup();
		const mockOnChange = jest.fn();
		const mockOnClose = jest.fn();

		render(
			<UserSearchWrapper
				placeholder='Search Users'
				mockOnChange={mockOnChange}
				mockOnClose={mockOnClose}
			/>,
		);

		const input: HTMLInputElement = screen.getByPlaceholderText('Search Users');
		const closeButton: HTMLInputElement = screen.getByTestId(
			'UsersSearch__closeIcon',
		);

		// Before any value available on input.
		expect(closeButton).not.toBeVisible();

		// After some value available on input.
		await fireUserEvent.type(input, 'John');
		expect(input.value).toEqual('John');
		expect(closeButton).toBeVisible();
		expect(closeButton).toBeInTheDocument();

		// After close button is clicked
		await fireUserEvent.click(closeButton);
		expect(input.value).toEqual('');
		expect(closeButton).not.toBeVisible();
		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});
});
