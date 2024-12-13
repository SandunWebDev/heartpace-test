import {
	queryHelpers,
	buildQueries,
	Matcher,
	MatcherOptions,
} from '@testing-library/react';

// Custom query to directly match Cypress "data-cy" elements.
const queryAllByDataCy = (
	container: HTMLElement,
	id: Matcher,
	options?: MatcherOptions,
) => queryHelpers.queryAllByAttribute('data-testid', container, id, options);

const getMultipleError = (_c: Element | null, dataCyValue: string) =>
	`Found multiple elements with the data-test attribute of: ${dataCyValue}`;
const getMissingError = (_c: Element | null, dataCyValue: string) =>
	`Unable to find an element with the data-cy attribute of: ${dataCyValue}`;

const [
	queryByDataCy,
	getAllByDataCy,
	getByDataCy,
	findAllByDataCy,
	findByDataCy,
] = buildQueries(queryAllByDataCy, getMultipleError, getMissingError);

export {
	queryByDataCy,
	queryAllByDataCy,
	getByDataCy,
	getAllByDataCy,
	findAllByDataCy,
	findByDataCy,
};
