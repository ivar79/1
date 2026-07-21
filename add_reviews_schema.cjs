const fs = require('fs');
let schema = fs.readFileSync('src/db/schema.ts', 'utf8');

const reviewSchema = `
export const productReviews = pgTable('product_reviews', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull().references(() => products.id),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment').notNull(),
  isApproved: boolean('is_approved').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const productReviewsRelations = relations(productReviews, ({ one }) => ({
  product: one(products, {
    fields: [productReviews.productId],
    references: [products.id],
  }),
}));
`;

// Also need to add reviews to productsRelations
schema = schema.replace(
  'orders: many(orders),',
  'orders: many(orders),\n  reviews: many(productReviews),'
);

schema = schema + '\n' + reviewSchema;

fs.writeFileSync('src/db/schema.ts', schema);
