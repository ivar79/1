require('dotenv').config();
const { Client } = require('pg');

async function fix() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  await client.query('DROP TABLE IF EXISTS product_reviews CASCADE;');
  console.log("Table dropped successfully.");
  process.exit(0);
}
fix().catch(console.error);
