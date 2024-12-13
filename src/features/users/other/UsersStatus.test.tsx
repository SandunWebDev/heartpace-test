import { render, screen, cleanup } from '../../../configs/jest/testUtils';
import UsersStatus from './UsersStatus';

const defaultProps = {
	filteredUserAmount: 40,
	totalUserAmount: 100,
};

describe('UsersStatus Component', () => {
	afterEach(cleanup);

	it('snapshot', () => {
		const { asFragment } = render(<UsersStatus {...defaultProps} />);
		expect(asFragment()).toMatchSnapshot();
	});

	it('should render ths given values in "filtered / total" format', () => {
		render(<UsersStatus {...defaultProps} />);

		expect(screen.getByText('Filtered/Total Users')).toBeInTheDocument();
		expect(screen.getByText('40 / 100')).toBeInTheDocument();
	});
});
