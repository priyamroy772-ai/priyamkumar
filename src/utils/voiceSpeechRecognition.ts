import { GroceryUnit, GroceryCategory } from '../types';
import { autoMatchGrocery, getCategoryFallbackImage } from './groceryAutoMatcher';

export interface ParsedVoiceItem {
  rawTranscript: string;
  cleanedName: string;
  quantity: number;
  unit: GroceryUnit;
  category: GroceryCategory;
  price: number;
  imageUrl: string;
}

/**
 * Parses spoken voice input into grocery fields.
 * Handles English, Hindi, and Hinglish speech patterns:
 * Examples:
 * - "2 kg sugar" -> name: "Sugar", quantity: 2, unit: "kg"
 * - "sugar 1 kilo" -> name: "Sugar", quantity: 1, unit: "kg"
 * - "दो किलो चीनी" -> name: "चीनी", quantity: 2, unit: "kg"
 * - "1 litre milk" -> name: "Milk", quantity: 1, unit: "ltr"
 * - "500 gram paneer" -> name: "Fresh Paneer", quantity: 500, unit: "g"
 * - "bread" -> name: "Fresh Bread", quantity: 1, unit: "pack"
 */
export function parseVoiceGroceryInput(transcript: string): ParsedVoiceItem {
  const trimmed = transcript.trim();
  let text = trimmed.toLowerCase();

  let quantity = 1;
  let unit: GroceryUnit = 'kg';

  // 1. Check for Hindi number words
  const hindiNumbers: Record<string, number> = {
    'एक': 1,
    'दो': 2,
    'तीन': 3,
    'चार': 4,
    'पांच': 5,
    'पाँच': 5,
    'छह': 6,
    'सात': 7,
    'आठ': 8,
    'नौ': 9,
    'दस': 10,
    'आधा': 0.5,
    'डेढ़': 1.5,
    'ढाई': 2.5,
  };

  for (const [word, num] of Object.entries(hindiNumbers)) {
    const regex = new RegExp(`\\b${word}\\b`, 'gu');
    if (regex.test(text)) {
      quantity = num;
      text = text.replace(regex, ' ').trim();
      break;
    }
  }

  // 2. Check for numeric digits (e.g. "2.5", "500", "2", "1")
  const digitMatch = text.match(/\b(\d+(?:\.\d+)?)\b/);
  if (digitMatch) {
    const parsedNum = parseFloat(digitMatch[1]);
    if (!isNaN(parsedNum) && parsedNum > 0) {
      quantity = parsedNum;
      text = text.replace(digitMatch[0], ' ').trim();
    }
  }

  // 3. Extract Units (English & Hindi)
  if (/\b(kg|kgs|kilo|kilos|kilogram|किलो|किलोग्राम)\b/i.test(text)) {
    unit = 'kg';
    text = text.replace(/\b(kg|kgs|kilo|kilos|kilogram|किलो|किलोग्राम)\b/gi, ' ').trim();
  } else if (/\b(gram|grams|gm|gms|ग्राम)\b/i.test(text)) {
    unit = 'g';
    text = text.replace(/\b(gram|grams|gm|gms|ग्राम)\b/gi, ' ').trim();
  } else if (/\b(ltr|litre|liter|litres|liters|लीटर)\b/i.test(text)) {
    unit = 'ltr';
    text = text.replace(/\b(ltr|litre|liter|litres|liters|लीटर)\b/gi, ' ').trim();
  } else if (/\b(ml|milli|millilitre|मिली)\b/i.test(text)) {
    unit = 'ml';
    text = text.replace(/\b(ml|milli|millilitre|मिली)\b/gi, ' ').trim();
  } else if (/\b(dozen|dozens|दर्जन)\b/i.test(text)) {
    unit = 'dozen';
    text = text.replace(/\b(dozen|dozens|दर्जन)\b/gi, ' ').trim();
  } else if (/\b(packet|packets|pack|packs|पैकेट)\b/i.test(text)) {
    unit = 'pack';
    text = text.replace(/\b(packet|packets|pack|packs|पैकेट)\b/gi, ' ').trim();
  } else if (/\b(piece|pieces|pc|pcs|पीस)\b/i.test(text)) {
    unit = 'piece';
    text = text.replace(/\b(piece|pieces|pc|pcs|पीस)\b/gi, ' ').trim();
  }

  // Clean up any remaining filler words (e.g. "add", "please", "chahiye", "लाओ", "जोड़ो", "खरीदना")
  text = text
    .replace(/\b(add|please|give|me|buy|chahiye|lao|le|lo|kardo|dalo|लेना|चाहिए|लाओ|जोड़ो)\b/gi, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // If text became empty, fallback to the original trimmed transcript
  const cleanedName = text || trimmed;

  // Auto match catalogue
  const match = autoMatchGrocery(cleanedName);
  const category: GroceryCategory = match?.category || 'Vegetables';
  const price = match?.suggestedPrice || 40;
  const imageUrl = match?.imageUrl || getCategoryFallbackImage(category);

  // If matched item has default unit and none was explicitly spoken, use it
  if (match?.defaultUnit && !digitMatch && unit === 'kg') {
    unit = match.defaultUnit;
  }

  return {
    rawTranscript: trimmed,
    cleanedName: match ? match.englishName : cleanedName.charAt(0).toUpperCase() + cleanedName.slice(1),
    quantity,
    unit,
    category,
    price,
    imageUrl,
  };
}
