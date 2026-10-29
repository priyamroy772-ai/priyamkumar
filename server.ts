import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware for parsing JSON payloads (supporting base64 images up to 25MB)
app.use(express.json({ limit: '25mb' }));

// Initialize GoogleGenAI SDK with server-side API key and aistudio-build telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Cached greeting audio base64 so we don't regenerate on every reload
let cachedGreetingAudioBase64: string | null = null;

// GET /api/greet-voice - Generate or return sweet female voice saying "Hi Priyam!"
app.get('/api/greet-voice', async (_req, res) => {
  try {
    if (cachedGreetingAudioBase64) {
      return res.json({
        success: true,
        audioBase64: cachedGreetingAudioBase64,
        mimeType: 'audio/wav',
        cached: true,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: 'Hi Priyam!',
              speechMetadata: {
                style: 'Sweet, cheerful, warm, friendly and pleasant female greeting',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            // Kore is a prebuilt sweet female voice
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const audioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!audioBase64) {
      throw new Error('TTS did not return audio data');
    }

    cachedGreetingAudioBase64 = audioBase64;

    return res.json({
      success: true,
      audioBase64,
      mimeType: 'audio/wav',
      cached: false,
    });
  } catch (error: any) {
    console.error('TTS generation error in /api/greet-voice:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate voice greeting',
    });
  }
});

// POST /api/parse-receipt - Parse image of a receipt or grocery items using Gemini 3.8 Flash Vision
app.post('/api/parse-receipt', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        error: 'Missing imageBase64 in request body',
      });
    }

    let cleanBase64 = String(imageBase64).trim();
    let actualMime = mimeType || 'image/jpeg';

    // Extract exact data URL mimeType and pure base64 payload
    const dataUriPrefixMatch = cleanBase64.match(/^data:([^;]+);base64,(.*)$/s);
    if (dataUriPrefixMatch) {
      actualMime = dataUriPrefixMatch[1].trim() || 'image/jpeg';
      cleanBase64 = dataUriPrefixMatch[2].trim();
    } else {
      cleanBase64 = cleanBase64.replace(/^data:[^;]+;base64,/, '').trim();
    }

    // Normalize mimeType
    if (actualMime.includes('png')) actualMime = 'image/png';
    else if (actualMime.includes('webp')) actualMime = 'image/webp';
    else if (actualMime.includes('gif')) actualMime = 'image/gif';
    else actualMime = 'image/jpeg';

    // Strip internal newlines/spaces
    cleanBase64 = cleanBase64.replace(/\s+/g, '');

    if (!cleanBase64 || cleanBase64.length < 50) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or empty image payload',
      });
    }

    const promptText = `
You are an expert grocery OCR assistant for the 'Priyam Grocery Manager' application.
Carefully inspect this image, which may be:
- A printed supermarket / retail store grocery receipt or bill (DMart, Reliance Fresh, BigBasket, Nature's Basket, etc.)
- A local Indian kirana / vegetable shop handwritten or printed slip
- A photo of physical food, pantry, produce, dairy, or beverage products

TASK:
1. Extract every individual grocery item detected in the image.
2. For each item:
   - "name": Clean, concise English or standard Hindi item name (e.g. "Amul Full Cream Milk", "Tomatoes", "Brown Bread", "Tata Salt", "Basmati Rice", "Sugar", "Onions").
   - "quantity": Number detected (e.g. 1, 2, 0.5, 3). Default to 1 if not specified.
   - "unit": Best matching unit from: "kg", "g", "ltr", "ml", "piece", "pack", "dozen".
   - "price": Price in Indian Rupees (₹). If printed on receipt, use that exact price. If photo of items without price, estimate realistic retail market price in ₹ INR.
   - "category": Must be one of: "Vegetables", "Fruits", "Dairy", "Snacks", "Grains", "Beverages", "Household", "Others".
   - "notes": Optional brief description, brand, or weight notes.

3. "merchantName": Supermarket or store name if visible, or empty string.
4. "receiptTotal": Total bill amount if printed, or 0.

Return the result strictly conforming to the requested JSON schema.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: actualMime,
              },
            },
            {
              text: promptText,
            },
          ],
        },
      ],
      config: {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            merchantName: {
              type: Type.STRING,
              description: 'Name of the supermarket, store or vendor if present.',
            },
            receiptTotal: {
              type: Type.NUMBER,
              description: 'Total bill amount if printed on the receipt.',
            },
            items: {
              type: Type.ARRAY,
              description: 'List of detected grocery items.',
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  unit: {
                    type: Type.STRING,
                    description: 'One of kg, g, ltr, ml, piece, pack, dozen',
                  },
                  price: { type: Type.NUMBER },
                  category: {
                    type: Type.STRING,
                    description: 'Vegetables, Fruits, Dairy, Snacks, Grains, Beverages, Household, or Others',
                  },
                  notes: { type: Type.STRING },
                },
                required: ['name', 'quantity', 'unit', 'price', 'category'],
              },
            },
          },
          required: ['items'],
        },
      },
    });

    let responseText = response.text || '{}';
    responseText = responseText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
    let parsedData: any = {};
    try {
      parsedData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Gemini JSON output', responseText);
      return res.status(500).json({
        success: false,
        error: 'AI generated invalid JSON structure',
      });
    }

    const items = Array.isArray(parsedData.items) ? parsedData.items : [];

    return res.json({
      success: true,
      items: items.map((item: any, idx: number) => ({
        id: `parsed_${Date.now()}_${idx}`,
        name: String(item.name || 'Grocery Item').trim(),
        quantity: Math.max(0.1, Number(item.quantity) || 1),
        unit: ['kg', 'g', 'ltr', 'ml', 'piece', 'pack', 'dozen'].includes(item.unit)
          ? item.unit
          : 'piece',
        price: Math.max(0, Math.round(Number(item.price) || 0)),
        category: [
          'Vegetables',
          'Fruits',
          'Dairy',
          'Snacks',
          'Grains',
          'Beverages',
          'Household',
          'Others',
        ].includes(item.category)
          ? item.category
          : 'Vegetables',
        notes: item.notes || '',
        selected: true,
      })),
      merchantName: parsedData.merchantName || '',
      receiptTotal: parsedData.receiptTotal || 0,
    });
  } catch (error: any) {
    console.error('Error parsing receipt with Gemini:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze image with AI',
    });
  }
});

// Setup Vite in development or static serving in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Development mode: mount Vite middlewares
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: serve built assets
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Priyam Grocery Manager server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
