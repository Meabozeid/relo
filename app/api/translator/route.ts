import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { text, targetLanguage } = await req.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "من فضلك اكتب النص المراد ترجمته" },
        { status: 400 },
      );
    }
    if (!targetLanguage || targetLanguage.trim().length === 0) {
      return NextResponse.json(
        { error: "من فضلك اكتب اللغة أو الدولة المستهدفة" },
        { status: 400 },
      );
    }

    const prompt = `
أنت مترجم سفر. ترجم النص التالي من العربية إلى اللغة المحلية المستخدمة في: "${targetLanguage}".

النص: "${text}"

أعطني الرد بصيغة JSON فقط (بدون أي نص إضافي)، بالشكل التالي بالضبط:

{
  "translation": "الترجمة",
  "pronunciation": "طريقة نطق تقريبية بالعربية",
  "language": "اسم اللغة المستخدمة",
  "langCode": "كود اللغة بصيغة BCP-47 مثل ja-JP أو de-DE أو fr-FR"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const responseText = response.text ?? "";
    const cleanedText = responseText.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleanedText);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error translating:", error);
    return NextResponse.json(
      { error: "حصل خطأ أثناء معالجة طلبك، حاول تاني" },
      { status: 500 },
    );
  }
}
