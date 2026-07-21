const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL || "postgresql://root:Ad7ZnKhLNgQyq341OfpPLctB@makalu.liara.cloud:34829/postgres" });
async function check() {
  await client.connect();
  const res = await client.query(`SELECT id FROM showrooms LIMIT 1`);
  console.log(res.rows);
  await client.end();
}
check().catch(console.error);
