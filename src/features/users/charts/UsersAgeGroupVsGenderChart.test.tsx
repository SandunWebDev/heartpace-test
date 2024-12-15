import { PropsWithChildren } from 'react';

import { mockFilteredUserList } from '../../../services/mockServer/userList';
import { render, screen, cleanup } from '../../../configs/jest/testUtils';
import UsersAgeGroupVsGenderChart from './UsersAgeGroupVsGenderChart';

// Recharts mocking for "ResponsiveContainer" error. See https://github.com/recharts/recharts/issues/727
jest.mock('recharts', () => {
	const OriginalModule = jest.requireActual('recharts');
	return {
		...OriginalModule,
		ResponsiveContainer: ({ children }: PropsWithChildren) => (
			<OriginalModule.ResponsiveContainer width={800} height={800}>
				{children}
			</OriginalModule.ResponsiveContainer>
		),
	};
});
const originalConsoleWarn = console.warn;

const defaultProps = {
	title: 'Users Country By Continent Chart',
	filteredUserRows: mockFilteredUserList,
	// height: '500px', // Default
};

describe('UsersAgeGroupVsGenderChart Component', () => {
	beforeEach(() => {
		// Because even with above mock console warn doesn't disappear.
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		console.warn = () => {};
	});

	afterEach(() => {
		jest.clearAllMocks();
		cleanup();
	});

	afterAll(() => {
		console.warn = originalConsoleWarn;
	});

	test('renders the chart with title and default height', () => {
		render(
			<UsersAgeGroupVsGenderChart
				title='Example Title'
				filteredUserRows={mockFilteredUserList}
			/>,
		);

		const chart = screen.getByTestId('UsersAgeGroupVsGenderChart');
		expect(chart).toBeInTheDocument();
		expect(screen.getByText('Example Title')).toBeInTheDocument();
		expect(screen.getByTestId('UsersAgeGroupVsGenderChart')).toHaveStyle({
			height: '500px',
		});
	});

	test('renders with custom height', () => {
		render(<UsersAgeGroupVsGenderChart {...defaultProps} height='800px' />);

		expect(screen.getByTestId('UsersAgeGroupVsGenderChart')).toHaveStyle({
			height: '800px',
		});
	});

	test('renders chart legends appropriate to the given data', () => {
		render(<UsersAgeGroupVsGenderChart {...defaultProps} />);

		expect(screen.getByText('Male')).toBeInTheDocument();
		expect(screen.getByText('Female')).toBeInTheDocument();
		expect(screen.getByText('Other')).toBeInTheDocument();
	});
});
