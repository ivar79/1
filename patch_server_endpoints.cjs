const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const endpoints = `
app.get("/api/orders/:id/backup", adminAuthMiddleware, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const orderData = await db.select().from(schema.orders).where(eq(schema.orders.id, id));
    if (orderData.length === 0) return res.status(404).json({error: "Not found"});
    const commData = await db.select().from(schema.commissions).where(eq(schema.commissions.orderId, id));
    res.json({ success: true, backup: { order: orderData[0], commissions: commData } });
  } catch(e) { res.status(500).json({error: e.message}); }
});

app.get("/api/products/:id/backup", adminAuthMiddleware, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const prodData = await db.select().from(schema.products).where(eq(schema.products.id, id));
    if (prodData.length === 0) return res.status(404).json({error: "Not found"});
    const orderData = await db.select().from(schema.orders).where(eq(schema.orders.productId, id));
    res.json({ success: true, backup: { product: prodData[0], orders: orderData } });
  } catch(e) { res.status(500).json({error: e.message}); }
});

app.get("/api/showrooms/:id/backup", adminAuthMiddleware, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const srData = await db.select().from(schema.showrooms).where(eq(schema.showrooms.id, id));
    if (srData.length === 0) return res.status(404).json({error: "Not found"});
    const prodData = await db.select().from(schema.products).where(eq(schema.products.showroomId, id));
    const orderData = await db.select().from(schema.orders).where(eq(schema.orders.showroomId, id));
    const commData = await db.select().from(schema.commissions).where(eq(schema.commissions.showroomId, id));
    res.json({ success: true, backup: { showroom: srData[0], products: prodData, orders: orderData, commissions: commData } });
  } catch(e) { res.status(500).json({error: e.message}); }
});

app.delete("/api/orders/:id", adminAuthMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const db = getDb();
    
    // First delete associated commissions
    await db.delete(schema.commissions).where(eq(schema.commissions.orderId, id));
    
    // Then delete the order
    await db.delete(schema.orders).where(eq(schema.orders.id, id));
    
    res.json({ success: true, message: "سفارش با موفقیت حذف شد" });
  } catch (err) {
    console.error("Order delete error:", err);
    res.status(500).json({ success: false, error: "خطا در حذف سفارش" });
  }
});
`;

code = code.replace('app.post("/api/orders",', endpoints + '\\napp.post("/api/orders",');

const cascadeProductCode = `
app.delete("/api/products/:id/hard", adminAuthMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const db = getDb();
    // 1. Find all orders for this product
    const orders = await db.select().from(schema.orders).where(eq(schema.orders.productId, id));
    const orderIds = orders.map(o => o.id);
    
    // 2. Delete commissions for these orders
    for (const oid of orderIds) {
      await db.delete(schema.commissions).where(eq(schema.commissions.orderId, oid));
    }
    
    // 3. Delete the orders
    await db.delete(schema.orders).where(eq(schema.orders.productId, id));
    
    // 4. Delete the product
    await db.delete(schema.products).where(eq(schema.products.id, id));
    
    res.json({ success: true, message: "محصول و تمامی سفارشات مرتبط با موفقیت حذف شدند" });
  } catch (err) {
    console.error("Product cascade delete error:", err);
    res.status(500).json({ success: false, error: "خطا در حذف محصول" });
  }
});
`;

const cascadeShowroomCode = `
app.delete("/api/showrooms/:id/hard", adminAuthMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const db = getDb();
    // 1. Delete all commissions for this showroom
    await db.delete(schema.commissions).where(eq(schema.commissions.showroomId, id));
    
    // 2. Delete all orders for this showroom
    await db.delete(schema.orders).where(eq(schema.orders.showroomId, id));
    
    // 3. Delete all products for this showroom
    await db.delete(schema.products).where(eq(schema.products.showroomId, id));
    
    // 4. Delete showroom
    await db.delete(schema.showrooms).where(eq(schema.showrooms.id, id));
    
    res.json({ success: true, message: "نمایشگاه و تمامی محصولات و سفارشات مرتبط حذف شدند" });
  } catch (err) {
    console.error("Showroom cascade delete error:", err);
    res.status(500).json({ success: false, error: "خطا در حذف نمایشگاه" });
  }
});
`;

code = code.replace(/app\.delete\("\/api\/products\/:id\/hard"[\s\S]*?res\.status\(500\)\.json\(\{ success: false, error: "خطا در حذف محصول" \}\);\s*\}\s*\}\);/g, cascadeProductCode.trim());
code = code.replace(/app\.delete\("\/api\/showrooms\/:id\/hard"[\s\S]*?res\.status\(500\)\.json\(\{ success: false, error: "خطا در حذف نمایشگاه" \}\);\s*\}\s*\}\);/g, cascadeShowroomCode.trim());

fs.writeFileSync('server.ts', code);
