const { dirname, join } = require('path')
const path = require('path')

const jestConfig = require('jest-config/jest.config.js')

const customJestConfig = {
  ...jestConfig,

  testEnvironment: 'jsdom',

  moduleNameMapper: {
    ...jestConfig.moduleNameMapper,

    ...{ '@table/(.*)$': `${__dirname}/../@TDS-TTTable/src/$1` },
  },

  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },

  transformIgnorePatterns: [],
}

module.exports = customJestConfig
