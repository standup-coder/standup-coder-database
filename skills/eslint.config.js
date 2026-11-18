export default [
  {
    files: ['tools/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }],
      'no-console': 'off',
      'no-undef': 'error',
      'prefer-const': 'warn',
      'eqeqeq': ['warn', 'smart']
    }
  },
  {
    ignores: ['node_modules/**', 'tools/web/index.html', 'personal/**']
  }
];
