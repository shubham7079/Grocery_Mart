
import { GoogleGenAI, Type } from "@google/genai";
import { Product, Customer, Order } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getInventoryInsights = async (products: Product[]) => {
  try {
    const prompt = `Analyze this grocery inventory data and provide top 3 management recommendations: ${JSON.stringify(products)}`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a retail operations expert. Provide concise, actionable bullet-point insights.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Unable to generate insights at this time.";
  }
};

export const generateSalesSummary = async (orders: Order[]) => {
  try {
    const prompt = `Summarize the sales performance for these orders: ${JSON.stringify(orders)}`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "Provide a quick paragraph summary of sales trends.",
      },
    });
    return response.text;
  } catch (error) {
    return "Sales summary unavailable.";
  }
};
