import { ReactNode } from 'react';
import Box from '@mui/material/Box';

import AppBar from '../appBar/AppBar';

import './RootLayout.css';

export interface RootLayoutProps {
	children: ReactNode;
}
export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<Box className='RootLayout'>
			<AppBar />
			<Box sx={{ marginTop: '100px' }}>{children}</Box>
		</Box>
	);
}
