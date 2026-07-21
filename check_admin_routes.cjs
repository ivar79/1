const fs = require('fs');
const content = fs.readFileSync('server.ts', 'utf8');
const lines = content.split('\n');
const start = lines.findIndex(l => l.includes('app.get("/api/admin/reviews"'));
if (start !== -1) {
  console.log(lines.slice(start, start + 50).join('\n'));
}
