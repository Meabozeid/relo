import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { country } = await req.json();

    if (!country || country.trim().length === 0) {
      return NextResponse.json(
        { error: "من فضلك اكتب اسم الدولة" },
        { status: 400 }
      );
    }

    const prompt = `
أنت مساعد سفر متخصص في توعية المسافرين من عمليات النصب الشائعة.

الدولة: "${country}"

أعطني الرد بصيغة JSON فقط (بدون أي نص إضافي)، بالشكل التالي بالضبط:

{
  "scams": [
    {
      "title": "اسم مختصر لعملية النصب",
      "description": "وصف مختصر لكيفية حدوثها",
      "howToAvoid": "نصيحة عملية لتجنبها"
    }
  ],
  "generalAdvice": "نصيحة عامة واحدة للحذر في هذه الدولة"
}

أعطني 4 إلى 5 عمليات نصب شائعة وحقيقية ومعروفة في هذه الدولة تحديداً. إذا كانت الدولة غير معروفة أو غير مكتوبة بشكل صحيح، أعد نفس البنية موضحاً أن الدولة غير معروفة.
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
    console.error("Error generating scam alerts:", error);
    return NextResponse.json(
      { error: "حصل خطأ أثناء معالجة طلبك، حاول تاني" },
      { status: 500 }
    );
  }
}