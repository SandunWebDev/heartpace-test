import TextField from '@mui/material/TextField';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import InputAdornment from '@mui/material/InputAdornment';

export interface UsersSearchProps {
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
	onClose?: () => void;
}

export default function UsersSearch({
	placeholder = 'Search Users',
	value,
	onChange,
	onClose,
}: UsersSearchProps) {
	return (
		<TextField
			fullWidth
			size='medium'
			variant='filled'
			value={value}
			onChange={(e) => {
				onChange(e.target.value);
			}}
			placeholder={placeholder}
			slotProps={{
				input: {
					startAdornment: (
						<InputAdornment position='start'>
							<PersonSearchIcon sx={{ fontSize: '30px' }} />
						</InputAdornment>
					),
					endAdornment: (
						<InputAdornment
							data-testid='UsersSearch__closeIcon'
							position='end'
							sx={{ display: value ? 'flex' : 'none', cursor: 'pointer' }}
							onClick={onClose}>
							<CloseSharpIcon />
						</InputAdornment>
					),
				},
			}}
		/>
	);
}
