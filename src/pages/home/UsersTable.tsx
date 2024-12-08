import { useMemo, useRef } from 'react';
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { User } from '../../services/mockServer/server';

interface UsersTableProps {
	userList: User[];
}

export default function UsersTable({ userList }: UsersTableProps) {
	const columns = useMemo<ColumnDef<User>[]>(
		() => [
			{
				accessorKey: '#',
				header: () => <span>#</span>,
				cell: (info) => {
					return info.row.index + 1;
				},
				size: 45,
			},
			{
				accessorKey: 'id',
				header: () => <span>ID</span>,
				cell: (info) => info.getValue(),
				size: 310,
			},
			{
				accessorKey: 'firstName',
				header: () => <span>First Name</span>,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'lastName',
				header: () => <span>Last Name</span>,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'gender',
				header: () => <span>Gender</span>,
				cell: (info) => info.getValue(),
				size: 330,
			},
			{
				accessorKey: 'birthDate',
				header: () => <span>Birth Date</span>,
				cell: (info) => {
					return new Date(info.getValue() as string).toDateString();
				},
			},
			{
				accessorKey: 'jobTitle',
				header: () => <span>Job Title</span>,
				cell: (info) => info.getValue(),
				size: 250,
			},
			{
				accessorKey: 'phone',
				header: () => <span>Phone</span>,
				cell: (info) => info.getValue(),
				size: 200,
			},
			{
				accessorKey: 'email',
				header: () => <span>Email</span>,
				cell: (info) => info.getValue(),
				size: 300,
			},
			{
				accessorKey: 'address',
				header: () => <span>Address</span>,
				cell: (info) => info.getValue(),
				size: 250,
			},
			{
				accessorKey: 'city',
				header: () => <span>City</span>,
				cell: (info) => info.getValue(),
				size: 200,
			},
			{
				accessorKey: 'country',
				header: () => <span>Country</span>,
				cell: (info) => info.getValue(),
				size: 200,
			},
		],
		[],
	);

	const table = useReactTable({
		data: userList,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		debugTable: process.env.NODE_ENV === 'development',
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

	return (
		<div>
			<h1>Users Table</h1>

			<TableContainer
				className='usersTableContainer'
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
											<div
												{...{
													className: header.column.getCanSort()
														? 'cursor-pointer select-none'
														: '',
													onClick: header.column.getToggleSortingHandler(),
												}}>
												{flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
												{{
													asc: ' 🔼',
													desc: ' 🔽',
												}[header.column.getIsSorted() as string] ?? null}
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
		</div>
	);
}
