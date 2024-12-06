import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const muiTheme = createTheme({
	colorSchemes: {
		dark: true,
	},
});

interface MuiThemeProviderProps {
	children: React.ReactNode;
}

export default function MuiThemeProvider({ children }: MuiThemeProviderProps) {
	return (
		<ThemeProvider
			theme={muiTheme}
			noSsr // Disable double rendering. https://mui.com/material-ui/customization/dark-mode/#disable-double-rendering
		>
			{/* Enable dark mode for the app's background. */}
			<CssBaseline />

			{children}
		</ThemeProvider>
	);
}
