const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const orderDeleteStr = `
app.delete("/api/orders/:id", adminAuthMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const db = getDb();
    await db.delete(schema.orders).where(eq(schema.orders.id, id));
    res.json({ success: true, message: "سفارش با موفقیت حذف شد" });
  } catch (err) {
    console.error("Order delete error:", err);
    res.status(500).json({ success: false, error: "خطا در حذف سفارش" });
  }
});
`;

const showroomDeleteStr = `
app.delete("/api/showrooms/:id/hard", adminAuthMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const db = getDb();
    await db.delete(schema.showrooms).where(eq(schema.showrooms.id, id));
    res.json({ success: true, message: "نمایشگاه با موفقیت حذف شد" });
  } catch (err) {
    console.error("Showroom delete error:", err);
    res.status(500).json({ success: false, error: "خطا در حذف نمایشگاه" });
  }
});
`;

const productDeleteStr = `
app.delete("/api/products/:id/hard", adminAuthMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const db = getDb();
    await db.delete(schema.products).where(eq(schema.products.id, id));
    res.json({ success: true, message: "محصول با موفقیت حذف شد" });
  } catch (err) {
    console.error("Product delete error:", err);
    res.status(500).json({ success: false, error: "خطا در حذف محصول" });
  }
});
`;

if (!code.includes('app.delete("/api/orders/:id"')) {
  code = code.replace('app.get("/api/orders"', orderDeleteStr + '\napp.get("/api/orders"');
}
if (!code.includes('app.delete("/api/showrooms/:id/hard"')) {
  code = code.replace('app.get("/api/showrooms"', showroomDeleteStr + '\napp.get("/api/showrooms"');
}
if (!code.includes('app.delete("/api/products/:id/hard"')) {
  code = code.replace('app.get("/api/products"', productDeleteStr + '\napp.get("/api/products"');
}

fs.writeFileSync('server.ts', code);
