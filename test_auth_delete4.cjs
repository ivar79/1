const { Client } = require('pg');
const jwt = require('jsonwebtoken');
const client = new Client({ connectionString: process.env.DATABASE_URL || "postgresql://root:Ad7ZnKhLNgQyq341OfpPLctB@makalu.liara.cloud:34829/postgres" });
async function run() {
  await client.connect();
  const res = await client.query("SELECT id FROM users WHERE role='admin' LIMIT 1");
  const adminId = res.rows[0].id;
  const token = jwt.sign({ userId: adminId }, process.env.JWT_SECRET || 'fallback_secret');
  const fetchRes = await fetch('http://localhost:3000/api/products/1/hard', {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + token }
  });
  console.log(await fetchRes.json());
  await client.end();
}
run();
