const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminShowrooms.tsx', 'utf8');

const importLucide = code.match(/import\s+{([^}]+)}\s+from\s+["']lucide-react["']/);
if (importLucide && !importLucide[1].includes('Trash2')) {
  code = code.replace(importLucide[0], importLucide[0].replace('}', ', Trash2 }'));
}

const deleteFn = `
  const handleDeleteAndBackup = async (showroom: any) => {
    if (!window.confirm("آیا مطمئن هستید؟ این عملیات ابتدا یک نسخه پشتیبان دانلود کرده و سپس نمایشگاه را برای همیشه حذف می‌کند.")) return;
    
    // Create backup file
    const backupData = JSON.stringify(showroom, null, 2);
    const blob = new Blob([backupData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = \`backup-showroom-\${showroom.id}.json\`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Hard Delete
    try {
      const res = await fetch(\`/api/showrooms/\${showroom.id}/hard\`, {
        method: 'DELETE',
        headers: { Authorization: \`Bearer \${localStorage.getItem('adminToken')}\` }
      });
      if (res.ok) {
        setShowrooms(showrooms.filter(s => s.id !== showroom.id));
      } else {
        alert("خطا در حذف نمایشگاه");
      }
    } catch (error) {
      console.error(error);
      alert("خطا در ارتباط با سرور");
    }
  };
`;

if (!code.includes('handleDeleteAndBackup')) {
  code = code.replace('const [showrooms, setShowrooms]', deleteFn + '\n  const [showrooms, setShowrooms]');
}

// Find the existing actions cell which currently has something like:
// <td className="px-4 py-4">
//   <div className="flex justify-center items-center gap-2">
//     <button onClick={() => toggleShowroomState(s.id)} ...> ... </button>
//     <button onClick={() => { setEditingShowroom(s); setIsModalOpen(true); }} ...> <Edit2 className="w-3.5 h-3.5" /> </button>
//   </div>
// </td>

code = code.replace(
  /<button\s+onClick=\{\(\) => \{\s*setEditingShowroom\(s\);\s*setIsModalOpen\(true\);\s*\}\}[\s\S]*?<\/button>/g,
  (match) => {
    if (match.includes("Edit2")) {
      return match + `
                          <button
                            onClick={() => handleDeleteAndBackup(s)}
                            title="حذف دائمی و دریافت بک‌آپ"
                            className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-xl transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>`;
    }
    return match;
  }
);

fs.writeFileSync('src/pages/AdminShowrooms.tsx', code);
