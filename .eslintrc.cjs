module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  env: {
    node: true,
    es2022: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  plugins: ['prettier'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  root: true,
};
