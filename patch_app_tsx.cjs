const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
if (!code.includes('AdminReviews')) {
  code = code.replace('import AdminBlogEdit from "./pages/AdminBlogEdit";', 'import AdminBlogEdit from "./pages/AdminBlogEdit";\nimport AdminReviews from "./pages/AdminReviews";');
}

// Add route
if (!code.includes('<Route path="reviews" element={<AdminReviews />} />')) {
  code = code.replace('<Route path="blog/new" element={<AdminBlogEdit />} />', '<Route path="blog/new" element={<AdminBlogEdit />} />\n            <Route path="reviews" element={<AdminReviews />} />');
}

fs.writeFileSync('src/App.tsx', code);
