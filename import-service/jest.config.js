const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.paths.json');
module.exports = {
    roots: [
        '<rootDir>'
    ],
    testMatch: [
        '**/__tests__/**/*.+(ts|tsx|js)',
        '**/?(*.)+(spec|test).+(ts|tsx|js)'
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
        '^.+\\.(js|jsx)$': 'babel-jest'
    },
    collectCoverageFrom: [
        '**/*.{js,jsx,ts,tsx}',
        '!**/*.d.ts',
        '!**/node_modules/**',
        '!.serverless/**',
        '!.webpack/**',
    ],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
            babelConfig: {
                env: {
                    test: {
                        plugins: ["dynamic-import-node"],
                    }
                }
            }
        },
    },
}