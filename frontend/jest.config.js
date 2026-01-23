export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
          module: 'ESNext',
          moduleResolution: 'node',
          target: 'ES2022',
          lib: ['ES2022', 'DOM', 'DOM.Iterable'],
          strict: true,
          skipLibCheck: true,
          baseUrl: '.',
          paths: {
            '@/*': ['./src/*'],
          },
        },
      },
    ],
  },
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  globals: {
    'import.meta': {
      env: {
        VITE_API_URL: 'http://localhost:3000',
        VITE_RICK_AND_MORTY_API: 'https://rickandmortyapi.com/api',
      },
    },
  },
}
