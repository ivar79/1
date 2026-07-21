const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL || "postgresql://root:Ad7ZnKhLNgQyq341OfpPLctB@makalu.liara.cloud:34829/postgres" });

async function sync() {
  await client.connect();
  console.log("Connected to DB");
  await client.query(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      content TEXT NOT NULL,
      excerpt TEXT,
      cover_image TEXT,
      is_published BOOLEAN DEFAULT false NOT NULL,
      published_at TIMESTAMP,
      meta_title TEXT,
      meta_description TEXT,
      view_count INTEGER DEFAULT 0 NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `);
  console.log("blog_posts table created");
  await client.end();
}
sync().catch(console.error);
