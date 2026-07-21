const fs = require('fs');
let serverTs = fs.readFileSync('server.ts', 'utf8');

serverTs = serverTs.replace(
  'const productId = req.params.id;',
  'const productId = parseInt(req.params.id, 10);'
);

fs.writeFileSync('server.ts', serverTs);
