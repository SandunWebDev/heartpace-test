import {
	FilterFn,
	SortingFn,
	RowData,
	sortingFns,
} from '@tanstack/react-table';
import {
	rankItem,
	compareItems,
	RankingInfo,
} from '@tanstack/match-sorter-utils';
import { format } from 'date-fns';

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

// Convert birttDate value to specific display format.
export function birthDateStringFormatter(birthDate: string) {
	const date = new Date(birthDate);
	return format(date, 'yyyy-MM-dd');
}

// Custom Fuzzy Filter to filter things.
// It filter and sort by the rank information of "rankItem Lib" store the ranking information in the meta data of the row, and return whether the item passed the ranking criteria.
// Essentially this can be used to filter row by their closest matches to the search query.
export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
	const itemRank = rankItem(row.getValue(columnId), value as string, {
		threshold: 4, // WORD_STARTS_WITH
	});

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
