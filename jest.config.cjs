module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss)$': 'identity-obj-proxy'
  },

  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }]
  },

  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],

  testPathIgnorePatterns: ['/node_modules/'],
};
