module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    // project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    // sourceType: 'module',
  },
  env: {
    node: true,
    es2022: true,
  },
  ignorePatterns: [".eslintrc.js"],
  root: true,
};
