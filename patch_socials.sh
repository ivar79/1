sed -i 's/href="https:\/\/instagram.com"/href={settings.instagram ? `https:\/\/instagram.com\/${settings.instagram.replace("@","")}` : "https:\/\/instagram.com"}/g' src/components/Footer.tsx
sed -i 's/href="https:\/\/wa.me\/123456789"/href={settings.telegram ? `https:\/\/t.me\/${settings.telegram.replace("@","")}` : "https:\/\/t.me"}/g' src/components/Footer.tsx
