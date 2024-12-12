import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export interface UsersStatusProps {
	totalUserAmount: number;
	filteredUserAmount: number;
}

export default function UsersStatus({
	totalUserAmount,
	filteredUserAmount,
}: UsersStatusProps) {
	return (
		<Box
			sx={{
				display: 'inline-block',
				border: '1.5px solid gray',
				padding: '15px 25px',
				borderRadius: '4px',
			}}>
			<Typography gutterBottom color='gray'>
				Filtered/Total Users
			</Typography>
			<Typography variant='h5' component='div' sx={{ fontWeight: 'bold' }}>
				{filteredUserAmount} / {totalUserAmount}
			</Typography>
		</Box>
	);
}
