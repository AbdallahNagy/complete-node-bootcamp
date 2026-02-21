const http = require('http');
const fs = require('fs');
const url = require('url');
const slugify = require('slugify');

const replaceTemplate = (template, product) => {
    let output = template.replace(/{{ProductName}}/g, product.productName);
    output = output.replace(/{{Image}}/g, product.image);
    output = output.replace(/{{Price}}/g, product.price);
    output = output.replace(/{{From}}/g, product.from);
    output = output.replace(/{{Nutrients}}/g, product.nutrients);
    output = output.replace(/{{Quantity}}/g, product.quantity);
    output = output.replace(/{{Description}}/g, product.description);
    output = output.replace(/{{Id}}/g, product.id);
    output = output.replace(/{{NotOrganic}}/g, product.organic ? '' : 'not-organic');
    return output;
};

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/product-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    switch (pathname) {
        case '/overview':
        case '/':
            const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
            const tempOverviewWithCards = tempOverview.replace('{{ProductCards}}', cardsHtml);

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(tempOverviewWithCards);
            break;

        case '/product':
            const product = dataObj[query.id];
            const tempProductWithData = replaceTemplate(tempProduct, product);
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(tempProductWithData);
            break;

        case '/api':
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
            break;

        default:
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>Page not found</h1>');
    }

});

server.listen(3000, '127.0.0.1', () => {
    console.log('server is listening on port 3000');
});