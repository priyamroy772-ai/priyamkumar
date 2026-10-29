# AI-Powered Quick Add (Camera & Receipt Parsing)

Implement an AI-assisted 'Quick Add' feature in the grocery checklist that lets users snap a live photo of a paper receipt or grocery items using their camera (or upload from gallery), extracts all items with quantities, units, categories, and prices via server-side Gemini 3.8 Flash multimodal intelligence, and presents an interactive review modal before saving to the grocery list.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed in Phase 1 and govern the implementation:

- **Confirmed Decision 1 (Review Flow)**: User confirmed a dedicated **Review & Edit Modal** showing all parsed items with editable names, quantities, units, prices, and categories with selective checkboxes before committing to the grocery list.
- **Confirmed Decision 2 (Input Methods)**: User confirmed supporting **both live camera capture** (with live viewfinder stream and snap button) and **gallery photo upload** (for existing photos/receipts).
- **Backend Architecture**: Deploy a server-side proxy endpoint `/api/parse-receipt` in `server.ts` powered by `@google/genai` with model `gemini-3.8-flash` to securely parse image data without exposing API keys.

---

## 1. Overview & Core Concept

- **What It Does**: Adds an intuitive, high-visibility **"Quick Add (AI Camera)"** button adjacent to the existing search & voice controls in the Grocery List screen. Clicking opens a camera/upload viewfinder where users snap or pick an image of a grocery receipt, shopping bill, or a batch of pantry items/groceries. An AI vision pipeline identifies item names, quantities, units, estimated or printed prices, and automatically matches them to app categories.
- **Target Audience**: Busy shoppers and homemakers who want to add 5–10 items in seconds rather than typing or dictating each item one-by-one.
- **Key Value**: Saves 90% of manual data entry time after shopping or when taking stock of kitchen supplies.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Triggering Quick Add**:
   - In the **My List** (`GroceryListScreen`) toolbar, alongside the Search and Voice-to-Text buttons, a camera action button **"AI Quick Add"** with a camera + sparkle badge is displayed.
   - Also accessible from the Quick Actions section on the Home screen.
2. **Camera / Photo Capture Modal**:
   - Clean, rounded bottom-sheet/modal interface with two tabs: **Camera Viewfinder** and **Upload Photo**.
   - **Camera Tab**: Requests standard browser webcam permissions (`navigator.mediaDevices.getUserMedia`), renders a live video preview with subtle corner alignment reticle guide for receipts, a camera flip button (environment/user camera), and a circular shutter button.
   - **Upload Tab**: Drag-and-drop / file picker zone supporting JPEG, PNG, WEBP, and HEIC files.
   - Photo preview with a **"Scan with AI"** action button and a **"Retake"** option.
3. **AI Parsing State**:
   - Smooth animated scanner bar moving vertically over the captured image.
   - Friendly status indicators: *"Analyzing receipt & grocery items..."*, *"Detecting prices & quantities..."*.
4. **Editable Review & Confirmation Screen**:
   - Displays a summary pill: *"Found X items"*.
   - Tabular list where each parsed item is displayed in an editable row:
     - Checkbox (select all / individual toggle)
     - Grocery icon / auto-matcher visual badge
     - Name input field
     - Quantity & Unit selector (`kg`, `g`, `pack`, `piece`, etc.)
     - Price input (in ₹)
     - Category dropdown (pre-filled by AI)
     - Delete row button
   - Summary of selected items count and total estimated cost.
   - Primary action button: **"Add X Items to Grocery List"** with instant feedback toast.

### Visual Identity & Layout

- **Color Tokens**:
  - Primary button: Warm amber-gold gradient (`from-[#FFD21F] to-[#F5B800]`) with dark charcoal text (`#1E2022`).
  - Scanner highlight: Emerald cyan glow (`#10B981` / `#06B6D4`) with translucent gradient line.
  - Camera viewport: Sleek dark slate bezel with high-contrast white reticle guidelines.
- **Typography**: Clean display headings paired with tabular figures (`font-mono tabular-nums`) for currency and quantities.
- **Ergonomics**: Minimum 44px touch targets on mobile for shutter and row checkboxes.

---

## 3. Key Product Decisions & Trade-Offs

- **Server-Side Gemini 3.8 Flash**:
  - *Chosen Approach*: Handle image parsing via `ai.models.generateContent` on Express server (`server.ts`) at `/api/parse-receipt`.
  - *Why*: In strict accordance with platform guidelines, no API keys are exposed to the client. `gemini-3.8-flash` delivers state-of-the-art multimodal vision latency (~1.5–2s) and structured JSON parsing.
- **Camera Fallback to File Upload**:
  - *Chosen Approach*: Provide both `navigator.mediaDevices` live stream and standard `<input type="file" accept="image/*" capture="environment">`.
  - *Why*: If the browser or environment denies webcam permissions or runs on devices without active camera feeds, file upload ensures 100% usability.
- **Catalog & Price Auto-Matching Integration**:
  - *Chosen Approach*: Run detected item names through the local `autoMatchGrocery` engine so that high-resolution visuals, icons, and Hindi/English synonyms are instantly assigned.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRIYAM GROCERY MANAGER                         │
│                                                                        │
│   GroceryListScreen (Toolbar: Search | Voice | [📷 AI Quick Add])      │
│                               │                                        │
│                               ▼                                        │
│                    QuickAddCameraModal.tsx                             │
│     ┌──────────────────────────────────────────────────────────┐       │
│     │ • Tab 1: Live Webcam Viewfinder (getUserMedia + canvas)  │       │
│     │ • Tab 2: File Picker (Receipt / Grocery Photo)           │       │
│     │ • Shutter / Capture Button -> Image Base64 Data          │       │
│     └─────────────────────────┬────────────────────────────────┘       │
│                               │ POST /api/parse-receipt (base64 image) │
│                               ▼                                        │
│                      server.ts (Express)                               │
│     ┌──────────────────────────────────────────────────────────┐       │
│     │ @google/genai SDK (gemini-3.8-flash)                     │       │
│     │ • System Instruction: Parse receipts & groceries to JSON │       │
│     │ • Structured JSON Schema output                          │       │
│     └─────────────────────────┬────────────────────────────────┘       │
│                               │ Parsed items: [{ name, qty, price... }]│
│                               ▼                                        │
│                     ParsedItemsReviewModal                             │
│     ┌──────────────────────────────────────────────────────────┐       │
│     │ • Editable list with checkboxes, price, quantity, units  │       │
│     │ • Auto-matched category & grocery visuals                │       │
│     │ • "Add Selected Items" Button                            │       │
│     └─────────────────────────┬────────────────────────────────┘       │
│                               │                                        │
│                               ▼                                        │
│                  GroceryContext.addItem() (Batch)                      │
│     ┌──────────────────────────────────────────────────────────┐       │
│     │ • Appends items to active checklist                      │       │
│     │ • Updates budget & expenditure calculations              │       │
│     │ • Syncs with localStorage / persistent state             │       │
│     └──────────────────────────────────────────────────────────┘       │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Schema & Types

```typescript
export interface ParsedGroceryCandidate {
  id: string;
  name: string;
  quantity: number;
  unit: GroceryUnit;
  price: number;
  category: GroceryCategory;
  confidence?: number;
  selected: boolean;
}
```

### Component & Execution Plan

1. **`server.ts`**:
   - Setup full-stack Express server mounting `vite.middlewares` in development.
   - Endpoint: `POST /api/parse-receipt` accepting `{ imageBase64, mimeType }`.
   - Call `@google/genai` with `gemini-3.8-flash` and structured JSON schema for items array.
2. **`package.json`**:
   - Update dev script: `"dev": "tsx server.ts"`, `"start": "node server.js"`.
3. **`QuickAddCameraModal.tsx`**:
   - Live camera stream via HTML5 `<video>` + `<canvas>` frame grabber.
   - File upload input as alternative tab.
   - Review and editing table with bulk add capability.
4. **`GroceryListScreen.tsx`**:
   - Add the Quick Add button in the search toolbar next to voice input.
5. **Context & Verification**:
   - Add batch item insertion handler in `GroceryContext`.
   - Run compilation and verify complete edge-to-edge flow.
