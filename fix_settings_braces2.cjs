const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// The first patch didn't replace because the spacing didn't match exactly. Let's use regex.
code = code.replace(
  /\} else \{\s*try \{\s*await db\.insert\(schema\.siteSettings\)\.values\(\{\s*key: "vip_phones",\s*value: valueStr,\s*updatedAt: new Date\(\),\s*\}\);\s*\}/,
  '} else { try { await db.insert(schema.siteSettings).values({ key: "vip_phones", value: valueStr, updatedAt: new Date(), }); } catch(err) {} }'
);

fs.writeFileSync('server.ts', code);
