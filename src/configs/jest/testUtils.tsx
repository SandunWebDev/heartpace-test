import React, { ReactElement } from 'react';
import { render, queries, within, RenderOptions } from '@testing-library/react';
import { Provider as ReduxProvider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import MuiThemeProvider from '../theme/MuiThemeProvider';
import { store } from '../../services/redux/store';
import * as customQueries from './customQueries';

// All the default providers should goes here. So we don't have to wrap these for each test.
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
	return (
		<MuiThemeProvider>
			<ReduxProvider store={store}>
				<ToastContainer />
				{children}
			</ReduxProvider>
		</MuiThemeProvider>
	);
};

const allQueries = {
	...queries,
	...customQueries,
};

// Re-exporting "React Testing Library's" original "render, screen, within" with our Custom Wrappers and Custom Queries.
const customRender = (
	ui: ReactElement,
	options?: Omit<RenderOptions, 'wrapper' | 'queries'>,
) => render(ui, { wrapper: AllTheProviders, queries: allQueries, ...options });
const customScreen = within(document.body, allQueries);
const customWithin = (element: HTMLElement) => within(element, allQueries);

export * from '@testing-library/react';
export {
	customRender as render,
	customScreen as screen,
	customWithin as within,
};
