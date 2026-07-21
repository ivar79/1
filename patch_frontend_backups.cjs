const fs = require('fs');

function flattenObject(ob) {
    let toReturn = {};
    for (let i in ob) {
        if (!ob.hasOwnProperty(i)) continue;
        if ((typeof ob[i]) == 'object' && ob[i] !== null && !Array.isArray(ob[i])) {
            let flatObject = flattenObject(ob[i]);
            for (let x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;
                toReturn[i + '.' + x] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
}

const frontendBackupLogic = (entity, endpoint) => `
  const handleDeleteAndBackup = async (item: any) => {
    if (!window.confirm("آیا مطمئن هستید؟ این عملیات ابتدا یک نسخه پشتیبان جامع دانلود کرده و سپس این مورد و تمامی داده‌های وابسته (محصولات، سفارشات، کمیسیون‌ها) را برای همیشه حذف می‌کند.")) return;
    
    try {
      // 1. Fetch comprehensive backup
      const backupRes = await fetch(\`/api/${endpoint}/\${item.id}/backup\`, {
        headers: { Authorization: \`Bearer \${localStorage.getItem('adminToken')}\` }
      });
      if (backupRes.ok) {
        const backupData = await backupRes.json();
        if (backupData.success) {
          // Convert to JSON string and blob
          const jsonString = JSON.stringify(backupData.backup, null, 2);
          const blob = new Blob([jsonString], { type: "application/json;charset=utf-8;" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = \`backup-comprehensive-${entity}-\${item.id}.json\`;
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
