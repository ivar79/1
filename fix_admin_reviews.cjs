const fs = require('fs');
let serverTs = fs.readFileSync('server.ts', 'utf8');

serverTs = serverTs.replace(
  'res.status(500).json({ error: "خطا در دریافت نظرات" });',
  'res.json([]);'
);

fs.writeFileSync('server.ts', serverTs);
