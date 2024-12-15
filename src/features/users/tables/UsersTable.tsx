import { useMemo, useRef, useState } from 'react';
import {
	ColumnDef,
	ColumnFiltersState,
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
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { differenceInYears } from 'date-fns';
import startCase from 'lodash/startCase';

import { User, UserWithExtraData } from '../../../services/mockServer/server';
import AddEditUserFormDialog from '../forms/AddEditUserFormDialog';
import DeleteUserFormDialog from '../forms/DeleteUserFormDialog';
import UsersColumnFilter from '../other/UsersColumnFilter';
import {
	birthDateStringFormatter,
	fuzzyFilter,
} from '../helpers/userTableHelpers';

export interface UsersTableProps {
	userList: User[];
	globalFilter: string;
	setGlobalFilter: (value: string) => void;
	setFilteredUserList: (filteredUserList: UserWithExtraData[]) => void;
}

export default function UsersTable({
	userList,
	globalFilter,
	setGlobalFilter,
	setFilteredUserList,
}: UsersTableProps) {
	const [editUserFormDialogOpenStatus, setEditUserFormDialogOpenStatus] =
		useState(false);
	const [editUserCurrentData, setEditUserCurrentData] =
		useState<UserWithExtraData | null>(null);

	const [deleteUserFormDialogOpenStatus, setDeleteUserFormDialogOpenStatus] =
		useState(false);
	const [deleteUserCurrentId, setDeleteUserCurrentId] = useState<
		UserWithExtraData['id'] | null
	>(null);

	// Adding some additional calculated properties. (age)
	const userListWithAddiData: UserWithExtraData[] = useMemo(() => {
		return userList.map((item) => {
			const birthDate = new Date(item.birthDate);
			const todayDate = new Date();
			const age = differenceInYears(todayDate, birthDate);

			return { ...item, age };
		});
	}, [userList]);

	const columns = useMemo<ColumnDef<UserWithExtraData>[]>(
		() => [
			{
				id: 'actions',
				header: () => <span></span>,
				cell: (info) => {
					return (
						<Box sx={{ display: 'flex' }}>
							<IconButton
								aria-label='Edit User'
								onClick={() => {
									setEditUserCurrentData(() => {
										setEditUserFormDialogOpenStatus(true);

										return info.row.original;
									});
								}}>
								<EditIcon />
							</IconButton>
							<IconButton
								aria-label='Delete User'
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
							component='div'
							sx={{
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								maxWidth: '80px',
								whiteSpace: 'nowrap',
							}}
							title={info.getValue<string>()}>
							{info.getValue<string>()}
						</Typography>
					);
				},
				size: 150,
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
				cell: (info) => startCase(info.getValue<string>()),
				size: 100,
				sortingFn: 'textCaseSensitive',
				sortUndefined: -1,
			},
			{
				accessorKey: 'birthDate',
				header: () => <span>Birth Date</span>,
				cell: (info) => {
					return birthDateStringFormatter(info.getValue<string>());
				},
				size: 175,
				sortingFn: 'datetime',
				sortUndefined: -1,
			},
			{
				accessorKey: 'age',
				header: () => <span>Age</span>,
				cell: (info) => info.getValue(),
				size: 250,
				sortingFn: 'alphanumericCaseSensitive',
				sortUndefined: -1,
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

		onStateChange: () => {
			if (setFilteredUserList) {
				const filteredColumns = table
					.getFilteredRowModel()
					.rows.map((row) => row.original);

				setFilteredUserList(filteredColumns);
			}
		},
	});

	const { rows } = table.getRowModel();

	// The virtualizer needs to know the scrollable container element
	const tableContainerRef = useRef<HTMLDivElement>(null);

	const rowVirtualizer = useVirtualizer({
		count: rows.length,
		estimateSize: () => 73, // estimate row height for accurate scrollbar dragging
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
											<Box sx={{ width: '100%' }}>
												<Box
													data-testid='UsersTable__headerName'
													onClick={header.column.getToggleSortingHandler()}
													sx={{
														width: '100%',
														userSelect: 'none',
														whiteSpace: 'break-spaces',
														cursor: header.column.getCanSort()
															? 'pointer'
															: 'inherit',
													}}>
													<Box sx={{ display: 'flex' }}>
														<Box data-testid='UsersTable__headerName__Text'>
															{flexRender(
																header.column.columnDef.header,
																header.getContext(),
															)}
														</Box>
														<Box data-testid='UsersTable__headerName__SortIndicator'>
															{{
																asc: ' 🔼',
																desc: ' 🔽',
															}[header.column.getIsSorted() as string] ?? null}
														</Box>
													</Box>
												</Box>

												<Box>
													{header.column.getCanFilter() ? (
														<UsersColumnFilter column={header.column} />
													) : null}
												</Box>
											</Box>
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
									data-testid='UsersTable__headerNameText'
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
		</Box>
	);
}
