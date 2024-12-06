import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import MuiThemeProvider from './configs/theme/MuiThemeProvider';
import App from './App';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<MuiThemeProvider>
			<App />
		</MuiThemeProvider>
	</StrictMode>,
);
