                                            const isSelected = selectedColorVariant?.name === c;
                      return (
                        <button 
                          key={idx} 
                          type="button"
                          onClick={() => {
                            setSelectedColorVariant(variant);
                            if (variant.productImage) {
                              setActiveImage(variant.productImage);
                            }
                          }}
                          className={`group flex flex-col items-center gap-2 cursor-pointer p-1 rounded-xl transition-colors ${isSelected ? "bg-stone-100" : ""}`}
                        >
                          {variant.image ? (
                            <img 
                              src={variant.image}
                              alt={c}
                              className={`w-10 h-10 rounded-full border-2 object-cover transition-all duration-200 shadow-sm ${isSelected ? "border-stone-900 scale-110" : "border-stone-200 group-hover:scale-105 group-hover:border-stone-400"}`}
                            />
                          ) : (
                            <div 
                              className={`w-10 h-10 rounded-full border-2 transition-all duration-200 shadow-sm ${colorClass} ${isSelected ? "border-stone-900 scale-110" : "group-hover:scale-105 group-hover:border-stone-400"}`}
                              title={c}
                            />
                          )}
                          <span className={`text-[10px] font-medium ${isSelected ? "text-stone-900 font-bold" : "text-stone-600"}`}>{c}</span>
                        </button>
                      );
