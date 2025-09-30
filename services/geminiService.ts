
import { GoogleGenAI, Type } from "@google/genai";
import type { SearchResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      carName: {
        type: Type.STRING,
        description: "اسم السيارة، مثلا 'Dacia Duster 2022'",
      },
      price: {
        type: Type.NUMBER,
        description: "ثمن السيارة بالدرهم المغربي",
      },
      year: {
        type: Type.NUMBER,
        description: "سنة الصنع",
      },
      mileage: {
        type: Type.NUMBER,
        description: "عدد الكيلومترات المقطوعة",
      },
      location: {
        type: Type.STRING,
        description: "المدينة التي توجد بها السيارة",
      },
      source: {
        type: Type.STRING,
        description: "الموقع الذي وجد فيه الإعلان، يجب أن يكون واحدا من: 'Avito.ma', 'Moteur.ma', 'Wandaloo.com', 'Voiture.ma'",
      },
      imageUrl: {
        type: Type.STRING,
        description: "رابط صورة للسيارة. استخدم رابط من picsum.photos.",
      },
    },
    required: ["carName", "price", "year", "mileage", "location", "source", "imageUrl"],
  },
};

export async function fetchCarListings(query: string): Promise<SearchResult[]> {
  try {
    const prompt = `
      أنت محرك بحث مغربي متخصص في تجميع إعلانات السيارات من عدة مواقع.
      ابحث عن إعلانات للسيارة التالية: "${query}".
      
      قم بإرجاع قائمة من 8 إلى 12 نتيجة بحث.
      يجب أن تكون النتائج متنوعة من حيث سنة الصنع، الكيلومتراج، والثمن لتعكس واقع السوق.
      يجب أن تكون المصادر متنوعة بين 'Avito.ma', 'Moteur.ma', 'Wandaloo.com', 'Voiture.ma'.
      استخدم مدن مغربية مختلفة مثل الدار البيضاء، الرباط، مراكش، طنجة، أكادير.
      لكل نتيجة، استخدم رابط صورة من picsum.photos/400/300.
      
      مثال للبحث: "Clio 4"
      مثال للبحث: "audi a3 s line diesel"
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8,
      },
    });

    const jsonString = response.text.trim();
    if (!jsonString) {
        console.warn("Gemini API returned an empty string.");
        return [];
    }

    const results = JSON.parse(jsonString);
    // Ensure the result is an array before returning
    return Array.isArray(results) ? results : [];

  } catch (error) {
    console.error("Error fetching car listings from Gemini API:", error);
    throw new Error("Failed to fetch car listings.");
  }
}
