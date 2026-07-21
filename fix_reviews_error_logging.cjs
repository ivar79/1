const fs = require('fs');
let serverTs = fs.readFileSync('server.ts', 'utf8');

serverTs = serverTs.replace(
  'res.status(500).json({ error: "خطا در دریافت نظرات" });',
  'console.error("GET REVIEWS ERROR", err); res.status(500).json({ error: "خطا در دریافت نظرات" });'
);

fs.writeFileSync('server.ts', serverTs);
