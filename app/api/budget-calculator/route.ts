import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { destination, days, travelStyle } = await req.json();

    if (!destination || destination.trim().length === 0) {
      return NextResponse.json(
        { error: "من فضلك اكتب اسم الوجهة" },
        { status: 400 },
      );
    }
    if (!days || Number(days) <= 0) {
      return NextResponse.json(
        { error: "من فضلك اكتب عدد أيام صحيح" },
        { status: 400 },
      );
    }

    const prompt = `
أنت مساعد تخطيط ميزانية سفر. المستخدم مسافر إلى: "${destination}" لمدة ${days} أيام، بأسلوب سفر: "${
      travelStyle || "متوسط"
    }".

أعطني الرد بصيغة JSON فقط (بدون أي نص إضافي)، بالشكل التالي بالضبط:

أعطني الرد بصيغة JSON فقط (بدون أي نص إضافي)، بالشكل التالي بالضبط:

{
  "accommodation": "القيمة يجب أن تكون نصاً يتضمن رمز الدولار، مثال: $250",
  "food": "القيمة يجب أن تكون نصاً يتضمن رمز الدولار، مثال: $120",
  "transportation": "القيمة يجب أن تكون نصاً يتضمن رمز الدولار، مثال: $60",
  "activities": "القيمة يجب أن تكون نصاً يتضمن رمز الدولار، مثال: $80",
  "total": "القيمة يجب أن تكون نصاً يتضمن رمز الدولار، مثال: $510",
  "tip": "نصيحة واحدة لتوفير المال في هذه الوجهة"
}

مهم جداً: كل قيمة تكلفة (accommodation, food, transportation, activities, total) يجب أن تبدأ برمز الدولار $ متبوعاً بالرقم مباشرة، وليس رقماً مجرداً. اجعل الأرقام واقعية ومبنية على معرفتك بتكلفة المعيشة الفعلية في هذه الوجهة.

اجعل الأرقام واقعية ومبنية على معرفتك بتكلفة المعيشة الفعلية في هذه الوجهة.
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
    console.error("Error calculating budget:", error);
    return NextResponse.json(
      { error: "حصل خطأ أثناء معالجة طلبك، حاول تاني" },
      { status: 500 },
    );
  }
}
