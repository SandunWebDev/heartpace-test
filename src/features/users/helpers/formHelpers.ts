// Some default error texts that will be used with yup validations.
export const errorTexts = {
	required: () => 'Required',
	onlyLetters: () => 'Must only contain letters',
	minChars: (chars: number) => `Must be at least ${chars} characters`,
	maxChars: (chars: number) => `Must be lower than ${chars} characters`,
};
