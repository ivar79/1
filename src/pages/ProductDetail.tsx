import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Product, Showroom, Category } from "../types";
import { ArrowRight, CheckCircle2, Store, Calendar, HelpCircle, PhoneCall, Heart, Star, Sparkles, MapPin, ShieldAlert, BadgeInfo, ShieldCheck, Scale, Percent, Layers , MessageSquare, UserCircle, Send} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useWishlist } from "../hooks/useWishlist";
import { Helmet } from "react-helmet-async";

function WishlistToggle({ productId }: { productId: string }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(productId);

  return (
    <button
      onClick={() => toggleWishlist(productId)}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
        isWishlisted 
          ? "bg-rose-50 text-rose-500 border-rose-200 hover:bg-rose-100" 
          : "bg-white text-stone-500 border-stone-200 hover:bg-stone-50 hover:text-stone-900"
      }`}
    >
      <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
      <span>{isWishlisted ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}</span>
    </button>
  );
}

interface ProductReview {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductDetail() {
  const { slug } = useParams();
  const [data, setData] = useState<{ product: Product; showroom: Showroom; category: Category } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  
  // Lead Form state
  const [selectedColorVariant, setSelectedColorVariant] = useState<any>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerCity, setCustomerCity] = useState("تهران");
  const [customerMessage, setCustomerMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (data?.product) {
      fetch(`/api/products/${data.product.id}/reviews`)
        .then(r => r.json())
        .then(resData => {
          if (Array.isArray(resData)) setReviews(resData);
        })
        .catch(err => console.error(err));
    }
  }, [data?.product]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data?.product) return;
    setIsSubmittingReview(true);
    setReviewMessage({ type: "", text: "" });
    try {
      const res = await fetch(`/api/products/${data.product.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName: reviewName, rating: reviewRating, comment: reviewComment })
      });
      const dataRes = await res.json();
      if (dataRes.success) {
        setReviewMessage({ type: "success", text: dataRes.message });
        setReviewName("");
        setReviewRating(5);
        setReviewComment("");
      } else {
        setReviewMessage({ type: "error", text: dataRes.error || "خطا در ثبت نظر" });
      }
    } catch (err) {
      setReviewMessage({ type: "error", text: "خطای ارتباط با سرور" });
    } finally {
      setIsSubmittingReview(false);
    }
  };
  const [errorMessage, setErrorMessage] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Capture referral code if present in url query
    const searchParams = new URLSearchParams(window.location.search);
    const refParam = searchParams.get("ref");
    if (refParam) {
      localStorage.setItem("m_referrer", refParam.trim());
    }

    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/products/${slug}`);
        const parsed = await res.json();
        if (parsed.success) {
          setData(parsed.data);
          if (parsed.data.product.images?.length > 0) {
            setActiveImage(parsed.data.product.images[0]);
          }
        }
      } catch (err) {
        console.error("Detail fetching error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [slug]);

  // Iranian cities
  const iranianCities = [
    "تهران", "اصفهان", "شیراز", "مشهد", "تبریز", "کرج", "قم", "رشت", "اهواز", "کرمان", "یزد", "همدان", "ساری", "کرمانشاه"
  ];

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    if (!customerName || !customerPhone || !customerCity) {
      setErrorMessage("لطفاً تمام کادرهای ستاره‌دار را پر کنید.");
      setIsSubmitting(false);
      return;
    }

    const iranPhoneRegex = /^(\+98|0098|98|0)?9[0-9]{9}$/;
    if (!iranPhoneRegex.test(customerPhone)) {
      setErrorMessage("شماره موبایل اشتباه است. مثال مناسب: 09121234567");
      setIsSubmitting(false);
      return;
    }

    // Append optional referral code if present in localStorage
    let finalMessage = customerMessage;
    if (selectedColorVariant) {
      finalMessage = `[رنگ انتخابی: ${selectedColorVariant.name}]\n${finalMessage || ""}`;
    }
    const storedReferrer = localStorage.getItem("m_referrer");
    if (storedReferrer) {
      finalMessage = `${customerMessage ? customerMessage + "\n" : ""}[کد معرف: ${storedReferrer}]`;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerCity,
          customerMessage: finalMessage,
          productId: data?.product.id,
        })
      });

      const resJson = await res.json();
      if (resJson.success) {
        setFormSuccess(true);
        // Reset states
        setCustomerName("");
        setCustomerPhone("");
        setCustomerMessage("");
      } else {
        setErrorMessage(resJson.error || "مشکلی در ذخیره اطلاعات به وجود آمد.");
      }
    } catch (err: any) {
      setErrorMessage("خطا در ارتباط با سرور. دوباره تلاش کنید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-stone-50 min-h-screen pt-36 pb-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-stone-50 min-h-screen pt-36 pb-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-800">کالای انتخابی شما پیدا نشد!</h2>
        <Link to="/products" className="inline-block bg-stone-900 text-stone-50 px-5 py-2 rounded-xl text-xs">
          برگشت به گالری مبل‌ها
        </Link>
      </div>
    );
  }

  const { product, showroom, category } = data;
  const isImagePlaceholder = !product.images || product.images.length === 0;
  const currentImage = activeImage || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80";

  return (
    <div className="bg-stone-50 min-h-screen text-stone-900 pt-28 pb-20 leading-relaxed">
      <Helmet>
        <title>{product.name} | گالری مبلمان خانه مبل</title>
        <meta name="description" content={product.description || `خرید ${product.name} از نمایشگاه ${showroom.name} با بهترین کیفیت.`} />
        <meta property="og:title" content={`${product.name} | گالری مبلمان خانه مبل`} />
        <meta property="og:description" content={product.description || `خرید ${product.name} از نمایشگاه ${showroom.name} با بهترین کیفیت.`} />
        {product.images && product.images.length > 0 && <meta property="og:image" content={product.images[0]} />}
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Bar: Back Link & Wishlist */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/products" className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 transition-colors">
            <ArrowRight className="w-4 h-4" />
            <span>برگشت به گالری و کاتالوگ</span>
          </Link>
          
          <WishlistToggle productId={product.id} />
        </div>

        {/* Double Column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Column 1: Images Stage & Technical details */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Image display stage */}
            <div className="bg-white border border-stone-200/50 p-4 rounded-3xl space-y-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 group">
                <img loading="lazy"
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Thumbs Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {product.images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(imgUrl)}
                      className={`relative w-20 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0 border-2 transition-all ${
                        activeImage === imgUrl ? "border-stone-900" : "border-transparent opacity-70"
                      }`}
                    >
                      <img loading="lazy" src={imgUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Technical Parameters Table */}
            <div className="bg-white border border-stone-200/50 p-6 sm:p-8 rounded-3xl space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h3 className="text-lg font-extrabold text-stone-900">مشخصات فنی و متریال ساخت</h3>
                <p className="text-xs text-stone-400 mt-1">کلیه پارامترهای زیر در هنگام سفارش قابل شخصی‌سازی هستند.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                <div className="flex justify-between items-center bg-stone-50 p-3 rounded-xl border border-stone-100/50">
                  <span className="text-stone-400 font-bold">جنس کلاف کل بدنه</span>
                  <span className="text-stone-800 font-extrabold">{product.material || "چوب درخت روس چنار خشک"}</span>
                </div>

                <div className="flex justify-between items-center bg-stone-50 p-3 rounded-xl border border-stone-100/50">
                  <span className="text-stone-400 font-bold">پایه و متریال روکار</span>
                  <span className="text-stone-800 font-extrabold">{product.baseMaterial || "راش طبیعی گرجستان"}</span>
                </div>

                <div className="flex justify-between items-center bg-stone-50 p-3 rounded-xl border border-stone-100/50">
                  <span className="text-stone-400 font-bold">فوم و اسفنج نشیمن</span>
                  <span className="text-stone-800 font-extrabold">{product.seatSponge || "اسفنج ۳۵ کیلویی ویژه"}</span>
                </div>

                <div className="flex justify-between items-center bg-stone-50 p-3 rounded-xl border border-stone-100/50">
                  <span className="text-stone-400 font-bold">نوع و متریال پارچه</span>
                  <span className="text-stone-800 font-extrabold">{product.fabricType || "پارچه خارجی نانو مسکو"}</span>
                </div>

                <div className="flex justify-between items-center bg-stone-50 p-3 rounded-xl border border-stone-100/50">
                  <span className="text-stone-400 font-bold">ابعاد و ساختار فیزیکی</span>
                  <span className="text-stone-800 font-extrabold">{product.dimensions || "اندازه استاندارد ژورنالی"}</span>
                </div>

                <div className="flex justify-between items-center bg-stone-50 p-3 rounded-xl border border-stone-100/50">
                  <span className="text-stone-400 font-bold">کلاف تقویتی داخل کار</span>
                  <span className="text-stone-800 font-extrabold">{product.innerFrame || "چوب راش و اتصالات فلزی"}</span>
                </div>

              </div>

              {/* Interactive Colors/Fabric Selector */}
              {((product.colorVariants && product.colorVariants.length > 0) || (product.colors && product.colors.length > 0)) && (
                <div className="pt-4 border-t border-stone-100">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <h4 className="text-sm font-extrabold text-stone-900 mb-1">کالیته پارچه و چرم</h4>
                      <p className="text-xs text-stone-500 font-light">رنگ مورد نظر خود را برای مشاهده انتخاب کنید</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {/* Render color variants if they exist, else fallback to simple string colors */}
                    {(product.colorVariants && product.colorVariants.length > 0 
                      ? product.colorVariants 
                      : (product.colors || []).map(c => ({ name: c }))
                    ).map((variant: any, idx) => {
                      const c = variant.name;
                      
                      // Generate a pseudo-color based on string for preview purposes
                      const pseudoColors: Record<string, string> = {
                        "سفید": "bg-stone-100 border-stone-200",
                        "کرم": "bg-[#F5F5DC] border-[#E8E8C8]",
                        "طوسی": "bg-stone-400 border-stone-500",
                        "زغالی": "bg-stone-700 border-stone-800",
                        "سبز": "bg-[#4A5D23] border-[#3A4D13]",
                        "آبی": "bg-[#2C3E50] border-[#1C2E40]",
                        "مشکی": "bg-stone-900 border-black",
                        "نسکافه ای": "bg-[#D4B895] border-[#C4A885]",
                        "قهوه ای": "bg-[#5C4033] border-[#4C3023]",
                        "زرشکی": "bg-[#800000] border-[#700000]",
                      };
                      
                      // Find best match or default to a neutral
                      const matchedKey = Object.keys(pseudoColors).find(key => c.includes(key));
                      const colorClass = matchedKey ? pseudoColors[matchedKey] : "bg-stone-300 border-stone-400";
                      
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
                            <img loading="lazy" 
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

                    })}
                  </div>
                  
                  <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-100 flex gap-2 items-start">
                    <BadgeInfo className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-stone-500 leading-relaxed text-right">
                      رنگ‌های نمایش داده شده صرفاً جهت تقریب ذهنی است. برای مشاهده دقیق بافت و رنگ در نور طبیعی، از گزینه <strong>«درخواست ارسال کالیته پارچه»</strong> استفاده کنید.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Order Lead Form & Showroom Details */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Header Product Details */}
            <div className="bg-white border border-stone-200/50 p-6 sm:p-8 rounded-3xl space-y-4">
              <span className="bg-stone-100 text-stone-700 px-3 py-1 rounded-full text-xs font-bold w-fit">
                {category.name}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
                {product.name}
              </h1>

              <p className="text-stone-500 text-xs sm:text-sm font-light leading-relaxed">
                {product.description || "هیچ توضیحی برای این محصول لوکس توسط نمایشگاه مبل نوشته نشده است. مبلی بر اساس الگوهای نوین دکوراسیون و راحتی بی عیب و نقص."}
              </p>

              <div className="h-px bg-stone-100" />

              {/* Price Row / Dynamic Anti-Bypass Comparison */}
              <div className="space-y-3.5 pt-2">
                <div className="flex justify-between items-center text-xs text-stone-400 font-semibold line-through">
                  <span>خرید آزاد و مستقیم از فیزیک نمایشگاه:</span>
                  <span>
                    {new Intl.NumberFormat("fa-IR").format(Math.round(product.basePrice * 1.05 / 50000) * 50000)} <span className="text-[10px]">تومان</span>
                  </span>
                </div>

                <div className="flex justify-between items-center p-3.5 bg-stone-50 border border-stone-100 rounded-2xl">
                  <div className="space-y-0.5">
                    <span className="text-[10px] bg-amber-100 text-stone-900 border border-amber-200 px-2 py-0.5 rounded-lg font-extrabold inline-block leading-none mb-1">
                      ۵٪ تخفیف نقدی پلتفرم
                    </span>
                    <span className="text-xs font-extrabold text-stone-900 block">قیمت نهایی با ثبت از طریق سایت:</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-extrabold text-stone-900">
                    {new Intl.NumberFormat("fa-IR").format(product.basePrice)} <span className="text-xs font-sans">تومان</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Showroom metadata card */}
            <div className="bg-white border border-stone-200/50 p-5 rounded-3xl flex items-start gap-4">
              <div className="w-12 h-12 bg-stone-100/50 rounded-2xl flex items-center justify-center shrink-0 text-stone-800">
                <Store className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-1 text-right">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">نمایشگاه عرضه‌کننده</h4>
                <p className="text-sm font-bold text-stone-900">{showroom.name}</p>
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-stone-500 bg-stone-50 px-2 py-0.5 rounded-lg border border-stone-100">
                  <MapPin className="w-3.5 h-3.5" />
                  {showroom.city}
                </span>
              </div>
            </div>

            {/* Lead Generation (AI Consultation via Messengers) */}
            <div className="bg-stone-900 text-stone-50 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl relative overflow-hidden mt-6">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-l from-amber-400 via-stone-500 to-stone-400" />
              
              <div className="space-y-3 text-right">
                <h3 className="text-lg font-extrabold text-stone-50">مشاوره رایگان اختصاصی</h3>
                <p className="text-stone-300 text-xs font-light leading-relaxed">
                  یک عکس از پذیرایی یا محل قرارگیری مبل بفرستید تا بهترین مدل و رنگ را متناسب با نور و فضای خانه‌تان به شما پیشنهاد دهیم.
                </p>
              </div>

              <div className="pt-4 space-y-3">
                <a
                  href="https://t.me/khane_moble_admin"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#2AABEE] hover:bg-[#2298D6] text-white py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.896-.667 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                  <span>دریافت مشاوره در تلگرام</span>
                </a>
                
                <a
                  href="https://ble.ir/khane_moble"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>دریافت مشاوره در بله</span>
                </a>

                <button
                  type="button"
                  onClick={() => alert("درخواست شما برای ارسال کالیته ثبت شد. لطفاً برای هماهنگی آدرس در پیام‌رسان‌ها به ما پیام دهید.")}
                  className="w-full mt-2 bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 hover:text-white py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                  <span>درخواست کالیته پارچه (VIP)</span>
                </button>
              </div>
            </div>


            {/* Reviews Section */}
            <div className="bg-white border border-stone-200 rounded-[2rem] p-6 lg:p-8 space-y-8 mt-6">
              <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-900">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-stone-900 text-lg">نظرات خریداران</h3>
                  <p className="text-stone-500 font-light text-xs mt-1">تجربیات مشتریان قبلی از خرید این محصول</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Review Form */}
                <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100 h-fit">
                  <h4 className="font-bold text-sm text-stone-900 mb-4">ثبت دیدگاه جدید</h4>
                  <form onSubmit={submitReview} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-600 block text-right">نام شما <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="نام خود را وارد کنید"
                        className="w-full text-right bg-white border border-stone-200 rounded-xl py-2.5 px-4 text-xs text-stone-900 focus:outline-none focus:border-stone-400 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-600 block text-right">امتیاز <span className="text-red-500">*</span></label>
                      <div className="flex gap-2 items-center flex-row-reverse justify-end">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110"
                          >
                            <Star className={`w-6 h-6 ${reviewRating >= star ? "fill-amber-400 text-amber-400" : "text-stone-300"}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-600 block text-right">متن دیدگاه <span className="text-red-500">*</span></label>
                      <textarea
                        required
                        rows={4}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="نظرتان را درباره کیفیت، راحتی و زمان تحویل بنویسید..."
                        className="w-full text-right bg-white border border-stone-200 rounded-xl py-2.5 px-4 text-xs text-stone-900 resize-none focus:outline-none focus:border-stone-400 transition-colors"
                      ></textarea>
                    </div>
                    {reviewMessage.text && (
                      <div className={`p-3 rounded-xl text-xs ${reviewMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {reviewMessage.text}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="w-full bg-stone-900 hover:bg-stone-800 text-white py-3 rounded-xl text-xs font-bold transition-all flex justify-center items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      {isSubmittingReview ? "در حال ثبت..." : "ثبت دیدگاه"}
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((r) => (
                      <div key={r.id} className="bg-white border border-stone-100 p-5 rounded-2xl shadow-sm shadow-stone-200/50">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-stone-200"}`} />
                            ))}
                          </div>
                          <div className="flex items-center gap-2 text-stone-500">
                            <span className="text-xs font-bold">{r.customerName}</span>
                            <UserCircle className="w-5 h-5 text-stone-300" />
                          </div>
                        </div>
                        <p className="text-stone-700 text-xs font-light leading-loose text-right">
                          {r.comment}
                        </p>
                        <div className="mt-3 text-[10px] text-stone-400 text-right">
                          {new Date(r.createdAt).toLocaleDateString('fa-IR')}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-stone-400 space-y-3 py-10 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                      <MessageSquare className="w-8 h-8 opacity-20" />
                      <p className="text-xs">هنوز دیدگاهی برای این محصول ثبت نشده است.</p>
                      <p className="text-[10px] opacity-70">اولین نفری باشید که نظر خود را می‌نویسد!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Platform notice badge */}
            <div className="bg-stone-50 border border-stone-200/80 p-4 rounded-3xl flex gap-2.5 items-start">
              <BadgeInfo className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-stone-500 leading-relaxed text-right">
                <strong>توجه مالی:</strong> پرداخت شما مستقیماً در وجه نمایشگاه مبلمان به قیمت مصوب تولیدی، در فاکتور رسمی نمایشگاه تسویه می‌شود. هیچ مبلغی تحت عنوان بیعانه از طرف این پلتفرم از کلاینت‌ها اخذ نخواهد شد.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
