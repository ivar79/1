const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminShowrooms.tsx', 'utf8');

code = code.replace(
  /<button\s+onClick=\{\(\) => handleEditClick\(sr\)\}[\s\S]*?<\/button>/g,
  (match) => {
    if (match.includes("Edit2")) {
      return match + `
                        <button
                          onClick={() => handleDeleteAndBackup(sr)}
                          title="حذف دائمی و دریافت فایل پشتیبان"
                          className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>`;
    }
    return match;
  }
);

fs.writeFileSync('src/pages/AdminShowrooms.tsx', code);
