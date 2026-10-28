import { GroceryCategory, GroceryUnit } from '../types';

export interface AlternativeImageItem {
  label: string;
  url: string;
}

export interface GroceryMatchResult {
  englishName: string;
  hindiName: string;
  category: GroceryCategory;
  defaultUnit: GroceryUnit;
  suggestedPrice: number;
  imageUrl: string;
  alternativeImages?: AlternativeImageItem[];
  description: string;
  tags: string[];
}

export interface ImageSuggestion {
  id: string;
  label: string;
  imageUrl: string;
  isPrimary?: boolean;
  source: 'catalogue' | 'alternative' | 'category' | 'ai_prompt';
  prompt?: string;
}

// Category fallback images (high-definition, verified Unsplash photos)
export const CATEGORY_FALLBACK_IMAGES: Record<GroceryCategory, string> = {
  Vegetables: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
  Fruits: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500&auto=format&fit=crop&q=80',
  Dairy: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500&auto=format&fit=crop&q=80',
  Snacks: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80',
  Grains: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80',
  Beverages: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=80',
  Household: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=80',
  Others: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=80',
};

export function getCategoryFallbackImage(category: GroceryCategory | string): string {
  if (category in CATEGORY_FALLBACK_IMAGES) {
    return CATEGORY_FALLBACK_IMAGES[category as GroceryCategory];
  }
  return CATEGORY_FALLBACK_IMAGES.Others;
}

// Comprehensive Hindi (Devanagari), Hinglish (phonetic Latin), and English grocery catalogue
export const GROCERY_CATALOGUE: GroceryMatchResult[] = [
  // 1. Staples & Grains
  {
    englishName: 'Sugar',
    hindiName: 'चीनी (Sugar)',
    category: 'Grains',
    defaultUnit: 'kg',
    suggestedPrice: 44,
    imageUrl: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=500&auto=format&fit=crop&q=80',
    alternativeImages: [
      { label: 'Sugar Cubes', url: 'https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=500&auto=format&fit=crop&q=80' },
      { label: 'Brown Shakkar', url: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=500&auto=format&fit=crop&q=80' },
      { label: 'Sugar Spoon', url: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&auto=format&fit=crop&q=80' },
    ],
    description: 'Pure white crystalline sugar / shakkar',
    tags: ['चीनी', 'चिनी', 'chini', 'cheeni', 'sugar', 'shakar', 'shakkar', 'khand', 'bura', 'white sugar'],
  },
  {
    englishName: 'Wheat Flour (Atta)',
    hindiName: 'आटा (Atta / Flour)',
    category: 'Grains',
    defaultUnit: 'kg',
    suggestedPrice: 42,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80',
    alternativeImages: [
      { label: 'Chakki Grain', url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=80' },
      { label: 'Flour Bowl', url: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=80' },
    ],
    description: 'Fresh chakki whole wheat flour for soft rotis',
    tags: ['आटा', 'आटो', 'atta', 'aata', 'flour', 'wheat flour', 'gehun', 'chakki', 'wheat', 'aashirvaad'],
  },
  {
    englishName: 'Basmati Rice',
    hindiName: 'चावल (Rice)',
    category: 'Grains',
    defaultUnit: 'kg',
    suggestedPrice: 75,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80',
    alternativeImages: [
      { label: 'Rice in Bowl', url: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=500&auto=format&fit=crop&q=80' },
      { label: 'Paddy Rice', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80' },
    ],
    description: 'Long grain fragrant aged basmati rice',
    tags: ['चावल', 'chawal', 'rice', 'basmati', 'bhat', 'tandoori rice', 'biryani rice'],
  },
  {
    englishName: 'Lentils (Dal / Pulses)',
    hindiName: 'दाल (Dal / Pulses)',
    category: 'Grains',
    defaultUnit: 'kg',
    suggestedPrice: 130,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80',
    alternativeImages: [
      { label: 'Mixed Pulses', url: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=500&auto=format&fit=crop&q=80' },
      { label: 'Yellow Dal', url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&auto=format&fit=crop&q=80' },
    ],
    description: 'Toor, moong, masoor or chana dal',
    tags: ['दाल', 'dal', 'daal', 'toor', 'arhar', 'moong', 'masoor', 'chana dal', 'pulses', 'lentil', 'urad'],
  },
  {
    englishName: 'Besan (Gram Flour)',
    hindiName: 'बेसन (Besan)',
    category: 'Grains',
    defaultUnit: 'kg',
    suggestedPrice: 80,
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80',
    description: 'Pure chana dal besan flour for pakoras & sweets',
    tags: ['बेसन', 'besan', 'gram flour', 'chickpea flour'],
  },
  {
    englishName: 'Suji / Semolina',
    hindiName: 'सूजी (Suji / Rawa)',
    category: 'Grains',
    defaultUnit: 'kg',
    suggestedPrice: 50,
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=80',
    description: 'Granular suji for upma, halwa and idlis',
    tags: ['सूजी', 'suji', 'sooji', 'rawa', 'semolina'],
  },
  {
    englishName: 'Poha (Flattened Rice)',
    hindiName: 'पोहा (Poha)',
    category: 'Grains',
    defaultUnit: 'kg',
    suggestedPrice: 55,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80',
    description: 'Medium thick roasted flattened rice for breakfast',
    tags: ['पोहा', 'poha', 'flattened rice', 'chivda', 'aval'],
  },
  {
    englishName: 'Table Salt',
    hindiName: 'नमक (Salt)',
    category: 'Others',
    defaultUnit: 'kg',
    suggestedPrice: 28,
    imageUrl: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=500&auto=format&fit=crop&q=80',
    alternativeImages: [
      { label: 'Salt Shaker', url: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=500&auto=format&fit=crop&q=80' },
      { label: 'Rock Salt', url: 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=500&auto=format&fit=crop&q=80' },
    ],
    description: 'Iodized vacuum evaporated salt / Tata Salt',
    tags: ['नमक', 'namak', 'salt', 'sendha', 'rock salt', 'tata salt', 'kala namak'],
  },

  // 2. Dairy & Fresh Farm
  {
    englishName: 'Milk',
    hindiName: 'दूध (Milk)',
    category: 'Dairy',
    defaultUnit: 'ltr',
    suggestedPrice: 56,
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80',
    alternativeImages: [
      { label: 'Glass Bottle', url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop&q=80' },
      { label: 'Milk Pour', url: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=500&auto=format&fit=crop&q=80' },
      { label: 'Dairy Jug', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80' },
    ],
    description: 'Fresh cow or buffalo milk / Amul Taaza',
    tags: ['दूध', 'दोध', 'doodh', 'dudh', 'milk', 'dairy', 'taza', 'amul', 'toned milk', 'cow milk'],
  },
  {
    englishName: 'Desi Ghee',
    hindiName: 'घी (Desi Ghee)',
    category: 'Dairy',
    defaultUnit: 'ltr',
    suggestedPrice: 560,
    imageUrl: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=500&auto=format&fit=crop&q=80',
    alternativeImages: [
      { label: 'Ghee Jar', url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=80' },
    ],
    description: 'Pure aromatic golden desi cow ghee',
    tags: ['घी', 'ghee', 'desi ghee', 'clarified butter', 'cow ghee', 'amul ghee'],
  },
  {
    englishName: 'Fresh Paneer',
    hindiName: 'पनीर (Paneer)',
    category: 'Dairy',
    defaultUnit: 'g',
    suggestedPrice: 90,
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80',
    alternativeImages: [
      { label: 'Paneer Cubes', url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=80' },
    ],
    description: 'Soft malai cottage cheese cubes',
    tags: ['पनीर', 'paneer', 'cottage cheese', 'chenna', 'tofu'],
  },
  {
    englishName: 'Amul Butter',
    hindiName: 'मक्खन (Butter)',
    category: 'Dairy',
    defaultUnit: 'pack',
    suggestedPrice: 58,
    imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=80',
    description: 'Rich pasteurized table butter / Amul Butter',
    tags: ['मक्खन', 'butter', 'amul butter', 'makhan', 'white butter'],
  },
  {
    englishName: 'Fresh Curd / Dahi',
    hindiName: 'दही (Curd / Dahi)',
    category: 'Dairy',
    defaultUnit: 'pack',
    suggestedPrice: 35,
    imageUrl: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=500&auto=format&fit=crop&q=80',
    description: 'Thick creamy probiotic dahi / yoghurt',
    tags: ['दही', 'dahi', 'curd', 'yogurt', 'yoghurt', 'raita'],
  },
  {
    englishName: 'Cheese Slices / Cubes',
    hindiName: 'चीज़ (Cheese)',
    category: 'Dairy',
    defaultUnit: 'pack',
    suggestedPrice: 125,
    imageUrl: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&auto=format&fit=crop&q=80',
    description: 'Processed cheese slices & cubes for sandwiches',
    tags: ['चीज़', 'cheese', 'amul cheese', 'mozzarella', 'cheddar'],
  },
  {
    englishName: 'Farm Fresh Eggs',
    hindiName: 'अंडे (Eggs)',
    category: 'Dairy',
    defaultUnit: 'dozen',
    suggestedPrice: 84,
    imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop&q=80',
    alternativeImages: [
      { label: 'Eggs in Basket', url: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500&auto=format&fit=crop&q=80' },
      { label: 'Egg Carton', url: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?w=500&auto=format&fit=crop&q=80' },
    ],
    description: 'Farm fresh white or brown table eggs',
    tags: ['अंडे', 'अंडा', 'ande', 'anda', 'egg', 'eggs', 'poultry'],
  },

  // 3. Vegetables
  {
    englishName: 'Tomato',
    hindiName: 'टमाटर (Tomato)',
    category: 'Vegetables',
    defaultUnit: 'kg',
    suggestedPrice: 40,
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
    alternativeImages: [
      { label: 'Cherry Tomatoes', url: 'https://images.unsplash.com/photo-1546470427-e26264be0b11?w=500&auto=format&fit=crop&q=80' },
      { label: 'Fresh Basket', url: 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=500&auto=format&fit=crop&q=80' },
    ],
    description: 'Juicy ripe red farm tomatoes',
    tags: ['टमाटर', 'tamatar', 'tomato', 'tomatoes'],
  },
  {
    englishName: 'Potato',
    hindiName: 'आलू (Potato)',
    category: 'Vegetables',
    defaultUnit: 'kg',
    suggestedPrice: 35,
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=80',
    alternativeImages: [
      { label: 'Russet Potatoes', url: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=500&auto=format&fit=crop&q=80' },
    ],
    description: 'Clean medium curry and baking potatoes',
    tags: ['आलू', 'aloo', 'alu', 'potato', 'potatoes', 'batata'],
  },
  {
    englishName: 'Onion',
    hindiName: 'प्याज (Onion)',
    category: 'Vegetables',
    defaultUnit: 'kg',
    suggestedPrice: 38,
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=80',
    alternativeImages: [
      { label: 'Sliced Onions', url: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=500&auto=format&fit=crop&q=80' },
    ],
    description: 'Crisp pink flavor-rich onions / kanda',
    tags: ['प्याज', 'प्याज़', 'pyaz', 'kanda', 'onion', 'onions', 'dungri'],
  },
  {
    englishName: 'Green Chilli',
    hindiName: 'हरी मिर्च (Green Chilli)',
    category: 'Vegetables',
    defaultUnit: 'g',
    suggestedPrice: 20,
    imageUrl: 'https://images.unsplash.com/photo-1526346698789-2244974f26b6?w=500&auto=format&fit=crop&q=80',
    description: 'Spicy fresh green chillies for tadka',
    tags: ['हरी मिर्च', 'मिर्च', 'mirch', 'chilli', 'green chilli', 'hari mirch'],
  },
  {
    englishName: 'Fresh Coriander (Dhaniya)',
    hindiName: 'धनिया पत्ता (Coriander)',
    category: 'Vegetables',
    defaultUnit: 'pack',
    suggestedPrice: 15,
    imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&auto=format&fit=crop&q=80',
    description: 'Fresh fragrant green coriander leaves / kothmir',
    tags: ['धनिया', 'धनिया पत्ता', 'dhaniya', 'coriander', 'cilantro', 'kothmir'],
  },
  {
    englishName: 'Ginger (Adrak)',
    hindiName: 'अदरक (Ginger)',
    category: 'Vegetables',
    defaultUnit: 'g',
    suggestedPrice: 30,
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80',
    description: 'Fresh spicy ginger root for chai and cooking',
    tags: ['अदरक', 'adrak', 'ginger', 'adrakh'],
  },
  {
    englishName: 'Garlic (Lahsun)',
    hindiName: 'लहसुन (Garlic)',
    category: 'Vegetables',
    defaultUnit: 'g',
    suggestedPrice: 40,
    imageUrl: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=500&auto=format&fit=crop&q=80',
    description: 'White aromatic garlic cloves',
    tags: ['लहसुन', 'lahsun', 'lasun', 'garlic'],
  },
  {
    englishName: 'Lemon / Lime (Nimbu)',
    hindiName: 'नींबू (Lemon)',
    category: 'Vegetables',
    defaultUnit: 'piece',
    suggestedPrice: 25,
    imageUrl: 'https://images.unsplash.com/photo-1534960680480-ca9853707e10?w=500&auto=format&fit=crop&q=80',
    description: 'Juicy yellow lemons for nimbu pani & garnish',
    tags: ['नींबू', 'निंबू', 'nimbu', 'lemon', 'lime'],
  },
  {
    englishName: 'Carrot (Gajar)',
    hindiName: 'गाजर (Carrot)',
    category: 'Vegetables',
    defaultUnit: 'kg',
    suggestedPrice: 45,
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&auto=format&fit=crop&q=80',
    description: 'Crisp orange or red sweet salad carrots',
    tags: ['गाजर', 'gajar', 'carrot', 'carrots'],
  },
  {
    englishName: 'Green Peas (Matar)',
    hindiName: 'मटर (Green Peas)',
    category: 'Vegetables',
    defaultUnit: 'kg',
    suggestedPrice: 60,
    imageUrl: 'https://images.unsplash.com/photo-1592394533824-9440e5d68530?w=500&auto=format&fit=crop&q=80',
    description: 'Fresh sweet green tender peas',
    tags: ['मटर', 'matar', 'peas', 'green peas'],
  },
  {
    englishName: 'Cauliflower (Phool Gobhi)',
    hindiName: 'फूलगोभी (Cauliflower)',
    category: 'Vegetables',
    defaultUnit: 'piece',
    suggestedPrice: 40,
    imageUrl: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=500&auto=format&fit=crop&q=80',
    description: 'Clean compact white cauliflower head',
    tags: ['गोभी', 'फूलगोभी', 'gobhi', 'gobi', 'cauliflower', 'phool gobhi', 'cabbage', 'patta gobhi'],
  },
  {
    englishName: 'Spinach (Palak)',
    hindiName: 'पालक (Spinach)',
    category: 'Vegetables',
    defaultUnit: 'pack',
    suggestedPrice: 25,
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=80',
    description: 'Fresh tender green spinach leaves',
    tags: ['पालक', 'palak', 'spinach', 'saag'],
  },
  {
    englishName: 'Lady Finger (Bhindi)',
    hindiName: 'भिंडी (Bhindi / Okra)',
    category: 'Vegetables',
    defaultUnit: 'kg',
    suggestedPrice: 50,
    imageUrl: 'https://images.unsplash.com/photo-1627916607164-7b20241db935?w=500&auto=format&fit=crop&q=80',
    description: 'Crisp green tender bhindi okra',
    tags: ['भिंडी', 'bhindi', 'okra', 'lady finger'],
  },
  {
    englishName: 'Cucumber (Khira)',
    hindiName: 'खीरा (Cucumber)',
    category: 'Vegetables',
    defaultUnit: 'kg',
    suggestedPrice: 35,
    imageUrl: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=500&auto=format&fit=crop&q=80',
    description: 'Cool crisp salad cucumber / kakdi',
    tags: ['खीरा', 'ककड़ी', 'khira', 'kheera', 'cucumber', 'kakdi'],
  },

  // 4. Fruits
  {
    englishName: 'Sweet Apples',
    hindiName: 'सेब (Apple)',
    category: 'Fruits',
    defaultUnit: 'kg',
    suggestedPrice: 140,
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=80',
    alternativeImages: [
      { label: 'Green Apples', url: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=500&auto=format&fit=crop&q=80' },
      { label: 'Fresh Basket', url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500&auto=format&fit=crop&q=80' },
    ],
    description: 'Crisp sweet red Shimla & Kashmiri apples',
    tags: ['सेब', 'seb', 'apple', 'apples', 'kashmiri apple'],
  },
  {
    englishName: 'Bananas',
    hindiName: 'केला (Banana)',
    category: 'Fruits',
    defaultUnit: 'dozen',
    suggestedPrice: 60,
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=80',
    alternativeImages: [
      { label: 'Fresh Bunch', url: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500&auto=format&fit=crop&q=80' },
    ],
    description: 'Sweet yellow Robusta bananas',
    tags: ['केला', 'kela', 'banana', 'bananas'],
  },
  {
    englishName: 'Juicy Mangoes',
    hindiName: 'आम (Mango)',
    category: 'Fruits',
    defaultUnit: 'kg',
    suggestedPrice: 160,
    imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop&q=80',
    description: 'Sweet fragrant Alphonso, Kesar or Dasheri mangoes',
    tags: ['आम', 'aam', 'mango', 'mangoes', 'alphonso', 'kesar'],
  },
  {
    englishName: 'Fresh Oranges',
    hindiName: 'संतरा (Orange)',
    category: 'Fruits',
    defaultUnit: 'kg',
    suggestedPrice: 90,
    imageUrl: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=500&auto=format&fit=crop&q=80',
    description: 'Juicy sweet Nagpur oranges / mosambi',
    tags: ['संतरा', 'santra', 'orange', 'oranges', 'mosambi', 'narangi'],
  },
  {
    englishName: 'Sweet Grapes',
    hindiName: 'अंगूर (Grapes)',
    category: 'Fruits',
    defaultUnit: 'kg',
    suggestedPrice: 110,
    imageUrl: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500&auto=format&fit=crop&q=80',
    description: 'Seedless green or black sweet grapes',
    tags: ['अंगूर', 'angoor', 'grapes', 'grape'],
  },
  {
    englishName: 'Pomegranate (Anar)',
    hindiName: 'अनार (Pomegranate)',
    category: 'Fruits',
    defaultUnit: 'kg',
    suggestedPrice: 180,
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80',
    description: 'Ruby red sweet nutrient-rich pomegranate',
    tags: ['अनार', 'anar', 'pomegranate'],
  },
  {
    englishName: 'Papaya (Papita)',
    hindiName: 'पपीता (Papaya)',
    category: 'Fruits',
    defaultUnit: 'kg',
    suggestedPrice: 50,
    imageUrl: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=500&auto=format&fit=crop&q=80',
    description: 'Ripe sweet orange papaya',
    tags: ['पपीता', 'papita', 'papaya'],
  },

  // 5. Cooking Essentials & Oils
  {
    englishName: 'Cooking Oil',
    hindiName: 'तेल (Cooking Oil)',
    category: 'Household',
    defaultUnit: 'ltr',
    suggestedPrice: 155,
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80',
    alternativeImages: [
      { label: 'Oil Cruet', url: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=500&auto=format&fit=crop&q=80' },
    ],
    description: 'Refined sunflower, soybean or mustard cooking oil',
    tags: ['तेल', 'tel', 'oil', 'mustard oil', 'sarson', 'sunflower', 'refine', 'refined oil', 'fortune'],
  },
  {
    englishName: 'Spices & Garam Masala',
    hindiName: 'मसाले (Spices / Masala)',
    category: 'Others',
    defaultUnit: 'pack',
    suggestedPrice: 65,
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80',
    description: 'Haldi, mirchi, dhaniya powder, jeera & garam masala',
    tags: ['मसाले', 'मसाला', 'masala', 'haldi', 'turmeric', 'jeera', 'cumin', 'spices', 'garam masala', 'everest', 'catch'],
  },

  // 6. Beverages
  {
    englishName: 'Tea (Chai Patti)',
    hindiName: 'चाय (Tea / Chai)',
    category: 'Beverages',
    defaultUnit: 'pack',
    suggestedPrice: 120,
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80',
    alternativeImages: [
      { label: 'Hot Masala Chai', url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=80' },
      { label: 'Tea Leaves', url: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=500&auto=format&fit=crop&q=80' },
    ],
    description: 'Premium aromatic Assam black tea leaf / Red Label / Tata Tea',
    tags: ['चाय', 'chai', 'tea', 'chay', 'chai patti', 'tata tea', 'taj mahal', 'red label', 'wagh bakri'],
  },
  {
    englishName: 'Coffee Powder',
    hindiName: 'कॉफ़ी (Coffee)',
    category: 'Beverages',
    defaultUnit: 'pack',
    suggestedPrice: 175,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80',
    alternativeImages: [
      { label: 'Coffee Beans', url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500&auto=format&fit=crop&q=80' },
    ],
    description: 'Instant roast blend coffee powder / Nescafe / Bru',
    tags: ['कॉफ़ी', 'coffee', 'nescafe', 'bru', 'espresso', 'cappuccino'],
  },
  {
    englishName: 'Fruit Juice',
    hindiName: 'जूस (Juice)',
    category: 'Beverages',
    defaultUnit: 'pack',
    suggestedPrice: 110,
    imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=80',
    description: 'Real / Tropicana fresh mango, apple or mixed fruit juice',
    tags: ['जूस', 'juice', 'frooti', 'real juice', 'maaza', 'tropicana'],
  },
  {
    englishName: 'Bottled Mineral Water',
    hindiName: 'पानी (Water)',
    category: 'Beverages',
    defaultUnit: 'pack',
    suggestedPrice: 20,
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=500&auto=format&fit=crop&q=80',
    description: 'Packaged drinking water / Bisleri / Kinley',
    tags: ['पानी', 'water', 'mineral water', 'bisleri', 'kinley'],
  },

  // 7. Snacks & Bakery
  {
    englishName: 'Fresh Bread',
    hindiName: 'ब्रेड (Bread)',
    category: 'Snacks',
    defaultUnit: 'pack',
    suggestedPrice: 38,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80',
    alternativeImages: [
      { label: 'Artisan Loaf', url: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=500&auto=format&fit=crop&q=80' },
      { label: 'Bakery Rolls', url: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=500&auto=format&fit=crop&q=80' },
    ],
    description: 'Soft whole wheat or sandwich sliced bread loaf',
    tags: ['ब्रेड', 'bread', 'pav', 'loaf', 'bun', 'sandwich bread'],
  },
  {
    englishName: 'Biscuits & Cookies',
    hindiName: 'बिस्कुट (Biscuits)',
    category: 'Snacks',
    defaultUnit: 'pack',
    suggestedPrice: 30,
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=80',
    alternativeImages: [
      { label: 'Cookies Stack', url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&auto=format&fit=crop&q=80' },
    ],
    description: 'Parle-G, Marie Gold, Good Day, Oreo cookies',
    tags: ['बिस्कुट', 'biscuit', 'biscuits', 'cookie', 'cookies', 'parle', 'marie', 'rusk', 'good day', 'oreo'],
  },
  {
    englishName: 'Potato Chips & Namkeen',
    hindiName: 'चिप्स (Chips / Namkeen)',
    category: 'Snacks',
    defaultUnit: 'pack',
    suggestedPrice: 20,
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80',
    description: 'Lays, Kurkure, Haldiram bhujia & snacks',
    tags: ['चिप्स', 'नमकीन', 'chips', 'namkeen', 'lays', 'kurkure', 'bhujia', 'snack', 'haldiram'],
  },
  {
    englishName: 'Maggi Noodles',
    hindiName: 'मैगी (Maggi Noodles)',
    category: 'Snacks',
    defaultUnit: 'pack',
    suggestedPrice: 14,
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=80',
    description: 'Maggi 2-Minute masala noodles / pasta',
    tags: ['मैगी', 'maggi', 'noodles', 'pasta', 'yippee', 'chowmein'],
  },
  {
    englishName: 'Chocolates',
    hindiName: 'चॉकलेट (Chocolate)',
    category: 'Snacks',
    defaultUnit: 'piece',
    suggestedPrice: 50,
    imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500&auto=format&fit=crop&q=80',
    description: 'Cadbury Dairy Milk, KitKat, 5 Star',
    tags: ['चॉकलेट', 'chocolate', 'cadbury', 'dairy milk', 'kitkat'],
  },

  // 8. Household & Personal Care
  {
    englishName: 'Bath Soap & Body Wash',
    hindiName: 'साबुन (Soap)',
    category: 'Household',
    defaultUnit: 'piece',
    suggestedPrice: 45,
    imageUrl: 'https://images.unsplash.com/photo-1607006314488-dc7849e89d2c?w=500&auto=format&fit=crop&q=80',
    description: 'Lux, Dettol, Dove, Lifebuoy bathing bar',
    tags: ['साबुन', 'sabun', 'soap', 'bathing soap', 'lux', 'dettol', 'dove', 'lifebuoy'],
  },
  {
    englishName: 'Washing Powder / Detergent',
    hindiName: 'सर्फ (Detergent / Surf)',
    category: 'Household',
    defaultUnit: 'kg',
    suggestedPrice: 140,
    imageUrl: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=80',
    description: 'Surf Excel, Ariel, Tide laundry detergent powder',
    tags: ['सर्फ', 'डिटर्जेंट', 'surf', 'detergent', 'surf excel', 'ariel', 'tide', 'washing powder', 'rin'],
  },
  {
    englishName: 'Hair Shampoo',
    hindiName: 'शैम्पू (Shampoo)',
    category: 'Household',
    defaultUnit: 'pack',
    suggestedPrice: 120,
    imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=80',
    description: 'Clinic Plus, Head & Shoulders, Dove hair shampoo',
    tags: ['शैम्पू', 'shampoo', 'hair wash', 'conditioner', 'clinic plus', 'dove shampoo'],
  },
  {
    englishName: 'Toothpaste & Brush',
    hindiName: 'टूथपेस्ट (Toothpaste)',
    category: 'Household',
    defaultUnit: 'pack',
    suggestedPrice: 75,
    imageUrl: 'https://images.unsplash.com/photo-1559591937-e160a2b00511?w=500&auto=format&fit=crop&q=80',
    description: 'Colgate, Pepsodent, Patanjali Dant Kanti toothpaste',
    tags: ['टूथपेस्ट', 'कोलगेट', 'toothpaste', 'colgate', 'pepsodent', 'dant kanti', 'brush'],
  },
  {
    englishName: 'Dishwash Bar & Liquid',
    hindiName: 'बर्तन बार (Dishwash / Vim)',
    category: 'Household',
    defaultUnit: 'piece',
    suggestedPrice: 35,
    imageUrl: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=80',
    description: 'Vim bar, Pril lemon dishwashing liquid',
    tags: ['डिशवॉश', 'बर्तन साबुन', 'dishwash', 'vim', 'vim bar', 'pril', 'scrub'],
  },

  // 9. Dry Fruits
  {
    englishName: 'Cashews & Almonds (Dry Fruits)',
    hindiName: 'काजू बादाम (Dry Fruits)',
    category: 'Others',
    defaultUnit: 'g',
    suggestedPrice: 220,
    imageUrl: 'https://images.unsplash.com/photo-1508061252445-564b6fbc9045?w=500&auto=format&fit=crop&q=80',
    description: 'Premium whole cashews, almonds & raisins',
    tags: ['काजू', 'बादाम', 'kaju', 'badam', 'cashew', 'almond', 'dry fruits', 'kishmish', 'pista'],
  },
];

/**
 * Intelligent token-aware and Hindi-English matcher:
 * Tier 1: Exact matches on tags, englishName, hindiName
 * Tier 2: Exact word / token match (e.g. "chini 2kg" -> matches "chini")
 * Tier 3: Substring match only for meaningful keywords (length >= 3)
 */
export function autoMatchGrocery(rawInput: string): GroceryMatchResult | null {
  if (!rawInput) return null;
  const cleanInput = rawInput.trim().toLowerCase();
  if (!cleanInput) return null;

  // Split into individual words/tokens, removing symbols
  const tokens = cleanInput
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 0);

  // --- TIER 1: Exact string match on any tag or name ---
  for (const item of GROCERY_CATALOGUE) {
    if (
      item.englishName.toLowerCase() === cleanInput ||
      item.hindiName.toLowerCase() === cleanInput
    ) {
      return item;
    }
    for (const tag of item.tags) {
      if (tag.toLowerCase() === cleanInput) {
        return item;
      }
    }
  }

  // --- TIER 2: Exact token/word match ---
  // If user typed "chini 1kg", token "chini" matches tag "chini"
  for (const token of tokens) {
    for (const item of GROCERY_CATALOGUE) {
      for (const tag of item.tags) {
        if (tag.toLowerCase() === token) {
          return item;
        }
      }
      if (item.englishName.toLowerCase().split(/\s+/).includes(token)) {
        return item;
      }
    }
  }

  // --- TIER 3: Substring phrase match (length >= 3) ---
  for (const item of GROCERY_CATALOGUE) {
    for (const tag of item.tags) {
      const normTag = tag.toLowerCase();
      if (normTag.length >= 3) {
        // Does user phrase contain the tag? (e.g., "sugar packet", "amul milk")
        if (cleanInput.includes(normTag)) {
          return item;
        }
        // Does the tag contain user input? Only if user typed >= 3 chars
        if (cleanInput.length >= 3 && normTag.includes(cleanInput)) {
          return item;
        }
      }
    }
  }

  return null;
}

/**
 * Generates an automated commercial culinary image prompt for any grocery item name.
 */
export function generateImagePrompt(itemName: string, category: string = 'Vegetables'): string {
  const cleanName = itemName.trim() || category;
  return `Commercial studio culinary photograph of fresh ${cleanName}, warm studio softbox illumination, appetizing grocery packaging, clean neutral kitchen countertop, vibrant natural colors, ultra-high definition 4K`;
}

/**
 * Automated Image Suggestion Engine:
 * Returns the auto-selected primary image, alternative suggested images, and the AI prompt.
 */
export function getImageSuggestions(
  rawInput: string,
  currentCategory?: GroceryCategory
): { primaryImage: string; suggestions: ImageSuggestion[]; prompt: string } {
  const trimmed = rawInput.trim();
  const match = autoMatchGrocery(trimmed);
  const resolvedCategory: GroceryCategory = currentCategory || match?.category || 'Vegetables';
  const prompt = generateImagePrompt(trimmed || resolvedCategory, resolvedCategory);

  const suggestions: ImageSuggestion[] = [];

  if (match) {
    // 1. Primary Catalogue Match
    suggestions.push({
      id: `sug_${match.englishName}_primary`,
      label: 'Best Match',
      imageUrl: match.imageUrl,
      isPrimary: true,
      source: 'catalogue',
      prompt,
    });

    // 2. Alternative Images from catalogue
    if (match.alternativeImages && match.alternativeImages.length > 0) {
      match.alternativeImages.forEach((alt, idx) => {
        suggestions.push({
          id: `sug_${match.englishName}_alt_${idx}`,
          label: alt.label,
          imageUrl: alt.url,
          source: 'alternative',
          prompt: `${prompt} (${alt.label})`,
        });
      });
    }

    // 3. Category Fallback Image
    suggestions.push({
      id: `sug_${match.englishName}_cat`,
      label: `${match.category} Style`,
      imageUrl: getCategoryFallbackImage(match.category),
      source: 'category',
      prompt: `Fresh ${match.category} produce assortment`,
    });
  } else {
    // No direct match: generate automated suggestions based on category & prompt
    const categoryImg = getCategoryFallbackImage(resolvedCategory);

    suggestions.push({
      id: `sug_custom_primary`,
      label: `${resolvedCategory} Default`,
      imageUrl: categoryImg,
      isPrimary: true,
      source: 'category',
      prompt,
    });

    // Provide 2 related general grocery options
    suggestions.push({
      id: `sug_custom_pantry`,
      label: 'Fresh Pantry',
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80',
      source: 'ai_prompt',
      prompt: `${prompt} in fresh market crate`,
    });

    suggestions.push({
      id: `sug_custom_organic`,
      label: 'Organic Market',
      imageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=80',
      source: 'ai_prompt',
      prompt: `${prompt} organic farmers market aesthetic`,
    });
  }

  const primaryImage = suggestions[0]?.imageUrl || getCategoryFallbackImage(resolvedCategory);

  return {
    primaryImage,
    suggestions,
    prompt,
  };
}

/**
 * Quick suggestions for Indian grocery shopping
 */
export const POPULAR_HINDI_PRESETS = [
  { label: 'चीनी (Sugar)', name: 'Sugar', category: 'Grains' },
  { label: 'दूध (Milk)', name: 'Milk', category: 'Dairy' },
  { label: 'आटा (Atta)', name: 'Wheat Flour (Atta)', category: 'Grains' },
  { label: 'चावल (Rice)', name: 'Basmati Rice', category: 'Grains' },
  { label: 'दाल (Dal)', name: 'Lentils (Dal / Pulses)', category: 'Grains' },
  { label: 'तेल (Oil)', name: 'Cooking Oil', category: 'Household' },
  { label: 'चाय (Chai)', name: 'Tea (Chai)', category: 'Beverages' },
  { label: 'टमाटर (Tomato)', name: 'Tomato', category: 'Vegetables' },
  { label: 'आलू (Potato)', name: 'Potato', category: 'Vegetables' },
  { label: 'प्याज (Onion)', name: 'Onion', category: 'Vegetables' },
  { label: 'घी (Ghee)', name: 'Desi Ghee', category: 'Dairy' },
  { label: 'पनीर (Paneer)', name: 'Fresh Paneer', category: 'Dairy' },
  { label: 'नमक (Salt)', name: 'Table Salt', category: 'Others' },
  { label: 'अंडे (Eggs)', name: 'Farm Fresh Eggs', category: 'Dairy' },
];
