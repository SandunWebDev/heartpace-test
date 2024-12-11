import axios, { AxiosError } from 'axios';

// For now we are only extracting relevant error message for convenience.
function handleAxiosError(error: any): string {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	return (error?.response?.data?.message ||
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		error?.message ||
		'Unexpected error occured') as string;
}

export default function initializeAxios() {
	// Adding axios global interceptor.
	axios.interceptors.response.use(
		(response) => response,
		(error: AxiosError) => {
			const customizedError = new Error(handleAxiosError(error));
			return Promise.reject(customizedError);
		},
	);
}
