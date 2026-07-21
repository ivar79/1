const fs = require('fs');

function replaceJsonWithCsv(filePath, entityName) {
  let code = fs.readFileSync(filePath, 'utf8');
  
  const csvLogic = `
    // Create backup file as CSV (Excel compatible)
    const headers = Object.keys(${entityName}).join(',');
    const values = Object.values(${entityName}).map(val => 
      typeof val === 'string' ? '"' + val.replace(/"/g, '""') + '"' : val
    ).join(',');
    
    const csvData = "\\uFEFF" + headers + "\\n" + values; // \\uFEFF is for UTF-8 BOM so Excel reads Persian correctly
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = \`backup-${entityName}-\${${entityName}.id}.csv\`;
`;

  // We look for:
  // const backupData = JSON.stringify(product, null, 2);
  // const blob = new Blob([backupData], { type: "application/json" });
  // const url = URL.createObjectURL(blob);
  // const a = document.createElement("a");
  // a.href = url;
  // a.download = `backup-product-${product.id}.json`;
  
  code = code.replace(
    /const backupData = JSON\.stringify\([\s\S]*?a\.download = `backup-[^`]+`\.json`;/g,
    csvLogic.trim()
  );
  
  fs.writeFileSync(filePath, code);
}

replaceJsonWithCsv('src/pages/AdminOrders.tsx', 'order');
replaceJsonWithCsv('src/pages/AdminShowrooms.tsx', 'showroom');
replaceJsonWithCsv('src/pages/AdminProducts.tsx', 'product');

