# Relo 🧳

**مستشارك الشخصي قبل السفر أو الهجرة لأي دولة.**

بدلاً من البحث في عشرات المواقع، يعطيك Relo كل ما تحتاج معرفته قبل السفر أو الهجرة في مكان واحد، مخصص لوضعك الشخصي، بالإضافة لأدوات ذكاء اصطناعي إضافية تساعدك أثناء رحلتك.

🔗 **رابط التطبيق المباشر:** [https://relo-zwci.vercel.app/](https://relo-zwci.vercel.app/)

---

## ✨ الميزات

1. **المساعد الذكي الأساسي** — اكتب وضعك (الجنسية، الوجهة، سبب السفر، الميزانية) واحصل على خطة شاملة: المستندات المطلوبة، الخطوات، تكلفة المعيشة، فتح حساب بنكي، المواصلات، أخطاء شائعة، وقائمة مهام تفاعلية (checkboxes فعلية).
2. **🚨 وضع الطوارئ** — أرقام الشرطة والإسعاف والمطافئ المحلية، نصائح للوصول للسفارة، وعبارات طوارئ أساسية مترجمة.
3. **⚠️ تحذيرات من النصب** — أشهر عمليات النصب الشائعة في وجهتك وكيفية تجنبها.
4. **💰 حاسبة تكلفة الرحلة** — تقدير تكلفة الإقامة، الطعام، المواصلات، والأنشطة حسب الوجهة ومدة الرحلة وأسلوب السفر.
5. **🗣️ المترجم** — ترجمة فورية للعبارات الشائعة إلى اللغة المحلية مع دليل نطق.

---

## 🛠️ التقنية المستخدمة

- **Frontend + Backend:** Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **AI:** Google Gemini 2.5 Flash (عبر مكتبة `@google/genai`)
- **Database:** Supabase (PostgreSQL) — مجهزة للاستخدام المستقبلي
- **Deployment:** Vercel
- **Testing:** [TestSprite CLI](https://github.com/testsprite/testsprite-cli) — راجع [`LOOP.md`](./LOOP.md) لسجل كامل لدورات الاختبار (Write → Verify → Fix → Verify)

---

## 🧪 التشغيل محليًا

```bash
git clone https://github.com/Meabozeid/relo.git
cd relo
npm install
```

أنشئ ملف `.env.local` في جذر المشروع وأضف المفاتيح التالية:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SECRET_KEY=your_supabase_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

```bash
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000) في المتصفح.

---

## 🔁 عملية الاختبار (Testing Loop)

تم بناء هذا المشروع باستخدام حلقة اختبار مستمرة (Write → Verify → Fix → Verify) عبر TestSprite CLI ضد الرابط المباشر (Live URL)، وليس بيئة محلية. للاطلاع على السجل الكامل لكل دورة اختبار، بما في ذلك حالة تم فيها اكتشاف مشكلة وإصلاحها فعليًا، راجع ملف [`LOOP.md`](./LOOP.md).

---

## 📌 عن المشروع

تم بناء Relo كمشروع مشاركة في **TestSprite Hackathon Season 3 — Build the Loop**.