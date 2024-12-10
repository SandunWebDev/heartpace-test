import { useMemo, useRef, useState, useCallback } from 'react';
import {
	Column,
	ColumnDef,
	ColumnFiltersState,
	RowData,
	FilterFn,
	SortingFn,
	flexRender,
	sortingFns,
	getCoreRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFacetedMinMaxValues,
	useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
	rankItem,
	compareItems,
	RankingInfo,
} from '@tanstack/match-sorter-utils';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { format } from 'date-fns';
import clsx from 'clsx';
import debounce from 'lodash/debounce';

import { User } from '../../services/mockServer/server';
import { FetchStatus } from '../../services/redux/types';
import AddEditUserFormDialog from './AddEditUserFormDialog';
import DeleteUserFormDialog from './DeleteUserFormDialog';
import UsersAgeGroupVsGenderChart from './UsersAgeGroupVsGenderChart';

declare module '@tanstack/react-table' {
	// Types that allows us to define custom properties for our columns in "meta" property.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface ColumnMeta<TData extends RowData, TValue> {
		filterVariant?: 'text' | 'range';
	}

	// Add fuzzy filter to the filterFns list
	interface FilterFns {
		fuzzy: FilterFn<unknown>;
	}
	interface FilterMeta {
		itemRank: RankingInfo;
	}
}

function birthDateStringFormatter(birthDate: string) {
	const date = new Date(birthDate);
	return format(date, 'yyyy-MM-dd');
}

// Custom Fuzzy Filter to filter globally.
// It filter and sort by the rank information of "rankItem Lib" store the ranking information in the meta data of the row, and return whether the item passed the ranking criteria.
// Essentially this can be used to filter row by their closest matches to the search query.
export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
	const itemRank = rankItem(row.getValue(columnId), value as string);
	addMeta({ itemRank }); // Store the itemRank info
	return itemRank.passed; // Return if the item should be filtered in/out
};

// Custom sroting function to be used with above fuzzyFilter ranking data.
export const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
	let dir = 0;

	// Only sort by rank if the column has ranking information
	if (rowA.columnFiltersMeta[columnId]) {
		dir = compareItems(
			rowA.columnFiltersMeta[columnId]?.itemRank,
			rowB.columnFiltersMeta[columnId]?.itemRank,
		);
	}

	// Provide an alphanumeric fallback for when the item ranks are equal
	return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

interface UsersTableProps {
	userList: User[];
	getAllUsersReqStatus: FetchStatus;
	getAllUsersReqError: string | null;
}

export default function UsersTable({
	userList,
	getAllUsersReqStatus,
	getAllUsersReqError,
}: UsersTableProps) {
	const [addEditUserFormDialogOpenStatus, setAddEditUserFormDialogOpenStatus] =
		useState(false);
	const [editUserCurrentData, setEditUserCurrentData] = useState(null);

	const [
		deleteUserFormDialogOpenStatus,
		setDeleteEditUserFormDialogOpenStatus,
	] = useState(false);
	const [deleteUserCurrentId, setDeleteUserCurrentId] = useState(null);

	const columns = useMemo<ColumnDef<User>[]>(
		() => [
			{
				id: 'actions',
				header: () => <span></span>,
				cell: (info) => {
					return (
						<Box sx={{ display: 'flex' }}>
							<IconButton
								onClick={() => {
									setEditUserCurrentData(() => {
										setAddEditUserFormDialogOpenStatus(true);

										return info.row.original;
									});
								}}>
								<EditIcon />
							</IconButton>
							<IconButton
								onClick={() => {
									setDeleteUserCurrentId(() => {
										setDeleteEditUserFormDialogOpenStatus(true);

										return info.row.original.id;
									});
								}}>
								<DeleteIcon />
							</IconButton>
						</Box>
					);
				},
				size: 100,
				enableSorting: false,
			},
			// This column is only for debug purposes.
			{
				id: 'itemIndex',
				header: () => <span>#</span>,
				cell: (info) => {
					return info.row.index + 1;
				},
				size: 45,
				enableSorting: false,
			},
			{
				accessorKey: 'id',
				header: () => <span>ID</span>,
				cell: (info) => info.getValue(),
				size: 310,
				sortingFn: 'alphanumericCaseSensitive',
			},
			{
				accessorKey: 'firstName',
				header: () => <span>First Name</span>,
				cell: (info) => info.getValue(),
				sortingFn: 'alphanumericCaseSensitive',
				sortUndefined: -1, // Sorting "undefined/null" first in ascending order.
			},
			{
				accessorKey: 'lastName',
				header: () => <span>Last Name</span>,
				cell: (info) => info.getValue(),
				sortingFn: 'textCaseSensitive',
				sortUndefined: -1,
			},
			{
				accessorKey: 'gender',
				header: () => <span>Gender</span>,
				cell: (info) => info.getValue(),
				size: 330,
				sortingFn: 'textCaseSensitive',
				sortUndefined: -1,
			},
			{
				accessorKey: 'birthDate',
				header: () => <span>Birth Date</span>,
				cell: (info) => {
					return birthDateStringFormatter(info.getValue() as string);
				},
				sortingFn: 'datetime',
				sortUndefined: -1,
			},
			{
				accessorKey: 'age',
				header: () => <span>Age</span>,
				cell: (info) => info.getValue(),
				size: 250,
				sortingFn: 'alphanumericCaseSensitive',
				sortUndefined: -1, // Sorting "undefined/null" first in ascending order.
				meta: {
					filterVariant: 'range',
				},
			},
			{
				accessorKey: 'jobTitle',
				header: () => <span>Job Title</span>,
				cell: (info) => info.getValue(),
				size: 250,
				sortingFn: 'textCaseSensitive',
				sortUndefined: -1,
			},
			{
				accessorKey: 'phone',
				header: () => <span>Phone</span>,
				cell: (info) => info.getValue(),
				size: 200,
				sortingFn: 'alphanumericCaseSensitive',
				sortUndefined: -1,
			},
			{
				accessorKey: 'email',
				header: () => <span>Email</span>,
				cell: (info) => info.getValue(),
				size: 300,
				sortingFn: 'alphanumericCaseSensitive',
				sortUndefined: -1,
			},
			{
				accessorKey: 'address',
				header: () => <span>Address</span>,
				cell: (info) => info.getValue(),
				size: 250,
				sortingFn: 'alphanumericCaseSensitive',
				sortUndefined: -1,
			},
			{
				accessorKey: 'city',
				header: () => <span>City</span>,
				cell: (info) => info.getValue(),
				size: 200,
				sortingFn: 'textCaseSensitive',
				sortUndefined: -1,
			},
			{
				accessorKey: 'country',
				header: () => <span>Country</span>,
				cell: (info) => info.getValue(),
				size: 200,
				sortingFn: 'textCaseSensitive',
				sortUndefined: -1,
			},
		],
		[],
	);

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [globalFilter, setGlobalFilter] = useState('');

	const table = useReactTable({
		data: userList,
		columns,
		state: {
			columnFilters,
			globalFilter,
		},
		filterFns: {
			// Define  filter functions that can be used in column definitions
			fuzzy: fuzzyFilter,
		},
		globalFilterFn: 'fuzzy', // Aapply our custom fuzzy filter to the global filter
		sortDescFirst: false, // Sort by all columns in ascending order first (Default is ascending for string columns and descending for number columns)
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,

		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getFacetedMinMaxValues: getFacetedMinMaxValues(),
	});

	const { rows } = table.getRowModel();

	// The virtualizer needs to know the scrollable container element
	const tableContainerRef = useRef<HTMLDivElement>(null);

	const rowVirtualizer = useVirtualizer({
		count: rows.length,
		estimateSize: () => 33, // estimate row height for accurate scrollbar dragging
		getScrollElement: () => tableContainerRef.current,
		// Measure dynamic row height, except in firefox because it measures table border height incorrectly
		measureElement:
			typeof window !== 'undefined' && navigator.userAgent.includes('Firefox')
				? (element) => element?.getBoundingClientRect().height
				: undefined,
		overscan: 5,
	});

	if (getAllUsersReqStatus === 'LOADING') {
		return <CircularProgress />;
	}

	if (getAllUsersReqError) {
		return <Alert severity='error'>{getAllUsersReqError}</Alert>;
	}

	return (
		<div className='UsersTable'>
			<AddEditUserFormDialog
				formMode='EDIT'
				editUserCurrentData={editUserCurrentData}
				open={addEditUserFormDialogOpenStatus}
				onClose={() => {
					setAddEditUserFormDialogOpenStatus(false);
				}}
			/>

			<DeleteUserFormDialog
				deleteUserCurrentId={deleteUserCurrentId}
				open={deleteUserFormDialogOpenStatus}
				onClose={() => {
					setDeleteEditUserFormDialogOpenStatus(false);
				}}
			/>

			<h1>Users Table</h1>

			<div>
				<div>Total Users : {userList.length}</div>
				<div>Filtered Users : {rows.length}</div>
			</div>

			<UsersSearch
				value={globalFilter}
				onChange={(value) => {
					setGlobalFilter(value);
				}}
				onClose={() => {
					setGlobalFilter('');
				}}
			/>

			<TableContainer
				className='UsersTableContainer'
				ref={tableContainerRef}
				sx={{
					overflow: 'auto', // our scrollable table container
					position: 'relative', // needed for sticky header
					height: '400px', // should be a fixed height
				}}>
				{/* Even though we're still using sematic table tags, we must use CSS grid and flexbox for dynamic row heights */}
				<Table sx={{ display: 'grid', minWidth: 450 }} stickyHeader>
					<TableHead
						sx={{
							display: 'grid',
							position: 'sticky',
							top: 0,
							zIndex: 1,
						}}>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								sx={{ display: 'flex', width: '100%' }}>
								{headerGroup.headers.map((header) => {
									return (
										<TableCell
											key={header.id}
											sx={{
												display: 'flex',
												width: header.getSize(),
											}}
											variant='head'>
											<div style={{ width: '100%' }}>
												<div
													onClick={header.column.getToggleSortingHandler()}
													className={clsx(
														'UsersTable__TableHead__columnSortContainer',
														{
															'UsersTable__TableHead__columnSortContainer--sortable':
																header.column.getCanSort(),
														},
													)}>
													{flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
													{{
														asc: ' 🔼',
														desc: ' 🔽',
													}[header.column.getIsSorted() as string] ?? null}
												</div>

												<div>
													{header.column.getCanFilter() ? (
														<ColumnFilter column={header.column} />
													) : null}
												</div>
											</div>
										</TableCell>
									);
								})}
							</TableRow>
						))}
					</TableHead>

					<TableBody
						style={{
							display: 'grid',
							height: `${rowVirtualizer.getTotalSize()}px`, // tells scrollbar how big the table is
							position: 'relative', // needed for absolute positioning of rows
						}}>
						{rowVirtualizer.getVirtualItems().map((virtualRow) => {
							const row = rows[virtualRow.index];
							return (
								<TableRow
									data-index={virtualRow.index} // needed for dynamic row height measurement
									ref={(node) => rowVirtualizer.measureElement(node)} // measure dynamic row height
									key={row.id}
									style={{
										display: 'flex',
										position: 'absolute',
										transform: `translateY(${virtualRow.start}px)`, // this should always be a `style` as it changes on scroll
										width: '100%',
									}}
									hover>
									{row.getVisibleCells().map((cell) => {
										return (
											<TableCell
												key={cell.id}
												sx={{
													display: 'flex',
													width: cell.column.getSize(),
												}}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</TableCell>
										);
									})}
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>

			<UsersAgeGroupVsGenderChart filteredUserRows={rows} />
		</div>
	);
}

function ColumnFilter({ column }: { column: Column<any, unknown> }) {
	const { filterVariant } = column.columnDef.meta ?? {};

	const columnFilterValue = column.getFilterValue();

	const sortedUniqueValues = useMemo(
		() =>
			Array.from(column.getFacetedUniqueValues().keys())
				.sort()
				.slice(0, 2000)
				.filter((n) => n), // Remove null, undefined values
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[column.getFacetedUniqueValues(), filterVariant],
	);

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, react-hooks/exhaustive-deps
	const debouncedSetFacetedUniqueFilterValue = useCallback(
		debounce((changedValue: string | number) => {
			column.setFilterValue(changedValue);
		}, 200),
		[],
	);

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, react-hooks/exhaustive-deps
	const debouncedSetFacetedMinMaxFilterMinValue = useCallback(
		debounce((changedValue: string | number) => {
			column.setFilterValue((old: [number, number]) => [
				changedValue,
				old?.[1],
			]);
		}, 200),
		[],
	);

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, react-hooks/exhaustive-deps
	const debouncedSetFacetedMinMaxFilterMaxValue = useCallback(
		debounce((changedValue: string | number) => {
			column.setFilterValue((old: [number, number]) => [
				old?.[0],
				changedValue,
			]);
		}, 200),
		[],
	);

	if (filterVariant === 'range') {
		return (
			<Box sx={{ display: 'flex', alignItems: 'center', color: 'gray' }}>
				<Autocomplete
					freeSolo
					fullWidth
					size='small'
					value={(columnFilterValue as [number, number])?.[0] ?? ''}
					options={[]}
					onChange={(_e, changedValue) => {
						return debouncedSetFacetedMinMaxFilterMinValue(changedValue ?? '');
					}}
					onInputChange={(_e, changedValue) => {
						return debouncedSetFacetedMinMaxFilterMinValue(changedValue);
					}}
					renderInput={(params) => (
						<TextField {...params} type='number' placeholder={`Min`} />
					)}
				/>
				{'	: '}
				<Autocomplete
					freeSolo
					fullWidth
					size='small'
					value={(columnFilterValue as [number, number])?.[1] ?? ''}
					options={[]}
					onChange={(_e, changedValue) => {
						return debouncedSetFacetedMinMaxFilterMaxValue(changedValue ?? '');
					}}
					onInputChange={(_e, changedValue) => {
						return debouncedSetFacetedMinMaxFilterMaxValue(changedValue);
					}}
					renderInput={(params) => (
						<TextField {...params} type='number' placeholder={`Max`} />
					)}
				/>
			</Box>
		);
	}
	// "text" type. Which is the default.
	else {
		return (
			<Autocomplete
				freeSolo
				fullWidth
				size='small'
				value={columnFilterValue ?? ''}
				options={sortedUniqueValues}
				renderOption={(props, option) => {
					// This is needed beacuse we need to show "birthDate" column value in easy human readable format.
					// Don't use similar "getOptionLabel" for this. Beacuse it add bugs to search result.

					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, react/prop-types
					const { key, ...remainingProps } = props;

					let formattedOption;
					const columnName = column.id;
					if (columnName === 'birthDate' && option) {
						formattedOption = birthDateStringFormatter(option as string);
					} else {
						formattedOption = option as string;
					}
					return (
						<Box key={key as string} {...remainingProps}>
							{formattedOption}
						</Box>
					);
				}}
				onChange={(_e, changedValue) => {
					return column.setFilterValue(changedValue);
				}}
				onInputChange={(_e, changedValue) => {
					return debouncedSetFacetedUniqueFilterValue(changedValue);
				}}
				renderInput={(params) => <TextField {...params} />}
			/>
		);
	}
}

function UsersSearch({
	value,
	onChange,
	onClose,
}: {
	value: string;
	onChange: (value: string) => void;
	onClose?: () => void;
}) {
	return (
		<TextField
			fullWidth
			size='medium'
			variant='filled'
			value={value}
			onChange={(e) => {
				onChange(e.target.value);
			}}
			slotProps={{
				input: {
					startAdornment: (
						<InputAdornment position='start'>
							<PersonSearchIcon />
						</InputAdornment>
					),
					endAdornment: (
						<InputAdornment
							position='end'
							sx={{ display: value ? 'flex' : 'none', cursor: 'pointer' }}
							onClick={onClose}>
							<CloseSharpIcon />
						</InputAdornment>
					),
				},
			}}
		/>
	);
}
