import axios, { AxiosError } from 'axios';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleAxiosError(error: any): string {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	return (error?.response?.data?.message ||
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		error?.message ||
		'Unexpected error occured') as string;
}

export default function initializeAxios() {
	axios.interceptors.response.use(
		(response) => response,
		(error: AxiosError) => {
			const customizedError = new Error(handleAxiosError(error));
			return Promise.reject(customizedError);
		},
	);
}
