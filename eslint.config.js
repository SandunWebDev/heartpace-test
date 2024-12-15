import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tsEslint from 'typescript-eslint';
import jest from 'eslint-plugin-jest';

export default tsEslint.config(
	{ ignores: ['dist', 'coverage'] },
	{
		extends: [
			js.configs.recommended,
			...tsEslint.configs.recommendedTypeChecked,
			...tsEslint.configs.stylisticTypeChecked,
		],
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			parserOptions: {
				project: ['./tsconfig.node.json', './tsconfig.app.json'],
				tsconfigRootDir: import.meta.dirname,
			},
		},
		settings: { react: { version: '18.3' } },
		plugins: {
			react: react,
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
		},
		rules: {
			...react.configs.recommended.rules,
			...react.configs['jsx-runtime'].rules,
			...reactHooks.configs.recommended.rules,
			'react-refresh/only-export-components': [
				'warn',
				{ allowConstantExport: true },
			],

			// Disabling some rules.
			'@typescript-eslint/no-misused-promises': 'off', // Beacuse it's inconvinient to use asyn function with React listners. https://github.com/typescript-eslint/typescript-eslint/issues/4619
			'@typescript-eslint/no-floating-promises': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'react-refresh/only-export-components': 'off',
		},
	},

	// Specific linting for testing files.
	{
		files: ['**/*.test.js', '**/*.test.ts', '**/*.test.tsx'],
		plugins: { jest: jest },
		languageOptions: {
			globals: jest.environments.globals.globals,
		},
		rules: {
			'jest/no-disabled-tests': 'warn',
			'jest/no-focused-tests': 'error',
			'jest/no-identical-title': 'error',
			'jest/prefer-to-have-length': 'warn',
			'jest/valid-expect': 'error',
		},
	},
);
