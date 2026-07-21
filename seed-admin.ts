import { getDb } from './src/db/index.js';
import * as schema from './src/db/schema.js';
import bcryptjs from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function seed() {
  try {
    const db = getDb();
    const hash = await bcryptjs.hash('admin12345', 10);
    const existing = await db.select().from(schema.admins).where(eq(schema.admins.username, 'admin'));
    if (existing.length > 0) {
       await db.update(schema.admins).set({ password: hash }).where(eq(schema.admins.username, 'admin'));
       console.log('Admin updated successfully');
    } else {
       await db.insert(schema.admins).values({ username: 'admin', password: hash });
       console.log('Admin inserted successfully');
    }
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}
seed();
