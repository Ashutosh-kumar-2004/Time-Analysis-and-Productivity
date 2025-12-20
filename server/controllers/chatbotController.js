import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY_FOR_CHATBOT,
});

const getChatResponse = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Build conversation safely
    const contents = [
      {
        role: "user",
        parts: [
          { text: "You are a productivity and time-analysis assistant." },
        ],
      },
      ...(Array.isArray(history)
        ? history.map((h) => ({
            role: h.role, // "user" | "model"
            parts: [{ text: h.text }],
          }))
        : []),
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // ✅ BEST for apps
      contents,
    });

    res.status(200).json({
      text: response.text,
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export { getChatResponse };
