import TextField, { TextFieldProps } from '@mui/material/TextField';
import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/material/Box';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { useField } from 'formik';

interface FormikTextFieldProps extends TextFieldProps {
	setFieldValue: () => void;
}

export default function FormikTextField({
	label,
	setFieldValue,
	...props
}: FormikTextFieldProps) {
	const [field, meta] = useField(props);

	if (props.type === 'date') {
		return (
			<Box>
				<FormLabel
					htmlFor={props.id || props.name}
					required={props.required}
					disabled={props.disabled}>
					{label}
				</FormLabel>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<DatePicker
						{...field}
						{...props}
						value={new Date(field.value)}
						onChange={(value) => {
							setFieldValue(field.name, value);
						}}
						slotProps={{
							textField: {
								variant: 'outlined',
								fullWidth: true,
								size: 'small',
								error: Boolean(meta.touched && meta.error),
								helperText: meta.touched && meta.error,
							},
						}}
					/>
				</LocalizationProvider>
			</Box>
		);
	}

	return (
		<>
			<FormLabel
				htmlFor={props.id || props.name}
				required={props.required}
				disabled={props.disabled}>
				{label}
			</FormLabel>
			<TextField
				fullWidth
				variant='outlined'
				error={Boolean(meta.touched && meta.error)}
				helperText={meta.touched && meta.error}
				{...field}
				{...props}
			/>
		</>
	);
}
