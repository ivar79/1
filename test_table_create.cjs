const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL || "postgresql://root:Ad7ZnKhLNgQyq341OfpPLctB@makalu.liara.cloud:34829/postgres" });
async function check() {
  await client.connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS product_reviews (
      id SERIAL PRIMARY KEY,
      product_id INTEGER NOT NULL REFERENCES products(id),
      customer_name VARCHAR(255) NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT NOT NULL,
      is_approved BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("Table created");
  await client.end();
}
check().catch(console.error);
