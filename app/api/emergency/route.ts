import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { country, nationality } = await req.json();

    if (!country || country.trim().length === 0) {
      return NextResponse.json(
        { error: "من فضلك اكتب اسم الدولة" },
        { status: 400 }
      );
    }

    const prompt = `
أنت مساعد طوارئ للمسافرين. المستخدم موجود حاليًا في دولة: "${country}"${
      nationality ? ` وجنسيته: "${nationality}"` : ""
    }.

أعطني الرد بصيغة JSON فقط (بدون أي نص إضافي)، بالشكل التالي بالضبط:

{
  "police": "رقم الشرطة",
  "ambulance": "رقم الإسعاف",
  "fire": "رقم المطافئ",
  "embassyAdvice": "نصيحة مختصرة عن كيفية إيجاد السفارة أو القنصلية",
  "emergencyPhrases": [
    { "arabic": "النجدة", "local": "الترجمة بلغة البلد المحلية" },
    { "arabic": "أحتاج طبيباً", "local": "الترجمة بلغة البلد المحلية" },
    { "arabic": "فقدت جواز سفري", "local": "الترجمة بلغة البلد المحلية" }
  ],
  "generalTip": "نصيحة عامة واحدة للسلامة في هذه الدولة تحديداً"
}

إذا كانت الدولة غير معروفة أو غير مكتوبة بشكل صحيح، أعد نفس البنية مع قيم توضح أن الدولة غير معروفة.
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
    console.error("Error generating emergency info:", error);
    return NextResponse.json(
      { error: "حصل خطأ أثناء معالجة طلبك، حاول تاني" },
      { status: 500 }
    );
  }
}