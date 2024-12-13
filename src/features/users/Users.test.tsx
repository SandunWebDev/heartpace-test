import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../../services/redux/store';

import { render, screen, cleanup } from '../../configs/jest/testUtils';
import Users from './Users';

describe('<Users/>', () => {
	beforeEach(() => {
		render(
			<ReduxProvider store={store}>
				<Users />
			</ReduxProvider>,
		);
	});

	afterEach(cleanup);

	it('Users snapshot', () => {
		const { asFragment } = render(
			<ReduxProvider store={store}>
				<Users />
			</ReduxProvider>,
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it('Users get rendered', () => {
		const Users = screen.getByText('Users');
		expect(Users).toBeInTheDocument();
	});
});
