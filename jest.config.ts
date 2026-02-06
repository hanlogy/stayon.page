/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  coverageProvider: 'v8',
  moduleNameMapper: {
    '@/*': ['app/*'],
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default config;
