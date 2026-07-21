const fs = require('fs');
let serverTs = fs.readFileSync('server.ts', 'utf8');

const reviewsAPI = `
// REVIEWS API
// -----------------------------------------------------------------------------
app.get("/api/products/:id/reviews", async (req, res) => {
  try {
    const db = getDb();
    const productId = req.params.id;
    const reviews = await db.select()
      .from(schema.productReviews)
      .where(and(eq(schema.productReviews.productId, productId), eq(schema.productReviews.isApproved, true)))
      .orderBy(desc(schema.productReviews.createdAt));
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "خطا در دریافت نظرات" });
  }
});

app.post("/api/products/:id/reviews", async (req, res) => {
  try {
    const db = getDb();
    const productId = req.params.id;
    const { customerName, rating, comment } = req.body;
    
    if (!customerName || !rating || !comment) {
      return res.status(400).json({ success: false, error: "تمامی فیلدها الزامی هستند" });
    }
    
    await db.insert(schema.productReviews).values({
      productId: parseInt(productId, 10),
      customerName,
      rating: parseInt(rating, 10),
      comment,
      isApproved: false // Requires admin approval
    });
    
    res.json({ success: true, message: "نظر شما با موفقیت ثبت شد و پس از تایید نمایش داده می‌شود." });
  } catch (err) {
    res.status(500).json({ success: false, error: "خطا در ثبت نظر" });
  }
});

app.get("/api/admin/reviews", adminAuthMiddleware, async (req, res) => {
  try {
    const db = getDb();
    const reviews = await db.select({
      id: schema.productReviews.id,
      customerName: schema.productReviews.customerName,
      rating: schema.productReviews.rating,
      comment: schema.productReviews.comment,
      isApproved: schema.productReviews.isApproved,
      createdAt: schema.productReviews.createdAt,
      productTitle: schema.products.title,
      productId: schema.products.id
    })
    .from(schema.productReviews)
    .leftJoin(schema.products, eq(schema.productReviews.productId, schema.products.id))
    .orderBy(desc(schema.productReviews.createdAt));
    
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "خطا در دریافت نظرات" });
  }
});

app.patch("/api/admin/reviews/:id", adminAuthMiddleware, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const { isApproved } = req.body;
    
    await db.update(schema.productReviews)
      .set({ isApproved })
      .where(eq(schema.productReviews.id, id));
      
    res.json({ success: true, message: "وضعیت نظر بروزرسانی شد" });
  } catch (err) {
    res.status(500).json({ success: false, error: "خطا در بروزرسانی" });
  }
});

app.delete("/api/admin/reviews/:id", adminAuthMiddleware, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    await db.delete(schema.productReviews).where(eq(schema.productReviews.id, id));
    res.json({ success: true, message: "نظر حذف شد" });
  } catch (err) {
    res.status(500).json({ success: false, error: "خطا در حذف نظر" });
  }
});
`;

serverTs = serverTs.replace('// ORDERS API', reviewsAPI + '\n// ORDERS API');
fs.writeFileSync('server.ts', serverTs);
