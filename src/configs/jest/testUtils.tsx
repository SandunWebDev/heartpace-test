import React, { PropsWithChildren } from 'react';
import { render, queries, within, RenderOptions } from '@testing-library/react';
import { Provider as ReduxProvider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import MuiThemeProvider from '../theme/MuiThemeProvider';
import { setupStore, AppStore, RootState } from '../../services/redux/store';
import * as customQueries from './customQueries';

// All Queries goes here.
const allQueries = {
	...queries,
	...customQueries,
};

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
	reduxPreloadedState?: Partial<RootState>;
	reduxStore?: AppStore;
}

export function renderWithExtra(
	ui: React.ReactElement,
	{
		// Our custom options.
		reduxPreloadedState = {},
		reduxStore = setupStore(reduxPreloadedState), // Automatically create a store instance if no store was passed in

		// Original "render" function options
		...renderOptions
	}: ExtendedRenderOptions = {},
) {
	// All the default providers should goes here. So we don't have to wrap these for each test.
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
		return (
			<MuiThemeProvider>
				<ReduxProvider store={reduxStore}>
					<ToastContainer />
					{children}
				</ReduxProvider>
			</MuiThemeProvider>
		);
	}

	return {
		reduxStore,
		...render(ui, { wrapper: Wrapper, queries: allQueries, ...renderOptions }),
	};
}

// Re-exporting "React Testing Library's" original "render, screen, within" with our Custom Wrappers and Custom Queries.
const customRender = renderWithExtra;
const customScreen = within(document.body, allQueries);
const customWithin = (element: HTMLElement) => within(element, allQueries);

export * from '@testing-library/react';
export {
	customRender as render,
	customScreen as screen,
	customWithin as within,
};
