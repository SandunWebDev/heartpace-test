import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import AppBar from '../appBar/AppBar';

export interface RootLayoutProps {
	children: ReactNode;
}
export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<Box>
			<AppBar /> {children}
		</Box>
	);
}
