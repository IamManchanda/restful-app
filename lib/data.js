/**
 * Data
 **/

const fs = require('fs');
const path = require('path');

const lib = {};
lib.baseDir = path.join(__dirname, '../.data');

/**
 * Create in CRUD
 * 
 * @Example
 * 
 * const _data = require('./lib/data');
 * _data.create('test', 'myFile', { foo: 'bar' }, (error) => {
 *  (!error) ? console.log('Data created successfully') : console.log('Error: ', error);
 * });
 * 
 **/

lib.create = (dir, file, data, callback) => {
  fs.open(`${lib.baseDir}/${dir}/${file}.json`, 'wx', (error, fileDescriptor) => {
    if (!error && fileDescriptor) {
      const stringData = JSON.stringify(data);
      fs.writeFile(fileDescriptor, stringData, (error) => {
        if (!error) {
          fs.close(fileDescriptor, (error) => {
            if (!error) callback(false);
             else callback('Error closing to new file');
          });
        } else {
          callback('Error writing to new file');
        }
      });
    } else {
      callback('Could not create new file, it may already exists');
    }
  });
};

/**
 * Read in CRUD
 * 
 * @Example
 * 
 * const _data = require('./lib/data');
 * _data.read('test', 'myFile', (error, data) => {
 *  (!error) ? console.log('Data', data) : console.log('Error: ', error);
 * });
 * 
 **/

lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.baseDir}/${dir}/${file}.json`, 'utf8', (error, data) => {
    callback(error, data);
  });
};

/**
 * Update in CRUD
 * 
 * @Example
 * 
 * const _data = require('./lib/data');
 * _data.update('test', 'myFile', { fizz: 'buzz' }, (error) => {
 *  (!error) ? console.log('Data updated successfully') : console.log('Error: ', error);
 * });
 * 
 **/

lib.update = (dir, file, data, callback) => {
  fs.open(`${lib.baseDir}/${dir}/${file}.json`, 'r+', (error, fileDescriptor) => {
    if (!error && fileDescriptor) {
      const stringData = JSON.stringify(data);
      fs.truncate(fileDescriptor, (error) => {
        if (!error) {
          fs.writeFile(fileDescriptor, stringData, (error) => {
            if (!error) {
              fs.close(fileDescriptor, (error) => {
                if (!error) callback(false);
                else callback('Error closing the file');
              });
            } else {
              callback('Error writing to existing file');
            }
          });
        } else {
          callback('Error truncating file');
        }
      });
    } else {
      callback('Could not open the file for updating. It may not exist yet.');
    }
  });
};

/**
 * Delete in CRUD
 * 
 * @Example
 * 
 * const _data = require('./lib/data');
 * _data.delete('test', 'myFile', (error) => {
 *  (!error) ? console.log('Data deleted successfully') : console.log('Error: ', error);
 * });
 * 
 **/

lib.delete = (dir, file, callback) => {
  fs.unlink(`${lib.baseDir}/${dir}/${file}.json`, (error) => {
    if (!error) callback(false); 
    else callback('Error deleting file');
  });
};

module.exports = lib;
