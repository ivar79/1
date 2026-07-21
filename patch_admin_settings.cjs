const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminSettings.tsx', 'utf8');

// 1. Add fields to initial state
code = code.replace(
  'footer_about: ""',
  `footer_about: "",
    about_banner_image: "",
    about_feature_1_title: "",
    about_feature_1_desc: "",
    about_feature_2_title: "",
    about_feature_2_desc: "",
    about_value_1_title: "",
    about_value_1_desc: "",
    about_value_2_title: "",
    about_value_2_desc: ""`
);

// 2. Add the UI inputs inside the About section
const aboutEndRegex = /<textarea[^>]*name="about_content"[\s\S]*?<\/textarea>\s*<\/div>\s*<\/div>\s*<\/div>/;

const extraAboutFields = `
        {/* About Extra Elements */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/60 shadow-sm space-y-5">
          <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-purple-500 rounded-full" />
            <span>جزئیات صفحه درباره ما (عکس و باکس‌ها)</span>
          </h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-stone-500 block">لینک عکس بنر اصلی (About Banner)</label>
              <input
                type="text"
                name="about_banner_image"
                value={settings.about_banner_image}
                onChange={handleChange}
                className="w-full text-xs font-mono border border-stone-200 p-3 rounded-xl bg-stone-50 text-left dir-ltr"
                placeholder="https://..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-800">ویژگی اول (فرآیند فعالیت)</h4>
                <input
                  type="text"
                  name="about_feature_1_title"
                  value={settings.about_feature_1_title}
                  onChange={handleChange}
                  placeholder="عنوان ویژگی اول"
                  className="w-full text-xs border border-stone-200 p-3 rounded-xl bg-stone-50"
                />
                <textarea
                  name="about_feature_1_desc"
                  value={settings.about_feature_1_desc}
                  onChange={handleChange}
                  rows={2}
                  placeholder="توضیحات ویژگی اول"
                  className="w-full text-xs border border-stone-200 p-3 rounded-xl bg-stone-50"
                />
              </div>
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-800">ویژگی دوم (فرآیند فعالیت)</h4>
                <input
                  type="text"
                  name="about_feature_2_title"
                  value={settings.about_feature_2_title}
                  onChange={handleChange}
                  placeholder="عنوان ویژگی دوم"
                  className="w-full text-xs border border-stone-200 p-3 rounded-xl bg-stone-50"
                />
                <textarea
                  name="about_feature_2_desc"
                  value={settings.about_feature_2_desc}
                  onChange={handleChange}
                  rows={2}
                  placeholder="توضیحات ویژگی دوم"
                  className="w-full text-xs border border-stone-200 p-3 rounded-xl bg-stone-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-800">باکس اطلاعات اول (پایین صفحه)</h4>
                <input
                  type="text"
                  name="about_value_1_title"
                  value={settings.about_value_1_title}
                  onChange={handleChange}
                  placeholder="عنوان"
                  className="w-full text-xs border border-stone-200 p-3 rounded-xl bg-stone-50"
                />
                <textarea
                  name="about_value_1_desc"
                  value={settings.about_value_1_desc}
                  onChange={handleChange}
                  rows={2}
                  placeholder="توضیحات"
                  className="w-full text-xs border border-stone-200 p-3 rounded-xl bg-stone-50"
                />
              </div>
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-800">باکس اطلاعات دوم (پایین صفحه)</h4>
                <input
                  type="text"
                  name="about_value_2_title"
                  value={settings.about_value_2_title}
                  onChange={handleChange}
                  placeholder="عنوان"
                  className="w-full text-xs border border-stone-200 p-3 rounded-xl bg-stone-50"
                />
                <textarea
                  name="about_value_2_desc"
                  value={settings.about_value_2_desc}
                  onChange={handleChange}
                  rows={2}
                  placeholder="توضیحات"
                  className="w-full text-xs border border-stone-200 p-3 rounded-xl bg-stone-50"
                />
              </div>
            </div>
          </div>
        </div>
`;

code = code.replace(aboutEndRegex, (match) => {
  return match + '\n' + extraAboutFields;
});

fs.writeFileSync('src/pages/AdminSettings.tsx', code);
