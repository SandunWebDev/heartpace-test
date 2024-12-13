const config = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/src/configs/jest/setupTests.ts'],
	moduleNameMapper: {
		'\\.(css|less|scss|sass)$	': 'identity-obj-proxy',
		'\\.(jpg|jpeg|png|gif|webp|svg)$':
			'<rootDir>/src/configs/jest/mocks/fileMock.js',
	},
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				tsconfig: 'tsconfig.app.json',
			},
		],
	},
	snapshotResolver: '<rootDir>/src/configs/jest/snapshotResolver.cjs',
	collectCoverageFrom: [
		'src/**/*.{js,jsx,ts,tsx}',
		'!src/**/*.d.ts',
		'!src/**/*.{spec,test}.{js,jsx,ts,tsx}',
		'!**/node_modules/**',
		'!**/vendor/**',
		'!**/dist/**',
		'!**/build/**',
		'!vite.config.ts',
		'!**/coverage/**',
	],
	coveragePathIgnorePatterns: [
		'/node_modules/',
		'setupJest.ts',
		'vite-env.d.ts',
	],
	coverageThreshold: {
		global: {
			statements: 80,
			branches: 80,
			functions: 80,
			lines: 80,
		},
	},
	coverageReporters: ['text'],
};

export default config;
