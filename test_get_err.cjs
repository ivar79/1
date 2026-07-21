const fetch = require('node:fetch');
fetch('http://localhost:3000/api/products/1/reviews').then(r => r.json()).then(console.log).catch(console.error);
