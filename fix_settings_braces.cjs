const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  `} else {          try {            await db.insert(schema.siteSettings).values({        key: "vip_phones",        value: valueStr,        updatedAt: new Date(),      });    }`,
  `} else {          try {            await db.insert(schema.siteSettings).values({        key: "vip_phones",        value: valueStr,        updatedAt: new Date(),      });    } catch(e) {} }`
);

// We should also check the earlier replace which may have introduced broken braces
content = content.replace(
  `key,
              value: val,
            });
          } catch(err) {}
        }`,
  `key,
              value: val,
            });
          } catch(err) {}
        }`
);

fs.writeFileSync('server.ts', content);
