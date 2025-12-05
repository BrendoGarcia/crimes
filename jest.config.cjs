module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss)$': 'identity-obj-proxy'
  },

  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { isolatedModules: true }],
    '^.+\\.(js|jsx)$': 'babel-jest'
  },

  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
};
