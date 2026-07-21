sed -i 's/useSearchParams/useSearchParams, useNavigate/g' src/pages/Products.tsx
sed -i 's/const \[products/const navigate = useNavigate();\n  const \[products/g' src/pages/Products.tsx
