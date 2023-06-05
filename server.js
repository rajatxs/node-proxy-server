import http from 'http';
import HttpProxy from 'http-proxy';
import { PORT, TARGET_URL } from './config.js';
import { log, sendResponse, verifyToken } from './utils.js';
import { handlePingRequest, handleTokenRequest } from './handlers.js';
import { parse } from 'url';

const proxy = HttpProxy.createProxyServer({
   secure: false,
   ssl: false,
});

const server = http.createServer(async function (req, res) {
   res.setHeader('Access-Control-Allow-Origin', '*');

   try {
      const url = parse(String(req.url), true);

      switch (url.pathname) {
         case '/x/token': {
            await handleTokenRequest(req, res);
            break;
         }

         case '/x/ping': {
            handlePingRequest(req, res);
            break;
         }

         default: {
            let token = req.headers['x-access-token'];

            if (!token) {
               sendResponse(res, 400, "Token is missing");
            } else {
               if (Array.isArray(token)) {
                  token = token[0];
               }

               try {
                  verifyToken(token);
                  proxy.web(req, res, { target: TARGET_URL });
               } catch (error) {
                  sendResponse(res, 400, "Invalid token");
               }
            }
            break;
         }
      }
   } catch (error) {
      log.error('server', error);
      sendResponse(res, 500, 'Something went wrong!');
   }
});

proxy.on('error', function (err, req, res) {
   log.error('server', err);

   // @ts-ignore
   sendResponse(res, 500, 'Something went wrong!');
});

server.listen(PORT, function () {
   log.info('server', 'listening on port=%s, targetUrl=%s', PORT, TARGET_URL);
});
