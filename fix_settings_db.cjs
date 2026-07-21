const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  'const rows = await db.select().from(schema.siteSettings);',
  `let rows = [];\n    try {\n      rows = await db.select().from(schema.siteSettings);\n    } catch(err) { console.warn("DB offline, using inMemorySettings"); }`
);

code = code.replace(
  /const existing = await db\s*\.select\(\)\s*\.from\(schema\.siteSettings\)\s*\.where\(eq\(schema\.siteSettings\.key,\s*key\)\)\s*\.limit\(1\);[\s\S]*?(?=} else {)/,
  `let existing = [];
        try {
          existing = await db
            .select()
            .from(schema.siteSettings)
            .where(eq(schema.siteSettings.key, key))
            .limit(1);
        } catch(err) {}
        if (existing.length > 0) {
          try {
            await db
              .update(schema.siteSettings)
              .set({ value: val, updatedAt: new Date() })
              .where(eq(schema.siteSettings.key, key));
          } catch(err) {}
`
);

code = code.replace(
  /\} else \{\s*await db\.insert\(schema\.siteSettings\)\.values\(\{/,
  `} else {
          try {
            await db.insert(schema.siteSettings).values({`
);

code = code.replace(
  /key,\s*value:\s*val,\s*\}\);\s*\}/,
  `key,
              value: val,
            });
          } catch(err) {}
        }`
);

fs.writeFileSync('server.ts', code);
