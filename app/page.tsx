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

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<TravelData | null>(null);
  const [activeTab, setActiveTab] = useState<string>("steps");

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
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
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
    </main>
  );
}