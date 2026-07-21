const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const reviewsLink = `
            <NavLink
              to="/admin/reviews"
              className={({ isActive }) =>
                \`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 \${
                  isActive
                    ? "bg-stone-900 text-white shadow-md shadow-stone-200/50"
                    : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"
                }\`
              }
            >
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium text-sm">نظرات</span>
            </NavLink>
`;

if (!code.includes('to="/admin/reviews"')) {
  code = code.replace(
    /(<NavLink[\s\S]*?to="\/admin\/products"[\s\S]*?<\/NavLink>)/,
    '$1\n' + reviewsLink
  );
  
  // Need to import MessageSquare in App.tsx if missing
  if (!code.includes('MessageSquare,')) {
    code = code.replace(/import {([^}]+)} from "lucide-react";/, (m, p1) => {
      return `import {${p1}, MessageSquare} from "lucide-react";`;
    });
  }
}

fs.writeFileSync('src/App.tsx', code);
