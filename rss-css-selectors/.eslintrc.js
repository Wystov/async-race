module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'prettier',
    'plugin:prettier/recommended',
    'airbnb-base',
    'standard-with-typescript',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    'no-console': 'off',
    'import/prefer-default-export': 'off',
    'no-plusplus': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'explicit',
        overrides: {
          accessors: 'explicit',
          constructors: 'off',
          methods: 'explicit',
          properties: 'explicit',
          parameterProperties: 'explicit',
        },
      },
    ],
    'max-lines-per-function': ['error', 40],
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-extraneous-class': 'off',
    'class-methods-use-this': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    '@typescript-eslint/lines-between-class-members': 'off',
    '@typescript-eslint/member-delimiter-style': [
      'error',
      { multiline: { delimiter: 'semi' } },
    ],
    'prettier/prettier': ['error', { singleQuote: true }],
  },
};
