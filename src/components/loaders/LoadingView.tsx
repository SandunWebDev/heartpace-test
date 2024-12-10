import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorIcon from '@mui/icons-material/Error';
import { CSSProperties } from '@mui/styled-engine';

interface LoadingViewProps {
	height?: CSSProperties['height'];
	isLoading: boolean;
	isError: boolean;
	loadingText?: string | null;
	errorText?: string | null;
}
export default function LoadingView({
	height = '300px',
	isLoading,
	isError,
	loadingText,
	errorText,
}: LoadingViewProps) {
	if (!isLoading && !isError) {
		return null;
	}

	return (
		<Paper variant='outlined' square={false}>
			<Box
				sx={() => {
					return {
						height: height,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						textAlign: 'center',
						flexWrap: 'wrap',
					};
				}}>
				{isLoading && (
					<Box>
						<CircularProgress />
						<Typography variant='subtitle1' sx={{ paddingTop: '5px' }}>
							{loadingText}
						</Typography>
					</Box>
				)}
				{!isLoading && isError && (
					<Box>
						<ErrorIcon sx={{ fontSize: '45px' }} color='error' />
						<Typography variant='subtitle1'>{errorText}</Typography>
					</Box>
				)}
			</Box>
		</Paper>
	);
}
