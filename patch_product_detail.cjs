const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetail.tsx', 'utf8');

if (!code.includes('ProductReview')) {
  // Add imports
  code = code.replace(
    /import \{([^}]+)\} from "lucide-react";/,
    (match, p1) => {
      if (!p1.includes('MessageSquare')) p1 += ', MessageSquare';
      if (!p1.includes('UserCircle')) p1 += ', UserCircle';
      if (!p1.includes('Send')) p1 += ', Send';
      return `import {${p1}} from "lucide-react";`;
    }
  );

  // Define Review Type
  code = code.replace(
    'export default function ProductDetail() {',
    `interface ProductReview {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductDetail() {`
  );

  // Add state and fetch logic
  code = code.replace(
    'const [isSubmitting, setIsSubmitting] = useState(false);',
    `const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (product) {
      fetch(\`/api/products/\${product.id}/reviews\`)
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) setReviews(data);
        })
        .catch(err => console.error(err));
    }
  }, [product]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setIsSubmittingReview(true);
    setReviewMessage({ type: "", text: "" });
    try {
      const res = await fetch(\`/api/products/\${product.id}/reviews\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName: reviewName, rating: reviewRating, comment: reviewComment })
      });
      const data = await res.json();
      if (data.success) {
        setReviewMessage({ type: "success", text: data.message });
        setReviewName("");
        setReviewRating(5);
        setReviewComment("");
      } else {
        setReviewMessage({ type: "error", text: data.error || "خطا در ثبت نظر" });
      }
    } catch (err) {
      setReviewMessage({ type: "error", text: "خطای ارتباط با سرور" });
    } finally {
      setIsSubmittingReview(false);
    }
  };`
  );

  // Insert reviews section before the final closing divs
  const targetEnd = `            {/* Platform notice badge */}`;
  
  const reviewHtml = `
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
                            <Star className={\`w-6 h-6 \${reviewRating >= star ? "fill-amber-400 text-amber-400" : "text-stone-300"}\`} />
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
                      <div className={\`p-3 rounded-xl text-xs \${reviewMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}\`}>
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
                              <Star key={i} className={\`w-3.5 h-3.5 \${i < r.rating ? "fill-amber-400 text-amber-400" : "text-stone-200"}\`} />
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

`;
  code = code.replace(targetEnd, reviewHtml + targetEnd);
  fs.writeFileSync('src/pages/ProductDetail.tsx', code);
}
