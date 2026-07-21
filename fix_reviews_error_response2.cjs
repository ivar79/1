const fs = require('fs');
let serverTs = fs.readFileSync('server.ts', 'utf8');

serverTs = serverTs.replace(
  'res.status(500).json({ error: "خطا در دریافت نظرات", details: err.message, stack: err.stack });',
  'console.error("GET REVIEWS ERROR", err.message); res.json([]); // Return empty array on DB failure'
);

fs.writeFileSync('server.ts', serverTs);
