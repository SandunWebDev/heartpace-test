import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';

import createMockServer from './services/mockServer/server';
import initializeAxios from './configs/axios';
import MuiThemeProvider from './configs/theme/MuiThemeProvider';
import { store } from './services/redux/store';
import App from './App';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css';

createMockServer();
initializeAxios();

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<MuiThemeProvider>
			<ReduxProvider store={store}>
				<App />
			</ReduxProvider>
		</MuiThemeProvider>
	</StrictMode>,
);
