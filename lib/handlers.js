/**
 * Handlers
 **/

const helpers = require('./helpers');
const _data = require('./data');

const handlers = {};

handlers.ping = (data, callback) => { 
  callback(200); 
};

handlers.users = (data, callback) => {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  const { method } = data;
  methodInLowerCase = method.toLowerCase();
  if (acceptableMethods.includes(methodInLowerCase)) {
    handlers._users[methodInLowerCase](data, callback);
  } else {
    callback(405);
  }
};

handlers._users = {};

handlers._users.post = (data, callback) => {
  const firstName = (typeof(data.payload.firstName) === 'string') && (data.payload.firstName.trim().length > 0)
    ? data.payload.firstName.trim() : false;
  const lastName = (typeof(data.payload.lastName) === 'string') && (data.payload.lastName.trim().length > 0)
    ? data.payload.lastName.trim() : false;
  const password = (typeof(data.payload.password) === 'string') && (data.payload.password.trim().length > 0)
    ? data.payload.password.trim() : false;
  const phone = (typeof(data.payload.phone) === 'string') && (data.payload.phone.trim().length === 10)
    ? data.payload.phone.trim() : false;
  const tosAgreement = (typeof(data.payload.tosAgreement) === 'boolean') && (data.payload.tosAgreement === true)
    ? true : false;

  if (firstName && lastName && password && phone && tosAgreement) {
    _data.read('users', phone, (error, data) => {
      if (error) {
        const hashedPassword = helpers.hash(password);

        if (hashedPassword) {
          const userObject = { firstName, lastName, hashedPassword, phone, tosAgreement };
          _data.create('users', phone, userObject, (error, data) => {
            if (!error) {
              callback(200);
            } else {
              console.log(error);
              callback(500, {
                'Error': 'Could not create a new user',
              });
            }
          });
        } else {
          callback(500, {
            'Error': 'Could not hash the user\'s password',
          });
        }
      } else {
        callback(400, {
          'Error': 'A user with that phone number already exists',
        });
      }
   });
  } else {
    callback(400, {
      'Error': 'Missing required Fields',
    });
  }
};

handlers._users.get = (data, callback) => {
  const phone = (typeof(data.queryStringObject.phone)  === 'string') && (data.queryStringObject.phone.trim().length === 10)
    ? data.queryStringObject.phone.trim() : false ;
  if (phone) {
    _data.read('users', phone, (error, data) => {
      if (!error && data) {
        delete data.hashedPassword;
        callback(200, data);
      } else {
        callback(404);
      }
    });
  } else {
    callback(404, {
      'Error': 'Missing required fields',
    });
  }
};

handlers._users.put = (data, callback) => {
  const firstName = (typeof(data.payload.firstName) === 'string') && (data.payload.firstName.trim().length > 0)
    ? data.payload.firstName.trim() : false;
  const lastName = (typeof(data.payload.lastName) === 'string') && (data.payload.lastName.trim().length > 0)
    ? data.payload.lastName.trim() : false;
  const password = (typeof(data.payload.password) === 'string') && (data.payload.password.trim().length > 0)
    ? data.payload.password.trim() : false;
  const phone = (typeof(data.payload.phone)  === 'string') && (data.payload.phone.trim().length === 10)
    ? data.payload.phone.trim() : false ;

  if (phone) {
    if (firstName || lastName || password) {
      _data.read('users', phone, (error, userData) => {
        if (!error && userData) {
          if (firstName) userData.firstName = firstName;
          if (lastName) userData.lastName = lastName;
          if (password) userData.hashedPassword = helpers.hash(password);
          _data.update('users', phone, userData, (error) => {
            if (!error) {
              callback(200);
            } else {
              console.log(error);
              callback(500, {
                'Error': 'Could not update the user',
              });
            }
          });
        } else {
          callback(400, {
            'Error': 'The specified user does not exist',
          });
        }
      });
    } else {
      callback(400, {
        'Error': 'Missing fields to update',
      });
    }
  } else {
    callback(400, {
      'Error': 'Missing required field',
    });
  }
};

handlers._users.delete = (data, callback) => {
  const phone = (typeof(data.queryStringObject.phone)  === 'string') && (data.queryStringObject.phone.trim().length === 10)
    ? data.queryStringObject.phone.trim() : false ;
  if (phone) {
    _data.read('users', phone, (error, data) => {
      if (!error && data) {
        _data.delete('users', phone, (error) => {
          if (!error) {
            callback(200);
          } else {
            callback(500, {
              'Error': 'Could not delete the specified user',
            });
          }
        });
      } else {
        callback(400, {
          'Error': 'Could not find the specified user',
        });
      }
    });
  } else {
    callback(404, {
      'Error': 'Missing required fields',
    });
  }
};

handlers.notFound = (data, callback) => { 
  callback(404);
};

module.exports = handlers;
