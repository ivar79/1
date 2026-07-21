const fs = require('fs');

const frontendBackupLogic = (entity, endpoint) => `
  const handleDeleteAndBackup = async (item: any) => {
    if (!window.confirm("آیا مطمئن هستید؟ این عملیات ابتدا یک نسخه پشتیبان جامع (اکسل) دانلود کرده و سپس این مورد و تمامی داده‌های وابسته (محصولات، سفارشات، کمیسیون‌ها) را برای همیشه حذف می‌کند.")) return;
    
    try {
      // 1. Fetch comprehensive backup
      const backupRes = await fetch(\`/api/${endpoint}/\${item.id}/backup\`, {
        headers: { Authorization: \`Bearer \${localStorage.getItem('adminToken')}\` }
      });
      if (backupRes.ok) {
        const backupData = await backupRes.json();
        if (backupData.success) {
          
          let csvContent = "\\uFEFF"; // BOM for UTF-8
          
          const addTableToCsv = (title, dataArray) => {
            if (!dataArray || dataArray.length === 0) return;
            csvContent += \`\\n--- \${title} ---\\n\`;
            const headers = Object.keys(dataArray[0]);
            csvContent += headers.join(',') + '\\n';
            for (const row of dataArray) {
              const rowValues = headers.map(h => {
                let val = row[h];
                if (val === null || val === undefined) return '""';
                if (typeof val === 'object') val = JSON.stringify(val);
                return '"' + String(val).replace(/"/g, '""') + '"';
              });
              csvContent += rowValues.join(',') + '\\n';
            }
          };

          const b = backupData.backup;
          if (b.showroom) addTableToCsv('مشخصات نمایشگاه', [b.showroom]);
          if (b.product) addTableToCsv('مشخصات محصول', [b.product]);
          if (b.order) addTableToCsv('مشخصات سفارش', [b.order]);
          
          if (b.products) addTableToCsv('لیست محصولات', b.products);
          if (b.orders) addTableToCsv('لیست سفارشات', b.orders);
          if (b.commissions) addTableToCsv('لیست پورسانت‌ها (مالی)', b.commissions);

          const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = \`backup-comprehensive-${entity}-\${item.id}.csv\`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }

      // 2. Perform Cascade Delete
      const delPath = \`/api/${endpoint}/\${item.id}\` + ('${entity}' === 'order' ? '' : '/hard');
      const res = await fetch(delPath, {
        method: 'DELETE',
        headers: { Authorization: \`Bearer \${localStorage.getItem('adminToken')}\` }
      });
      if (res.ok) {
        window.location.reload();
      } else {
        alert("خطا در حذف");
      }
    } catch (error) {
      console.error(error);
      alert("خطا در ارتباط با سرور");
    }
  };
`;

function patchFile(file, entity, endpoint) {
  let code = fs.readFileSync(file, 'utf8');
  const regex = /const handleDeleteAndBackup = async \([\s\S]*?alert\("خطا در ارتباط با سرور"\);\s*\}\s*\};\s*/g;
  code = code.replace(regex, frontendBackupLogic(entity, endpoint).trim() + '\n\n');
  fs.writeFileSync(file, code);
}

patchFile('src/pages/AdminOrders.tsx', 'order', 'orders');
patchFile('src/pages/AdminShowrooms.tsx', 'showroom', 'showrooms');
patchFile('src/pages/AdminProducts.tsx', 'product', 'products');
