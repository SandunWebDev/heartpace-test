import * as React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton, { IconButtonOwnProps } from '@mui/material/IconButton';
import DarkModeIcon from '@mui/icons-material/DarkModeRounded';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useColorScheme } from '@mui/material/styles';

export default function ColorSchemeSelector(props: IconButtonOwnProps) {
	const { mode, systemMode, setMode } = useColorScheme();
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleMode = (targetMode: 'system' | 'light' | 'dark') => () => {
		setMode(targetMode);
		handleClose();
	};

	// The mode is always undefined on first render.
	if (!mode) {
		return (
			<Box
				sx={(theme) => ({
					verticalAlign: 'bottom',
					display: 'inline-flex',
					width: '2.25rem',
					height: '2.25rem',
					borderRadius: theme.shape.borderRadius,
					border: '1px solid',
					borderColor: theme.palette.divider,
				})}
			/>
		);
	}

	const resolvedMode = (systemMode ?? mode) as 'light' | 'dark';
	const icon = {
		light: <LightModeIcon sx={{ color: 'white' }} />,
		dark: <DarkModeIcon />,
	}[resolvedMode];

	return (
		<React.Fragment>
			<IconButton onClick={handleClick} disableRipple size='small' {...props}>
				{icon}
			</IconButton>

			<Menu
				anchorEl={anchorEl}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				id='colorSchemeSelectorMenu'
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				slotProps={{
					paper: {
						variant: 'outlined',
						elevation: 0,
						sx: {
							my: '4px',
						},
					},
				}}>
				<MenuItem selected={mode === 'system'} onClick={handleMode('system')}>
					System
				</MenuItem>
				<MenuItem selected={mode === 'light'} onClick={handleMode('light')}>
					Light
				</MenuItem>
				<MenuItem selected={mode === 'dark'} onClick={handleMode('dark')}>
					Dark
				</MenuItem>
			</Menu>
		</React.Fragment>
	);
}
