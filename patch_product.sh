sed -i 's/const \[customerName/const \[selectedColorVariant, setSelectedColorVariant\] = useState<any>(null);\n  const \[customerName/g' src/pages/ProductDetail.tsx
