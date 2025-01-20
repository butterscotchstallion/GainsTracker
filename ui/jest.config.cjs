const jestConfig = {
    verbose: true,
    'transform': {
        '^.+\\.tsx?$': 'babel-jest',
    },
    testMatch: ['**/tests/unit/*.ts'],
}

module.exports = jestConfig