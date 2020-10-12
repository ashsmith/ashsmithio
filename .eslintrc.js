module.exports = {
  "parser": '@typescript-eslint/parser',
  "extends": ['airbnb-typescript'],
  "env": {
    "browser": true,
    "es6": true,
  },
  "plugins": [
    "react",
  ],
  "globals": {
    "graphql": false,
  },
  "parserOptions": {
    "project": ['./tsconfig.json']
  },
  "rules": {
    "react/prop-types": 0,
    "jsx-a11y/anchor-is-valid": 0
  }
}
