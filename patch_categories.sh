cat << 'INNER_EOF' > cats.tsx
      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="flex justify-between items-end mb-10">
          <div className="space-y-2 text-right">
            <div className="flex items-center gap-1.5 justify-start text-stone-400 text-xs font-bold uppercase">
              <Layers className="w-4 h-4 text-stone-400" />
              <span>دسته‌بندی‌های مبل</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">انواع مبلمان</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((c) => (
            <Link key={c.id} to={`/products?category=${c.slug}`} className="group relative aspect-square rounded-3xl overflow-hidden bg-stone-200">
              {c.image ? (
                <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-stone-300">
                  <Sofa className="w-12 h-12 text-stone-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-right">
                <h3 className="text-stone-50 font-bold text-lg">{c.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

INNER_EOF

sed -i '/{\/\* 4. Category Exploration Banner \*\//r cats.tsx' src/pages/Home.tsx
