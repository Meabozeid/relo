import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { userInput } = await req.json();

    if (!userInput || userInput.trim().length === 0) {
      return NextResponse.json(
        { error: "من فضلك اكتب وضعك أولاً" },
        { status: 400 },
      );
    }

    const prompt = `
أنت مساعد سفر وهجرة ذكي اسمه "Relo". مهمتك تحليل وضع المستخدم التالي وإعطاؤه معلومات عملية ومنظمة.

وضع المستخدم: "${userInput}"

أعطني الرد بصيغة JSON فقط (بدون أي نص إضافي قبله أو بعده)، بالشكل التالي بالضبط:

{
  "documents": ["مستند 1", "مستند 2"],
  "steps": ["خطوة 1", "خطوة 2"],
  "costOfLiving": "وصف مختصر لتكلفة المعيشة",
  "banking": "كيفية فتح حساب بنكي",
  "transportation": "أفضل وسائل المواصلات",
  "commonMistakes": ["خطأ شائع 1", "خطأ شائع 2"],
  "checklist": ["مهمة 1", "مهمة 2", "مهمة 3"]
}

اجعل كل نقطة مختصرة وعملية، واستخدم اللغة العربية.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text ?? "";
    const cleanedText = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleanedText);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error generating travel advice:", error);
    return NextResponse.json(
      { error: "حصل خطأ أثناء معالجة طلبك، حاول تاني" },
      { status: 500 },
    );
  }
}
