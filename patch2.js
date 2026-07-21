const fs = require('fs');
let c = fs.readFileSync('server.ts', 'utf8');

c = c.replace(/const productId = parseInt\(req\.params\.id, 10\);/g, "const productId = req.params.id;");
c = c.replace(/productTitle: schema\.products\.title,/g, "productTitle: schema.products.name,");

fs.writeFileSync('server.ts', c);
