const fs = require('fs');
const content = fs.readFileSync('server.ts', 'utf8');
const lines = content.split('\n');
const start = lines.findIndex(l => l.includes('app.post("/api/admin/settings"'));
if (start !== -1) {
  console.log(lines.slice(start, start + 30).join('\n'));
}
