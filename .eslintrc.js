module.exports = {
  env: {
    es6: true,
    browser: true,
  },
  extends: 'airbnb-base',
  rules: {
    // Personal Preferences below ... proffessionally may change 
    'no-param-reassign': 0,
    'no-shadow': 0,
    'no-underscore-dangle': 0,
    'no-unused-vars': 0,
    // Never use `no-console` in a real application... I mean never!
    'no-console': 0,
  },
};
