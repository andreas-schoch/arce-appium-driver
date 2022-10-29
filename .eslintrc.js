module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // '@appium/eslint-config-appium'
  ],
  rules: {
    '@typescript-eslint/ban-ts-comment': 0,
    'no-multi-spaces': 2,
    quotes: [2, 'single', {
      avoidEscape: true,
      allowTemplateLiterals: true,
    }],
  }
};
