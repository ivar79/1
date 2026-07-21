const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const orderDeleteCode = `
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

const showroomDeleteCode = `
app.delete("/api/showrooms/:id/hard", adminAuthMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const db = getDb();
    
    // Check if showroom has products
    const p = await db.select().from(schema.products).where(eq(schema.products.showroomId, id)).limit(1);
    if (p.length > 0) {
      return res.status(400).json({ success: false, error: "این نمایشگاه دارای محصول است و قابل حذف نیست" });
    }
    
    // Check if showroom has orders
    const o = await db.select().from(schema.orders).where(eq(schema.orders.showroomId, id)).limit(1);
    if (o.length > 0) {
      return res.status(400).json({ success: false, error: "این نمایشگاه دارای سفارش است و قابل حذف نیست" });
    }
    
    await db.delete(schema.showrooms).where(eq(schema.showrooms.id, id));
    res.json({ success: true, message: "نمایشگاه با موفقیت حذف شد" });
  } catch (err) {
    console.error("Showroom delete error:", err);
    res.status(500).json({ success: false, error: "خطا در حذف نمایشگاه" });
  }
});
`;

const productDeleteCode = `
app.delete("/api/products/:id/hard", adminAuthMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const db = getDb();
    
    // Check if product has orders
    const o = await db.select().from(schema.orders).where(eq(schema.orders.productId, id)).limit(1);
    if (o.length > 0) {
      return res.status(400).json({ success: false, error: "این محصول در یک یا چند سفارش استفاده شده است. ابتدا سفارشات را حذف کنید." });
    }
    
    await db.delete(schema.products).where(eq(schema.products.id, id));
    res.json({ success: true, message: "محصول با موفقیت حذف شد" });
  } catch (err) {
    console.error("Product delete error:", err);
    res.status(500).json({ success: false, error: "خطا در حذف محصول" });
  }
});
`;

code = code.replace(/app\.delete\("\/api\/orders\/:id"[\s\S]*?res\.status\(500\)\.json\(\{ success: false, error: "خطا در حذف سفارش" \}\);\s*\}\s*\}\);/g, orderDeleteCode.trim());
code = code.replace(/app\.delete\("\/api\/showrooms\/:id\/hard"[\s\S]*?res\.status\(500\)\.json\(\{ success: false, error: "خطا در حذف نمایشگاه" \}\);\s*\}\s*\}\);/g, showroomDeleteCode.trim());
code = code.replace(/app\.delete\("\/api\/products\/:id\/hard"[\s\S]*?res\.status\(500\)\.json\(\{ success: false, error: "خطا در حذف محصول" \}\);\s*\}\s*\}\);/g, productDeleteCode.trim());

fs.writeFileSync('server.ts', code);
