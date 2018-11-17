/**
 * Node.js
 **/

const http = require('http');
const https = require('https');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const config = require('./config');
const fs = require('fs');

const handlers = {};
handlers.ping = (data, callback) => { 
  callback(200); 
};
handlers.notFound = (data, callback) => { 
  callback(404);
};
const router = { 
  ping: handlers.ping,
};

const unifiedServer = (request, response) => {
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
};

const insecureServer = http.createServer((request, response) => {
  unifiedServer(request, response);
});

insecureServer.listen(config.httpPort, () => {
  console.log(`The HTTP server is listening on port ${config.httpPort} in ${config.envName} mode`);
});

const secureServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem'),
};

const secureServer = https.createServer(secureServerOptions, (request, response) => {
  unifiedServer(request, response);
});

secureServer.listen(config.httpsPort, () => {
  console.log(`The HTTPS server is listening on port ${config.httpsPort} in ${config.envName} mode`);
});
