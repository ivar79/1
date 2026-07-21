const schema = require('./dist/server.cjs').schema;
console.log(Object.keys(schema || {}));
