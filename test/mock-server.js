import http from 'http';

const server = http.createServer(function (req, res) {
   console.log(`${req.method} ${req.url}`);
   res.writeHead(200, { 'Content-Type': 'application/json' });
   res.end('Hello, World!');
});

server.listen(3000, () => {
   console.log('server is running on port 3000');
})
