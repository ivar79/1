const fs = require('fs');
const content = fs.readFileSync('server.ts', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(1315, 1335).join('\n'));
