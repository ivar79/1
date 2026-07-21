const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '{ path: "/admin/products", name: "مدیریت گالری مبل‌ها", icon: <Sofa className="w-4 h-4" /> },',
  '{ path: "/admin/products", name: "مدیریت گالری مبل‌ها", icon: <Sofa className="w-4 h-4" /> },\n    { path: "/admin/reviews", name: "مدیریت نظرات خریداران", icon: <MessageSquare className="w-4 h-4" /> },'
);

fs.writeFileSync('src/App.tsx', code);
