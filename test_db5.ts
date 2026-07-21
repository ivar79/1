import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./src/db/schema";
import { eq, and, desc } from "drizzle-orm";

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL || "postgresql://root:Ad7ZnKhLNgQyq341OfpPLctB@makalu.liara.cloud:34829/postgres" });
  await client.connect();
  const db = drizzle(client, { schema });

  try {
    const reviews = await db.select()
      .from(schema.productReviews)
      .where(and(eq(schema.productReviews.productId, 1), eq(schema.productReviews.isApproved, true)))
      .orderBy(desc(schema.productReviews.createdAt));
    console.log("Success", reviews);
  } catch (err) {
    console.error("Query Error:", err);
  }
  await client.end();
}
run();
