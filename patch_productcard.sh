sed -i 's/<Link/                    <div/g' src/components/ProductCard.tsx
sed -i 's/<\/Link>/<\/div>/g' src/components/ProductCard.tsx
sed -i 's/to={`\/product\/${product.slug}`}//g' src/components/ProductCard.tsx
