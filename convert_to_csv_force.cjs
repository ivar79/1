const fs = require('fs');

function replaceJsonWithCsv(filePath, entityName) {
  let code = fs.readFileSync(filePath, 'utf8');
  
  const jsonLogicRegex = /const backupData = JSON\.stringify\([\s\S]*?URL\.revokeObjectURL\(url\);/g;
  
  const csvLogic = `
    // Create backup file as CSV
    const headers = Object.keys(${entityName}).join(',');
    const values = Object.values(${entityName}).map(val => 
      typeof val === 'string' ? '"' + val.replace(/"/g, '""') + '"' : val
    ).join(',');
    
    const csvData = "\\uFEFF" + headers + "\\n" + values; // UTF-8 BOM
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = \`backup-${entityName}-\${${entityName}.id}.csv\`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
`;

  code = code.replace(jsonLogicRegex, csvLogic.trim());
  fs.writeFileSync(filePath, code);
}

replaceJsonWithCsv('src/pages/AdminOrders.tsx', 'order');
replaceJsonWithCsv('src/pages/AdminShowrooms.tsx', 'showroom');
replaceJsonWithCsv('src/pages/AdminProducts.tsx', 'product');

