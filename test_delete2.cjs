const { eq } = require('drizzle-orm');
const schema = require('./dist/server.cjs').schema;
const getDb = require('./dist/server.cjs').getDb;

console.log(typeof getDb);
