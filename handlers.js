import { ADMIN_PSWD } from './config.js';
import { log, parseRequestBody, sendResponse, generateToken } from './utils.js';

/**
 * Sends generated Access Token
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
export async function handleTokenRequest(req, res) {
   const password = await parseRequestBody(req);
   let ipAddress, token;

   if (password !== ADMIN_PSWD) {
      return sendResponse(res, 400, 'Incorrect password');
   }

   ipAddress =
      req.socket.remoteAddress ||
      req.headers['x-forwarded-for'] ||
      req.headers['x-real-ip'] ||
      '127.0.0.1';

   if (Array.isArray(ipAddress)) {
      ipAddress = ipAddress[0];
   }

   token = generateToken(ipAddress);
   log.info('token', 'generated ip=%s', ipAddress);
   return sendResponse(res, 200, 'token generated', { token });
}

/**
 * Handles Simple Ping request
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
export function handlePingRequest(req, res) {
   return sendResponse(res, 200, 'Pong!');
}
