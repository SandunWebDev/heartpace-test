import { useMemo, useCallback } from 'react';
import { Column } from '@tanstack/react-table';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import debounce from 'lodash/debounce';
import startCase from 'lodash/startCase';

import { birthDateStringFormatter } from '../helpers/userTableHelpers';

export default function UsersColumnFilter({
	column,
}: {
	column: Column<any, unknown>;
}) {
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

					let formattedOption: string;
					const columnName = column.id;
					const optionValue = option as string;
					if (columnName === 'birthDate' && option) {
						formattedOption = birthDateStringFormatter(optionValue);
					} else if (columnName === 'id' && optionValue) {
						formattedOption = optionValue.slice(0, 8);
					} else {
						formattedOption = startCase(optionValue);
					}
					return (
						<Box component='li' key={key as string} {...remainingProps}>
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
