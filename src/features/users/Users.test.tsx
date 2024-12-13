import { render, screen } from '@testing-library/react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../../services/redux/store';

import Users from './Users';

describe('TodoForm', () => {
	beforeEach(() => {
		render(
			<ReduxProvider store={store}>
				<Users />
			</ReduxProvider>,
		);
	});

	it('Users', () => {
		const Users = screen.getByText('Users');
		expect(Users).toBeInTheDocument();
	});
});
