const bcrypt = require('bcryptjs');
const args = process.argv.slice(2);
const password = args[0] || 'admin12345';
console.log(bcrypt.hashSync(password, 10));
