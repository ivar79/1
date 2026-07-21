const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(
  'await db.update(schema.productReviews)\n      .set({ isApproved })\n      .where(eq(schema.productReviews.id, id));',
  'await db.update(schema.productReviews)\n      .set({ isApproved })\n      .where(eq(schema.productReviews.id, parseInt(id, 10)));'
);
code = code.replace(
  'await db.delete(schema.productReviews).where(eq(schema.productReviews.id, id));',
  'await db.delete(schema.productReviews).where(eq(schema.productReviews.id, parseInt(id, 10)));'
);
fs.writeFileSync('server.ts', code);
