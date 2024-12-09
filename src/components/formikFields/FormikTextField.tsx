import TextField, { TextFieldProps } from '@mui/material/TextField';
import FormLabel from '@mui/material/FormLabel';
import { useField } from 'formik';

export default function FormikTextField({ label, ...props }: TextFieldProps) {
	const [field, meta] = useField(props);

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
