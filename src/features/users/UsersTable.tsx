import { useMemo, useRef, useState, useCallback } from 'react';
import {
	Column,
	ColumnDef,
	ColumnFiltersState,
	RowData,
	FilterFn,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFacetedMinMaxValues,
	useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { RankingInfo } from '@tanstack/match-sorter-utils';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { differenceInYears } from 'date-fns';
import debounce from 'lodash/debounce';
import startCase from 'lodash/startCase';

import {
	birthDateStringFormatter,
	fuzzyFilter,
} from './helpers/userTableHelpers';
import { User } from '../../services/mockServer/server';
import AddEditUserFormDialog from './forms/AddEditUserFormDialog';
import DeleteUserFormDialog from './forms/DeleteUserFormDialog';
import UsersAgeGroupVsGenderChart from './charts/UsersAgeGroupVsGenderChart';
import UsersCountryChart from './charts/UsersCountryChart';

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

export interface UserListWithAddiData extends User {
	age: number;
}

export interface UsersTableProps {
	userList: User[];
}

export default function UsersTable({ userList }: UsersTableProps) {
	const [addUserFormDialogOpenStatus, setAddUserFormDialogOpenStatus] =
		useState(false);
	const [editUserFormDialogOpenStatus, setEditUserFormDialogOpenStatus] =
		useState(false);
	const [editUserCurrentData, setEditUserCurrentData] = useState(null);

	const [deleteUserFormDialogOpenStatus, setDeleteUserFormDialogOpenStatus] =
		useState(false);
	const [deleteUserCurrentId, setDeleteUserCurrentId] = useState(null);

	// Addding some addtional calulated properties. (age)
	const userListWithAddiData: UserListWithAddiData[] = useMemo(() => {
		return userList.map((item) => {
			const birthDate = new Date(item.birthDate);
			const todayDate = new Date();
			const age = differenceInYears(todayDate, birthDate);

			return { ...item, age };
		});
	}, [userList]);

	const columns = useMemo<ColumnDef<UserListWithAddiData>[]>(
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
										setEditUserFormDialogOpenStatus(true);

										return info.row.original;
									});
								}}>
								<EditIcon />
							</IconButton>
							<IconButton
								sx={{ marginLeft: '-5px' }}
								onClick={() => {
									setDeleteUserCurrentId(() => {
										setDeleteUserFormDialogOpenStatus(true);

										return info.row.original.id;
									});
								}}>
								<DeleteIcon />
							</IconButton>
						</Box>
					);
				},
				size: 90,
				enableSorting: false,
			},
			{
				accessorKey: 'id',
				header: () => <span>ID</span>,
				cell: (info) => {
					return (
						<Typography
							sx={{
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								maxWidth: '80px',
								whiteSpace: 'nowrap',
							}}
							title={info.getValue()}>
							{info.getValue()}
						</Typography>
					);
				},
				size: 100,
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
				cell: (info) => startCase(info.getValue()),
				size: 100,
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
		data: userListWithAddiData,
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

	const filteredUserRows = useMemo(
		() => rows.map((item) => item.original),
		[rows],
	);

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

	const renderDialogs = (
		<>
			<AddEditUserFormDialog
				formMode='ADD'
				open={addUserFormDialogOpenStatus}
				onClose={() => {
					setAddUserFormDialogOpenStatus(false);
				}}
			/>

			<AddEditUserFormDialog
				formMode='EDIT'
				editUserCurrentData={editUserCurrentData}
				open={editUserFormDialogOpenStatus}
				onClose={() => {
					setEditUserFormDialogOpenStatus(false);
				}}
			/>

			<DeleteUserFormDialog
				deleteUserCurrentId={deleteUserCurrentId}
				open={deleteUserFormDialogOpenStatus}
				onClose={() => {
					setDeleteUserFormDialogOpenStatus(false);
				}}
			/>
		</>
	);

	return (
		<Box className='UsersTable'>
			{renderDialogs}

			<Typography variant='h6' gutterBottom>
				Users List
			</Typography>

			<Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
				<Box
					sx={{
						display: 'inline-block',
						border: '1.5px solid gray',
						padding: '15px 25px',
						borderRadius: '4px',
					}}>
					<Typography gutterBottom color='gray'>
						Filtered/Total Users
					</Typography>
					<Typography variant='h5' component='div' sx={{ fontWeight: 'bold' }}>
						{rows.length} / {userListWithAddiData.length}
					</Typography>
				</Box>

				<Box
					sx={{
						marginLeft: 'auto',
					}}>
					<Fab
						color='primary'
						onClick={() => {
							setAddUserFormDialogOpenStatus(true);
						}}>
						<PersonAddAltIcon />
					</Fab>
				</Box>
			</Box>

			<Box sx={{ margin: '30px 0 30px 0' }}>
				<UsersSearch
					value={globalFilter}
					onChange={(value) => {
						setGlobalFilter(value);
					}}
					onClose={() => {
						setGlobalFilter('');
					}}
				/>
			</Box>

			<TableContainer
				className='UsersTableContainer'
				ref={tableContainerRef}
				sx={(theme) => {
					return {
						overflow: 'auto', // our scrollable table container
						position: 'relative', // needed for sticky header
						height: '400px', // should be a fixed height
						border: `1px solid ${theme.palette.grey[200]}`,
						...theme.applyStyles('dark', {
							border: `1px solid ${theme.palette.grey[800]}`,
						}),
					};
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
											sx={(theme) => {
												return {
													display: 'flex',
													width: header.getSize(),
													background: theme.palette.grey[200],
													...theme.applyStyles('dark', {
														background: theme.palette.grey[900],
													}),
												};
											}}
											variant='head'>
											<div style={{ width: '100%' }}>
												<Box
													onClick={header.column.getToggleSortingHandler()}
													sx={{
														width: '100%',
														userSelect: 'none',
														whiteSpace: 'break-spaces',
														cursor: header.column.getCanSort()
															? 'pointer'
															: 'inherit',
													}}>
													{flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
													{{
														asc: ' 🔼',
														desc: ' 🔽',
													}[header.column.getIsSorted() as string] ?? null}
												</Box>

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

			<Box
				sx={(theme) => {
					return {
						display: 'flex',
						width: '100%',
						marginTop: '45px',
						paddingBottom: '35px',
						gap: '80px',
						[theme.breakpoints.down('lg')]: {
							flexWrap: 'wrap',
						},
					};
				}}>
				<UsersAgeGroupVsGenderChart
					title='Users By Age Group'
					filteredUserRows={filteredUserRows}
				/>
				<UsersCountryChart
					title='Users By Continent'
					filteredUserRows={filteredUserRows}
				/>
			</Box>
		</Box>
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

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedSetFacetedUniqueFilterValue = useCallback(
		debounce((changedValue: string | number) => {
			column.setFilterValue(changedValue);
		}, 200),
		[],
	);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedSetFacetedMinMaxFilterMinValue = useCallback(
		debounce((changedValue: string | number) => {
			column.setFilterValue((old: [number, number]) => [
				changedValue,
				old?.[1],
			]);
		}, 200),
		[],
	);

	// eslint-disable-next-line react-hooks/exhaustive-deps
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

					// eslint-disable-next-line react/prop-types
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
			placeholder='Fuzzy Search Users'
			slotProps={{
				input: {
					startAdornment: (
						<InputAdornment position='start'>
							<PersonSearchIcon sx={{ fontSize: '30px' }} />
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
