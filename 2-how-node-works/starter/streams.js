const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
    const readStream = fs.createReadStream(`${__dirname}/test-file.txt`, 'utf-8');
    readStream.pipe(res);

    readStream.on('error', err => {
        res.statusCode = 500;
        res.end('File not found');
    });
});

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});