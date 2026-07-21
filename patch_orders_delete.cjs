const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminOrders.tsx', 'utf8');

const importLucide = code.match(/import\s+{([^}]+)}\s+from\s+["']lucide-react["']/);
if (importLucide && !importLucide[1].includes('Trash2')) {
  code = code.replace(importLucide[0], importLucide[0].replace('}', ', Trash2, Download }'));
}

const deleteFn = `
  const handleDeleteAndBackup = async (order: any) => {
    if (!window.confirm("آیا مطمئن هستید؟ این عملیات ابتدا یک نسخه پشتیبان دانلود کرده و سپس سفارش را برای همیشه حذف می‌کند.")) return;
    
    // Create backup file
    const backupData = JSON.stringify(order, null, 2);
    const blob = new Blob([backupData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = \`backup-order-\${order.id}.json\`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Hard Delete
    try {
      const res = await fetch(\`/api/orders/\${order.id}\`, {
        method: 'DELETE',
        headers: { Authorization: \`Bearer \${localStorage.getItem('adminToken')}\` }
      });
      if (res.ok) {
        setOrders(orders.filter(o => o.id !== order.id));
      } else {
        alert("خطا در حذف سفارش");
      }
    } catch (error) {
      console.error(error);
      alert("خطا در ارتباط با سرور");
    }
  };
`;

if (!code.includes('handleDeleteAndBackup')) {
  code = code.replace('const [orders, setOrders]', deleteFn + '\n  const [orders, setOrders]');
}

const buttonsCode = `
                        <div className="flex justify-center items-center gap-2">
                          <Link
                            to={\`/admin/orders/\${order.id}\`}
                            className="bg-stone-900 hover:bg-stone-800 text-stone-50 text-[10px] font-bold px-3 py-2 rounded-xl transition-all"
                          >
                            بررسی و ویرایش فاکتور
                          </Link>
                          <button
                            onClick={() => handleDeleteAndBackup(order)}
                            title="حذف و دریافت فایل پشتیبان"
                            className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-xl transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
`;

code = code.replace(
  /<td className="px-4 py-4 text-center">([\s\S]*?)<\/td>/g,
  (match, p1) => {
    if (match.includes("بررسی و ویرایش فاکتور") && !match.includes("Trash2")) {
      return `<td className="px-4 py-4 text-center">
${buttonsCode}
                      </td>`;
    }
    return match;
  }
);

fs.writeFileSync('src/pages/AdminOrders.tsx', code);
