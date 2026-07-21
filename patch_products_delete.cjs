const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminProducts.tsx', 'utf8');

const deleteFn = `
  const handleDeleteAndBackup = async (product: any) => {
    if (!window.confirm("آیا مطمئن هستید؟ این عملیات ابتدا یک نسخه پشتیبان دانلود کرده و سپس محصول را برای همیشه حذف می‌کند.")) return;
    
    // Create backup file
    const backupData = JSON.stringify(product, null, 2);
    const blob = new Blob([backupData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = \`backup-product-\${product.id}.json\`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Hard Delete
    try {
      const res = await fetch(\`/api/products/\${product.id}/hard\`, {
        method: 'DELETE',
        headers: { Authorization: \`Bearer \${localStorage.getItem('adminToken')}\` }
      });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== product.id));
      } else {
        alert("خطا در حذف محصول");
      }
    } catch (error) {
      console.error(error);
      alert("خطا در ارتباط با سرور");
    }
  };
`;

if (!code.includes('handleDeleteAndBackup')) {
  code = code.replace('const [products, setProducts] = useState<any[]>([]);', deleteFn + '\n  const [products, setProducts] = useState<any[]>([]);');
}

// Add the delete button
code = code.replace(
  /<button\s+onClick=\{\(\) => handleEdit\(p\)\}[\s\S]*?<\/button>/g,
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

// Check if Eye is imported, if not add it
const importLucide = code.match(/import\s+{([^}]+)}\s+from\s+["']lucide-react["']/);
if (importLucide && !importLucide[1].includes('Eye')) {
  code = code.replace(importLucide[0], importLucide[0].replace('}', ', Eye, EyeOff }'));
}

// Replace the previous icons
code = code.replace(/{p\.isActive \? <Trash2 className="w-3\.5 h-3\.5" \/> : <Plus className="w-3\.5 h-3\.5" \/>}/g, '{p.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}');

fs.writeFileSync('src/pages/AdminProducts.tsx', code);
