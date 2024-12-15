import { Column } from '@tanstack/react-table';

import {
	render,
	screen,
	cleanup,
	within,
} from '../../../configs/jest/testUtils';
import UsersColumnFilter from './UsersColumnFilter';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const mockColumn: Column<any, unknown> = {
	id: 'firstName',
	depth: 0,
	columnDef: {
		filterFn: 'auto',
		sortingFn: 'alphanumericCaseSensitive',
		sortUndefined: -1,
		aggregationFn: 'auto',
		size: 150,
		minSize: 20,
		maxSize: 9007199254740991,
		accessorKey: 'firstName',
	},
	columns: [],
	getFilterValue: () => '',
	getFacetedUniqueValues: () =>
		new Map([
			['Nicolas', 1],
			['Monica', 1],
			['Amanda', 1],
			['Nelson', 1],
			['Julio', 1],
		]),
	setFilterValue: () => null,
};

describe('UsersColumnFilter Component', () => {
	afterEach(() => {
		jest.clearAllMocks();
		cleanup();
	});

	it('renders autocomplete filter by default', async () => {
		render(<UsersColumnFilter column={mockColumn} />);

		const filterComp = screen.getByTestId('UserColumnFilter');
		const filterInput = await within(filterComp).findByRole('combobox');

		expect(filterInput).toBeInTheDocument();
	});
});
