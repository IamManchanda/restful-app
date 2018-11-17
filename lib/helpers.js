/*
 * Helpers
 */

const crypto = require('crypto');

const config = require('./config');

const helpers = {};

helpers.hash = (str) => {
  if (typeof (str) === 'string' && str.length > 0) {
    return crypto
      .createHmac('sha256', config.hashingSecret)
      .update(str)
      .digest('hex');
  }
  return false;
};

helpers.parseJsonToObject = (str) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    return {};
  }
};

helpers.createRandomString = (stringLength) => {
  stringLength = (typeof (stringLength) === 'number') && (stringLength > 0) ? stringLength : false;
  if (stringLength) {
    const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let accumulatorString = '';
    for (let index = 1; index <= stringLength; index += 1) {
      const randomCharacter = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length),
      );
      accumulatorString = `${randomCharacter}${accumulatorString}`;
    }
    return accumulatorString;
  }
  return false;
};

module.exports = helpers;
