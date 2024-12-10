import * as React from 'react';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import ColorSchemeSelector from '../colorSchemeSelector/ColorSchemeSelector';

export default function AppBar() {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
		React.useState<null | HTMLElement>(null);

	const isProfileMenuOpen = Boolean(anchorEl);
	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

	const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMobileProfileMenuClose = () => {
		setMobileMoreAnchorEl(null);
	};

	const handleProfileMenuClose = () => {
		setAnchorEl(null);
		handleMobileProfileMenuClose();
	};

	const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setMobileMoreAnchorEl(event.currentTarget);
	};

	const profileMenuId = 'profileMenu';
	const renderProfileMenu = (
		<Menu
			anchorEl={anchorEl}
			anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			transformOrigin={{ horizontal: 'right', vertical: 'top' }}
			id={profileMenuId}
			keepMounted
			open={isProfileMenuOpen}
			onClose={handleProfileMenuClose}
			slotProps={{
				paper: {
					variant: 'outlined',
					elevation: 0,
				},
			}}>
			<MenuItem onClick={handleProfileMenuClose}>Placeholder-1</MenuItem>
			<MenuItem onClick={handleProfileMenuClose}>Placeholder-2</MenuItem>
		</Menu>
	);

	const mobileProfileMenuId = 'mobileProfileMenu';
	const renderMobileMenu = (
		<Menu
			anchorEl={mobileMoreAnchorEl}
			anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			transformOrigin={{ horizontal: 'right', vertical: 'top' }}
			id={mobileProfileMenuId}
			keepMounted
			open={isMobileMenuOpen}
			onClose={handleMobileProfileMenuClose}
			slotProps={{
				paper: {
					variant: 'outlined',
					elevation: 0,
				},
			}}>
			<MenuItem onClick={handleProfileMenuOpen}>
				<IconButton size='small' color='inherit'>
					<AccountCircle />
				</IconButton>
				&nbsp;Profile
			</MenuItem>
		</Menu>
	);

	return (
		<Box sx={{ flexGrow: 1 }}>
			<MuiAppBar position='static'>
				<Toolbar>
					<IconButton
						size='large'
						edge='start'
						color='inherit'
						aria-label='open drawer'
						sx={{ mr: 2 }}>
						<MenuIcon />
					</IconButton>
					<Typography
						variant='h6'
						noWrap
						component='div'
						sx={{ display: { xs: 'none', sm: 'block' } }}>
						HR Lite Dashboard
					</Typography>

					<Box sx={{ flexGrow: 1 }} />
					<ColorSchemeSelector />
					<Box sx={{ display: { xs: 'none', md: 'flex' } }}>
						<IconButton
							size='large'
							edge='end'
							onClick={handleProfileMenuOpen}
							color='inherit'>
							<AccountCircle />
						</IconButton>
					</Box>
					<Box sx={{ display: { xs: 'flex', md: 'none' } }}>
						<IconButton
							size='large'
							onClick={handleMobileMenuOpen}
							color='inherit'>
							<MoreIcon />
						</IconButton>
					</Box>
				</Toolbar>
			</MuiAppBar>

			{renderMobileMenu}
			{renderProfileMenu}
		</Box>
	);
}
