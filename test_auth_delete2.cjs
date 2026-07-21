const jwt = require('jsonwebtoken');
const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET || 'secret123');
fetch('http://localhost:3000/api/products/1/hard', {
  method: 'DELETE',
  headers: { 'Authorization': 'Bearer ' + token }
}).then(r => r.json()).then(console.log).catch(console.error);
