"use client";

import { useState } from "react";

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

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<TravelData | null>(null);
  const [activeTab, setActiveTab] = useState<string>("steps");

  const [showEmergency, setShowEmergency] = useState(false);
  const [emergencyCountry, setEmergencyCountry] = useState("");
  const [emergencyNationality, setEmergencyNationality] = useState("");
  const [emergencyLoading, setEmergencyLoading] = useState(false);
  const [emergencyError, setEmergencyError] = useState("");
  const [emergencyData, setEmergencyData] = useState<EmergencyData | null>(
    null
  );

  const [showScams, setShowScams] = useState(false);
  const [scamCountry, setScamCountry] = useState("");
  const [scamLoading, setScamLoading] = useState(false);
  const [scamError, setScamError] = useState("");
  const [scamData, setScamData] = useState<ScamData | null>(null);

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

  const handleSubmit = async () => {
    if (!input.trim()) {
      setError("من فضلك اكتب وضعك أولاً");
      return;
    }

    setLoading(true);
    setError("");
    setData(null);

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

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-10"
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-end gap-2 mb-4">
          <button
            onClick={() => setShowScams(true)}
            className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-amber-600 transition"
          >
            ⚠️ تحذيرات النصب
          </button>
          <button
            onClick={() => setShowEmergency(true)}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-700 transition"
          >
            🚨 وضع الطوارئ
          </button>
        </div>

        <h1 className="text-4xl font-bold text-center text-slate-800 mb-2">
          Relo
        </h1>
        <p className="text-center text-slate-500 mb-8">
          مستشارك الشخصي قبل السفر أو الهجرة لأي دولة
        </p>

        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="مثال: أنا مصري، سأنتقل إلى ألمانيا كطالب، وميزانيتي 1000 يورو"
            className="w-full h-28 p-4 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-4 bg-slate-800 text-white py-3 rounded-xl font-medium hover:bg-slate-700 transition disabled:opacity-50"
          >
            {loading ? "جاري التحليل..." : "احصل على خطتك"}
          </button>
        </div>

        {data && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex flex-wrap gap-2 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    activeTab === tab.key
                      ? "bg-slate-800 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
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
                <ul className="space-y-2">
                  {data.checklist.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
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
              <h2 className="text-xl font-bold text-red-600">
                🚨 وضع الطوارئ
              </h2>
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
                  <p className="text-red-500 text-sm mb-2">
                    {emergencyError}
                  </p>
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
    </main>
  );
}