import TextField from '@mui/material/TextField';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import InputAdornment from '@mui/material/InputAdornment';

export default function UsersSearch({
	value,
	onChange,
	onClose,
}: {
	value: string;
	onChange: (value: string) => void;
	onClose?: () => void;
}) {
	return (
		<TextField
			fullWidth
			size='medium'
			variant='filled'
			value={value}
			onChange={(e) => {
				onChange(e.target.value);
			}}
			placeholder='Fuzzy Search Users'
			slotProps={{
				input: {
					startAdornment: (
						<InputAdornment position='start'>
							<PersonSearchIcon sx={{ fontSize: '30px' }} />
						</InputAdornment>
					),
					endAdornment: (
						<InputAdornment
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
