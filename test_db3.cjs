const { getDb, schema } = require('./dist/server.cjs');
async function run() {
  try {
    const db = getDb();
    const productId = 1;
    const { eq, and, desc } = require('drizzle-orm');
    const reviews = await db.select()
      .from(schema.productReviews)
      .where(and(eq(schema.productReviews.productId, productId), eq(schema.productReviews.isApproved, true)))
      .orderBy(desc(schema.productReviews.createdAt));
    console.log("Success! Reviews count:", reviews.length);
  } catch (err) {
    console.error("Failed:", err.message);
  }
}
run();
