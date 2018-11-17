/**
 * Node.js
 */

const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const config = require('./config');

const handlers = {};
handlers.sample = (data, callback) => { 
  callback(406, { name: 'Sample Handler' }) 
};
handlers.notFound = (data, callback) => { 
  callback(404) 
};
const router = { 
  sample: handlers.sample
};

const server = http.createServer((request, response) => {
  const parsedUrl = url.parse(request.url, true);
  const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
  const queryStringObject = parsedUrl.query;
  const method = request.method.toUpperCase();
  const { headers } = request;
  const decoder = new StringDecoder('utf-8');

  let payload = '';
  request.on('data', (data) => {
    payload = `${payload}${decoder.write(data)}`;
  });
  request.on('end', () => {
    payload = `${payload}${decoder.end()}`;
    let chosenHandler = (typeof(router[path]) !== 'undefined') ? router[path] : handlers.notFound;
    const data = { path, queryStringObject, method, headers, payload };
    chosenHandler(data, (statusCode, payloadParam) => {
      statusCode = (typeof(statusCode) === 'number') ? statusCode : 200;
      payloadParam = (typeof(payloadParam) === 'object') ? payloadParam : {};
      let payloadParamString = JSON.stringify(payloadParam);
      response.setHeader('Content-Type', 'application/json');
      response.writeHead(statusCode)
      response.end(payloadParamString);
      console.log('Returning this response: ', statusCode, payloadParamString);
    });
  });
});

server.listen(config.port, () => {
  console.log(`The server is listening on port ${config.port} in ${config.envName} mode`);
});
