import { Logger } from '@rxpm/logger';
import { TOKEN_SECRET } from './config.js';
import jwt from 'jsonwebtoken';

export const log = new Logger('proxy-server', {
   enable: true,
});

/**
 * Returns parsed string from request body
 * @param {import('http').IncomingMessage} req
 */
export function parseRequestBody(req) {
   return new Promise(function (resolve, reject) {
      let body = '';

      req.on('data', (chunk) => {
         // accumulate the chunks of data
         body += chunk;
      });

      req.on('end', function () {
         resolve(body);
      });

      req.on('error', reject);
   });
}

/**
 * Sends standard HTTP Response
 * @param {import('http').ServerResponse} res
 * @param {number} [status]
 * @param {string} [message]
 * @param {object} [result]
 */
export function sendResponse(res, status = 200, message = 'Ok', result = {}) {
   const content = JSON.stringify({ message, result });

   res.writeHead(status, {
      'Content-Type': 'application/json',
      'Content-Length': content.length,
   });

   res.end(content);
}

/**
 * Returns generated JWT token
 * @param {string|number} id
 */
export function generateToken(id) {
   const payload = { id };

   return jwt.sign(payload, TOKEN_SECRET, {
      expiresIn: '3h',
   });
}

/**
 * Verifies given access token
 * @param {string} token 
 */
export function verifyToken(token) {
   return jwt.verify(token, TOKEN_SECRET);
}
