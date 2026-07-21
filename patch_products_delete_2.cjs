const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminProducts.tsx', 'utf8');

code = code.replace(
  /<button\s+onClick=\{\(\) => handleEditClick\(p\)\}[\s\S]*?<\/button>/g,
  (match) => {
    if (match.includes("Edit2")) {
      return match + `
                          <button
                            onClick={() => handleDeleteAndBackup(p)}
                            title="حذف دائمی و دریافت فایل پشتیبان"
                            className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-xl transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>`;
    }
    return match;
  }
);

fs.writeFileSync('src/pages/AdminProducts.tsx', code);
