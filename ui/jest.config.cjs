const jestConfig = {
    verbose: true,
    'transform': {
        '^.+\\.tsx?$': 'babel-jest',
    },
    testMatch: ['**/tests/**/*.ts'],
}

module.exports = jestConfig