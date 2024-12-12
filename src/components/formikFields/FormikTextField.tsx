import TextField, { TextFieldProps } from '@mui/material/TextField';
import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/material/Box';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { useField, FormikHelpers } from 'formik';

type FormikTextFieldProps<Values> = TextFieldProps & {
	setFieldValue?: FormikHelpers<Values>['setFieldValue'];
};

export default function FormikTextField<Values>({
	label,
	setFieldValue,
	...props
}: FormikTextFieldProps<Values>) {
	const [field, meta] = useField(props.name!);

	if (props.type === 'date') {
		return (
			<Box>
				<FormLabel
					htmlFor={props.id ?? props.name}
					required={props.required}
					disabled={props.disabled}>
					{label}
				</FormLabel>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<DatePicker
						{...field}
						value={new Date(field.value as string)}
						onChange={(value) => {
							setFieldValue?.(field.name, value);
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
				htmlFor={props.id ?? props.name}
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
				value={field.value ?? ''}
			/>
		</>
	);
}
