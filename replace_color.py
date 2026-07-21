import re

with open('src/pages/ProductDetail.tsx', 'r') as f:
    content = f.read()

pattern = re.compile(r"return \(\s*<button \s*key=\{idx\}\s*onClick=\{\(\) => \{.*?\s*\}\}\s*className=.*?<span className.*?</span>\s*</button>\s*\);", re.DOTALL)

with open('color_render.tsx', 'r') as f:
    replacement = f.read()

new_content = pattern.sub(replacement, content)

with open('src/pages/ProductDetail.tsx', 'w') as f:
    f.write(new_content)
