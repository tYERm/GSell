import { Injectable, inject } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;
  private langService = inject(LanguageService);

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env['API_KEY'] || '' });
  }

  async generateProducts(query: string): Promise<any[]> {
    const lang = this.langService.currentLang();
    const langName = lang === 'ru' ? 'Russian' : 'English';
    
    // Customize prompt based on language to ensure response is in correct language
    const prompt = `Generate a list of 8 realistic e-commerce products for a store section based on the search query: "${query}".
    If the query is empty or generic, generate "Trending Mixed Products (Electronics, Home, Clothes)".
    Ensure prices are realistic numbers.
    The description should be short (1 sentence).
    Category should be a single word.
    
    IMPORTANT: Respond completely in ${langName} language.
    `;

    const schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          price: { type: Type.NUMBER },
          oldPrice: { type: Type.NUMBER, description: "A slightly higher price to show a discount, or null if no discount" },
          category: { type: Type.STRING },
          shortDescription: { type: Type.STRING },
          rating: { type: Type.NUMBER, description: "Between 3.5 and 5.0" },
          reviewsCount: { type: Type.INTEGER }
        },
        required: ["id", "name", "price", "category", "shortDescription", "rating", "reviewsCount"]
      }
    };

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema,
          temperature: 0.7
        }
      });

      const text = response.text;
      if (!text) return [];
      return JSON.parse(text);
    } catch (error) {
      console.error('Gemini API Error:', error);
      return [];
    }
  }

  async generateProductDetails(productName: string, category: string): Promise<any> {
    const lang = this.langService.currentLang();
    const langName = lang === 'ru' ? 'Russian' : 'English';

    const prompt = `Generate detailed product specifications and a long description for a product named "${productName}" in the category "${category}".
    Include 3 key features and a list of technical specs.
    
    IMPORTANT: Respond completely in ${langName} language.
    `;

    const schema = {
      type: Type.OBJECT,
      properties: {
        longDescription: { type: Type.STRING },
        features: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        specs: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              value: { type: Type.STRING }
            }
          }
        }
      }
    };

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema
        }
      });

      const text = response.text;
      if (!text) return null;
      return JSON.parse(text);
    } catch (error) {
      console.error('Gemini Details Error:', error);
      return null;
    }
  }
}
