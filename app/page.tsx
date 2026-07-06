"use client";

import { useState, useRef, useEffect } from "react";
type TravelData = {
  documents: string[];
  steps: string[];
  costOfLiving: string;
  banking: string;
  transportation: string;
  commonMistakes: string[];
  checklist: string[];
};

type EmergencyData = {
  police: string;
  ambulance: string;
  fire: string;
  embassyAdvice: string;
  emergencyPhrases: { arabic: string; local: string }[];
  generalTip: string;
};

type ScamData = {
  scams: { title: string; description: string; howToAvoid: string }[];
  generalAdvice: string;
};

type BudgetData = {
  accommodation: string;
  food: string;
  transportation: string;
  activities: string;
  total: string;
  tip: string;
};

type TranslatorData = {
  translation: string;
  pronunciation: string;
  language: string;
};

const NAVY = "#1B2A4A";
const GOLD = "#EEC41E";

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<TravelData | null>(null);
  const [activeTab, setActiveTab] = useState<string>("steps");
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [data]);
  const [showEmergency, setShowEmergency] = useState(false);
  const [emergencyCountry, setEmergencyCountry] = useState("");
  const [emergencyNationality, setEmergencyNationality] = useState("");
  const [emergencyLoading, setEmergencyLoading] = useState(false);
  const [emergencyError, setEmergencyError] = useState("");
  const [emergencyData, setEmergencyData] = useState<EmergencyData | null>(
    null,
  );

  const [showScams, setShowScams] = useState(false);
  const [scamCountry, setScamCountry] = useState("");
  const [scamLoading, setScamLoading] = useState(false);
  const [scamError, setScamError] = useState("");
  const [scamData, setScamData] = useState<ScamData | null>(null);

  const [showBudget, setShowBudget] = useState(false);
  const [budgetDestination, setBudgetDestination] = useState("");
  const [budgetDays, setBudgetDays] = useState("");
  const [budgetStyle, setBudgetStyle] = useState("متوسط");
  const [budgetLoading, setBudgetLoading] = useState(false);
  const [budgetError, setBudgetError] = useState("");
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);

  const [showTranslator, setShowTranslator] = useState(false);
  const [translatorText, setTranslatorText] = useState("");
  const [translatorLang, setTranslatorLang] = useState("");
  const [translatorLoading, setTranslatorLoading] = useState(false);
  const [translatorError, setTranslatorError] = useState("");
  const [translatorData, setTranslatorData] = useState<TranslatorData | null>(
    null,
  );

  const toggleChecklistItem = (index: number) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleEmergencySubmit = async () => {
    if (!emergencyCountry.trim()) {
      setEmergencyError("من فضلك اكتب اسم الدولة");
      return;
    }
    setEmergencyLoading(true);
    setEmergencyError("");
    setEmergencyData(null);
    try {
      const res = await fetch("/api/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: emergencyCountry,
          nationality: emergencyNationality,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        setEmergencyError(result.error || "حصل خطأ، حاول تاني");
        return;
      }
      setEmergencyData(result.data);
    } catch {
      setEmergencyError("حصل خطأ في الاتصال، حاول تاني");
    } finally {
      setEmergencyLoading(false);
    }
  };

  const closeEmergency = () => {
    setShowEmergency(false);
    setEmergencyCountry("");
    setEmergencyNationality("");
    setEmergencyData(null);
    setEmergencyError("");
  };

  const handleScamSubmit = async () => {
    if (!scamCountry.trim()) {
      setScamError("من فضلك اكتب اسم الدولة");
      return;
    }
    setScamLoading(true);
    setScamError("");
    setScamData(null);
    try {
      const res = await fetch("/api/scam-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: scamCountry }),
      });
      const result = await res.json();
      if (!res.ok) {
        setScamError(result.error || "حصل خطأ، حاول تاني");
        return;
      }
      setScamData(result.data);
    } catch {
      setScamError("حصل خطأ في الاتصال، حاول تاني");
    } finally {
      setScamLoading(false);
    }
  };

  const closeScams = () => {
    setShowScams(false);
    setScamCountry("");
    setScamData(null);
    setScamError("");
  };

  const handleBudgetSubmit = async () => {
    if (!budgetDestination.trim()) {
      setBudgetError("من فضلك اكتب اسم الوجهة");
      return;
    }
    if (!budgetDays.trim() || Number(budgetDays) <= 0) {
      setBudgetError("من فضلك اكتب عدد أيام صحيح");
      return;
    }
    setBudgetLoading(true);
    setBudgetError("");
    setBudgetData(null);
    try {
      const res = await fetch("/api/budget-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: budgetDestination,
          days: budgetDays,
          travelStyle: budgetStyle,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        setBudgetError(result.error || "حصل خطأ، حاول تاني");
        return;
      }
      setBudgetData(result.data);
    } catch {
      setBudgetError("حصل خطأ في الاتصال، حاول تاني");
    } finally {
      setBudgetLoading(false);
    }
  };

  const closeBudget = () => {
    setShowBudget(false);
    setBudgetDestination("");
    setBudgetDays("");
    setBudgetStyle("متوسط");
    setBudgetData(null);
    setBudgetError("");
  };

  const handleTranslatorSubmit = async () => {
    if (!translatorText.trim()) {
      setTranslatorError("من فضلك اكتب النص المراد ترجمته");
      return;
    }
    if (!translatorLang.trim()) {
      setTranslatorError("من فضلك اكتب اللغة أو الدولة المستهدفة");
      return;
    }
    setTranslatorLoading(true);
    setTranslatorError("");
    setTranslatorData(null);
    try {
      const res = await fetch("/api/translator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: translatorText,
          targetLanguage: translatorLang,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        setTranslatorError(result.error || "حصل خطأ، حاول تاني");
        return;
      }
      setTranslatorData(result.data);
    } catch {
      setTranslatorError("حصل خطأ في الاتصال، حاول تاني");
    } finally {
      setTranslatorLoading(false);
    }
  };

  const closeTranslator = () => {
    setShowTranslator(false);
    setTranslatorText("");
    setTranslatorLang("");
    setTranslatorData(null);
    setTranslatorError("");
  };

  const handleSubmit = async () => {
    if (!input.trim()) {
      setError("من فضلك اكتب وضعك أولاً");
      return;
    }
    setLoading(true);
    setError("");
    setData(null);
    setCheckedItems(new Set());
    try {
      const res = await fetch("/api/travel-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: input }),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "حصل خطأ، حاول تاني");
        return;
      }
      setData(result.data);
      setActiveTab("steps");
    } catch {
      setError("حصل خطأ في الاتصال، حاول تاني");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: "steps", label: "الخطوات" },
    { key: "documents", label: "المستندات" },
    { key: "costOfLiving", label: "تكلفة المعيشة" },
    { key: "banking", label: "الحساب البنكي" },
    { key: "transportation", label: "المواصلات" },
    { key: "commonMistakes", label: "أخطاء شائعة" },
    { key: "checklist", label: "قائمة المهام" },
  ];

  const featureCards = [
    {
      key: "translator",
      icon: "🗣️",
      label: "المترجم",
      desc: "ترجمة عبارات السفر الأساسية فورًا",
      onClick: () => setShowTranslator(true),
    },
    {
      key: "budget",
      icon: "💰",
      label: "حاسبة التكلفة",
      desc: "قدّر ميزانية رحلتك بالكامل",
      onClick: () => setShowBudget(true),
    },
    {
      key: "scams",
      icon: "⚠️",
      label: "تحذيرات النصب",
      desc: "تجنب أشهر عمليات النصب بوجهتك",
      onClick: () => setShowScams(true),
    },
    {
      key: "emergency",
      icon: "🚨",
      label: "وضع الطوارئ",
      desc: "أرقام الطوارئ والسفارة فورًا",
      onClick: () => setShowEmergency(true),
    },
  ];

  return (
    <main dir="rtl" className="min-h-screen bg-white">
      {/* ===== Hero Band ===== */}
      <section
        className="relative overflow-hidden px-4 pt-14 pb-40"
        style={{ backgroundColor: NAVY }}
      >
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1.5px, transparent 1.5px)",
            backgroundSize: "26px 26px",
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <svg width="42" height="42" viewBox="0 0 64 64" fill="none">
              <rect width="64" height="64" rx="16" fill={GOLD} />
              <circle cx="32" cy="32" r="20" stroke={NAVY} strokeWidth="3" />
              <path d="M32 20 L38 32 L32 44 L26 32 Z" fill={NAVY} />
              <circle cx="32" cy="32" r="3" fill={GOLD} />
            </svg>
            <span className="text-white text-xl font-bold tracking-wide">
              Relo
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-5">
            خطط لسفرك أو هجرتك
            <br />
            مع <span style={{ color: GOLD }}>Relo</span>
          </h1>
          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
            مستشارك الشخصي الذكي: كل ما تحتاج معرفته قبل السفر أو الهجرة لأي
            دولة، في مكان واحد.
          </p>
        </div>
      </section>

      {/* ===== Floating input card (overlaps hero) ===== */}
      <div className="max-w-2xl mx-auto px-4 -mt-24 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-7 border border-slate-100">
          <label
            className="text-sm font-bold mb-2 block"
            style={{ color: NAVY }}
          >
            احكيلنا وضعك
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="مثال: أنا مصري، سأنتقل إلى ألمانيا كطالب، وميزانيتي 1000 يورو"
            className="w-full h-28 p-4 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 transition"
            style={{ ["--tw-ring-color" as string]: GOLD }}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-4 text-white py-3.5 rounded-xl font-bold transition disabled:opacity-50 hover:brightness-110"
            style={{ backgroundColor: NAVY }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                جاري تحليل وضعك بالذكاء الاصطناعي...
              </span>
            ) : (
              "احصل على خطتك"
            )}{" "}
          </button>
        </div>
      </div>

      {/* ===== Feature cards (services style) ===== */}
      <section className="max-w-4xl mx-auto px-4 mt-14 mb-4">
        <div className="text-center mb-8">
          <p
            className="text-xs font-bold tracking-[0.2em] mb-2"
            style={{ color: GOLD }}
          >
            أدوات إضافية
          </p>
          <h2 className="text-2xl font-extrabold" style={{ color: NAVY }}>
            كل ما تحتاجه في رحلتك
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featureCards.map((card) => (
            <button
              key={card.key}
              onClick={card.onClick}
              className="group text-center bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
            >
              <div
                className="w-14 h-14 mx-auto rounded-full flex items-center justify-center text-2xl mb-3"
                style={{ backgroundColor: "#FFF7DD" }}
              >
                {card.icon}
              </div>
              <p className="font-bold mb-1" style={{ color: NAVY }}>
                {card.label}
              </p>
              <p className="text-xs text-slate-400">{card.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ===== Results ===== */}
      <div className="max-w-2xl mx-auto px-4 pb-16">
        {data && (
          <div
            ref={resultsRef}
            className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 mt-6"
          >
            <div className="flex flex-wrap gap-1 mb-6 border-b border-slate-100">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="px-3 py-3 text-sm font-semibold transition relative"
                  style={{
                    color: activeTab === tab.key ? NAVY : "#94A3B8",
                  }}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <span
                      className="absolute bottom-0 right-0 left-0 h-0.5"
                      style={{ backgroundColor: GOLD }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="text-slate-700 leading-relaxed">
              {activeTab === "steps" && (
                <ul className="list-disc pr-5 space-y-2">
                  {data.steps.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
              {activeTab === "documents" && (
                <ul className="list-disc pr-5 space-y-2">
                  {data.documents.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
              {activeTab === "costOfLiving" && <p>{data.costOfLiving}</p>}
              {activeTab === "banking" && <p>{data.banking}</p>}
              {activeTab === "transportation" && <p>{data.transportation}</p>}
              {activeTab === "commonMistakes" && (
                <ul className="list-disc pr-5 space-y-2">
                  {data.commonMistakes.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
              {activeTab === "checklist" && (
                <div>
                  <p className="text-sm text-slate-400 mb-3">
                    {checkedItems.size} من {data.checklist.length} مكتمل
                  </p>
                  <ul className="space-y-2">
                    {data.checklist.map((item, i) => (
                      <li
                        key={i}
                        onClick={() => toggleChecklistItem(i)}
                        className="flex items-center gap-2 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={checkedItems.has(i)}
                          onChange={() => toggleChecklistItem(i)}
                          className="w-4 h-4"
                        />
                        <span
                          className={
                            checkedItems.has(i)
                              ? "line-through text-slate-400"
                              : ""
                          }
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showEmergency && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={closeEmergency}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-red-600">🚨 وضع الطوارئ</h2>
              <button
                onClick={closeEmergency}
                className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            {!emergencyData && (
              <>
                <input
                  type="text"
                  value={emergencyCountry}
                  onChange={(e) => setEmergencyCountry(e.target.value)}
                  placeholder="الدولة اللي أنت فيها الآن (مثال: ألمانيا)"
                  className="w-full p-3 border border-slate-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <input
                  type="text"
                  value={emergencyNationality}
                  onChange={(e) => setEmergencyNationality(e.target.value)}
                  placeholder="جنسيتك (اختياري)"
                  className="w-full p-3 border border-slate-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                {emergencyError && (
                  <p className="text-red-500 text-sm mb-2">{emergencyError}</p>
                )}
                <button
                  onClick={handleEmergencySubmit}
                  disabled={emergencyLoading}
                  className="w-full bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition disabled:opacity-50"
                >
                  {emergencyLoading
                    ? "جاري البحث..."
                    : "احصل على معلومات الطوارئ"}
                </button>
              </>
            )}
            {emergencyData && (
              <div className="space-y-4 text-slate-700">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-red-50 rounded-xl p-3">
                    <p className="text-xs text-slate-500">الشرطة</p>
                    <p className="font-bold text-lg">{emergencyData.police}</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-3">
                    <p className="text-xs text-slate-500">الإسعاف</p>
                    <p className="font-bold text-lg">
                      {emergencyData.ambulance}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-3">
                    <p className="text-xs text-slate-500">المطافئ</p>
                    <p className="font-bold text-lg">{emergencyData.fire}</p>
                  </div>
                </div>
                <div>
                  <p className="font-medium mb-1">🏛️ السفارة</p>
                  <p className="text-sm">{emergencyData.embassyAdvice}</p>
                </div>
                <div>
                  <p className="font-medium mb-2">💬 عبارات أساسية</p>
                  <ul className="space-y-1 text-sm">
                    {emergencyData.emergencyPhrases.map((phrase, i) => (
                      <li
                        key={i}
                        className="flex justify-between bg-slate-50 rounded-lg px-3 py-2"
                      >
                        <span>{phrase.arabic}</span>
                        <span className="font-medium">{phrase.local}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-1">💡 نصيحة</p>
                  <p className="text-sm">{emergencyData.generalTip}</p>
                </div>
                <button
                  onClick={closeEmergency}
                  className="w-full bg-slate-800 text-white py-2 rounded-xl font-medium hover:bg-slate-700 transition"
                >
                  إغلاق
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showScams && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={closeScams}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-amber-600">
                ⚠️ تحذيرات من النصب
              </h2>
              <button
                onClick={closeScams}
                className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            {!scamData && (
              <>
                <input
                  type="text"
                  value={scamCountry}
                  onChange={(e) => setScamCountry(e.target.value)}
                  placeholder="الدولة اللي هتسافرلها (مثال: تركيا)"
                  className="w-full p-3 border border-slate-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                {scamError && (
                  <p className="text-red-500 text-sm mb-2">{scamError}</p>
                )}
                <button
                  onClick={handleScamSubmit}
                  disabled={scamLoading}
                  className="w-full bg-amber-500 text-white py-3 rounded-xl font-medium hover:bg-amber-600 transition disabled:opacity-50"
                >
                  {scamLoading ? "جاري البحث..." : "اعرض التحذيرات"}
                </button>
              </>
            )}
            {scamData && (
              <div className="space-y-3 text-slate-700">
                {scamData.scams.map((scam, i) => (
                  <div key={i} className="bg-amber-50 rounded-xl p-3">
                    <p className="font-bold mb-1">⚠️ {scam.title}</p>
                    <p className="text-sm mb-1">{scam.description}</p>
                    <p className="text-sm text-green-700">
                      ✅ {scam.howToAvoid}
                    </p>
                  </div>
                ))}
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-sm font-medium">
                    💡 {scamData.generalAdvice}
                  </p>
                </div>
                <button
                  onClick={closeScams}
                  className="w-full bg-slate-800 text-white py-2 rounded-xl font-medium hover:bg-slate-700 transition"
                >
                  إغلاق
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showBudget && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={closeBudget}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-emerald-600">
                💰 حاسبة تكلفة الرحلة
              </h2>
              <button
                onClick={closeBudget}
                className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            {!budgetData && (
              <>
                <input
                  type="text"
                  value={budgetDestination}
                  onChange={(e) => setBudgetDestination(e.target.value)}
                  placeholder="الوجهة (مثال: باريس)"
                  className="w-full p-3 border border-slate-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <input
                  type="number"
                  value={budgetDays}
                  onChange={(e) => setBudgetDays(e.target.value)}
                  placeholder="عدد الأيام"
                  className="w-full p-3 border border-slate-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <select
                  value={budgetStyle}
                  onChange={(e) => setBudgetStyle(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="اقتصادي">اقتصادي</option>
                  <option value="متوسط">متوسط</option>
                  <option value="فاخر">فاخر</option>
                </select>
                {budgetError && (
                  <p className="text-red-500 text-sm mb-2">{budgetError}</p>
                )}
                <button
                  onClick={handleBudgetSubmit}
                  disabled={budgetLoading}
                  className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition disabled:opacity-50"
                >
                  {budgetLoading ? "جاري الحساب..." : "احسب التكلفة"}
                </button>
              </>
            )}
            {budgetData && (
              <div className="space-y-3 text-slate-700">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-emerald-50 rounded-xl p-3">
                    <p className="text-xs text-slate-500">الإقامة</p>
                    <p className="font-bold">{budgetData.accommodation}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-3">
                    <p className="text-xs text-slate-500">الطعام</p>
                    <p className="font-bold">{budgetData.food}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-3">
                    <p className="text-xs text-slate-500">المواصلات</p>
                    <p className="font-bold">{budgetData.transportation}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-3">
                    <p className="text-xs text-slate-500">الأنشطة</p>
                    <p className="font-bold">{budgetData.activities}</p>
                  </div>
                </div>
                <div className="bg-slate-800 text-white rounded-xl p-3 text-center">
                  <p className="text-xs text-slate-300">الإجمالي التقريبي</p>
                  <p className="font-bold text-xl">{budgetData.total}</p>
                </div>
                <p className="text-sm">💡 {budgetData.tip}</p>
                <button
                  onClick={closeBudget}
                  className="w-full bg-slate-800 text-white py-2 rounded-xl font-medium hover:bg-slate-700 transition"
                >
                  إغلاق
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showTranslator && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={closeTranslator}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-600">🗣️ مترجم</h2>
              <button
                onClick={closeTranslator}
                className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            {!translatorData && (
              <>
                <textarea
                  value={translatorText}
                  onChange={(e) => setTranslatorText(e.target.value)}
                  placeholder="النص اللي عايز تترجمه (مثال: أين أقرب مستشفى؟)"
                  className="w-full h-20 p-3 border border-slate-200 rounded-xl mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="text"
                  value={translatorLang}
                  onChange={(e) => setTranslatorLang(e.target.value)}
                  placeholder="الدولة أو اللغة المستهدفة (مثال: اليابان)"
                  className="w-full p-3 border border-slate-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {translatorError && (
                  <p className="text-red-500 text-sm mb-2">{translatorError}</p>
                )}
                <button
                  onClick={handleTranslatorSubmit}
                  disabled={translatorLoading}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {translatorLoading ? "جاري الترجمة..." : "ترجم"}
                </button>
              </>
            )}
            {translatorData && (
              <div className="space-y-3 text-slate-700">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">
                    الترجمة ({translatorData.language})
                  </p>
                  <p className="font-bold text-lg">
                    {translatorData.translation}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">طريقة النطق</p>
                  <p className="text-sm">{translatorData.pronunciation}</p>
                </div>
                <button
                  onClick={closeTranslator}
                  className="w-full bg-slate-800 text-white py-2 rounded-xl font-medium hover:bg-slate-700 transition"
                >
                  إغلاق
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
