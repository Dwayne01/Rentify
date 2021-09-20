module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'google',
  ],
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  'rules': {
    'require-jsdoc': 'off',
    'semi': ['error', 'never'],
    'no-multiple-empty-lines': ['error', {'max': 1, 'maxBOF': 10}],
    'tabindex-no-positive': 'off',
    'array-callback-return': 'off',
    'object-curly-spacing': 'warn',
    'quotes': [2, 'single', {'allowTemplateLiterals': true}],
    'indent': ['error', 2],
    'space-infix-ops': ['error', {'int32Hint': false}],
    'space-before-function-paren': ['error', 'always'],
    'arrow-spacing': ['error', {'before': true, 'after': true}],
  },
}
