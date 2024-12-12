import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export interface FormDialog extends DialogProps {
	headerTitle: React.ReactNode;
	onClose: () => void;
}

export default function FormDialog(props: FormDialog) {
	const { headerTitle, onClose, open, children, ...remainingProps } = props;

	return (
		<Dialog
			disableEscapeKeyDown
			fullWidth
			maxWidth='sm'
			open={open}
			{...remainingProps}>
			<DialogTitle
				sx={(theme) => {
					return {
						marginBottom: '25px',
						borderBottom: `1px solid ${theme.palette.grey[400]}`,
						...theme.applyStyles('dark', {
							borderBottom: `1px solid ${theme.palette.grey[600]}`,
						}),
					};
				}}>
				{headerTitle}

				<IconButton
					onClick={() => onClose()}
					sx={(theme) => ({
						position: 'absolute',
						right: 8,
						top: 8,
						color: theme.palette.grey[500],
					})}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent>{children}</DialogContent>
		</Dialog>
	);
}
