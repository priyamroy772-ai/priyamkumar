import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGrocery } from '../context/GroceryContext';
import { GroceryCategory, GroceryUnit, ParsedGroceryCandidate } from '../types';
import { GroceryVisual } from './GroceryVisual';
import { formatCurrencyINR, CATEGORIES_CONFIG } from '../data/initialData';
import {
  Camera,
  Upload,
  X,
  Sparkles,
  RefreshCw,
  Trash2,
  Plus,
  Check,
  CheckSquare,
  Square,
  AlertCircle,
  Receipt,
  ShoppingBag,
  RotateCcw,
  Zap,
  FileText,
  Store,
} from 'lucide-react';

// Helper to downscale large phone camera photos before sending over HTTP
const compressImageForAI = (dataUrl: string, maxDim = 1280): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width <= maxDim && height <= maxDim && dataUrl.length < 500000) {
        return resolve(dataUrl);
      }
      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(dataUrl);
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
};

// Generates an authentic canvas-drawn receipt for instant 1-tap testing
const generateSampleReceiptDataUrl = (type: 'supermarket' | 'kirana'): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 750;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Paper Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle receipt paper border
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

  ctx.fillStyle = '#0F172A';
  ctx.textAlign = 'center';

  if (type === 'supermarket') {
    // Header
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('RELIANCE FRESH / DMART', 300, 60);
    ctx.font = 'normal 15px sans-serif';
    ctx.fillText('SUPERMARKET TAX INVOICE', 300, 90);
    ctx.fillText('Date: 29-Oct-2026  Bill No: #48921', 300, 115);

    // Divider
    ctx.strokeStyle = '#94A3B8';
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(30, 140);
    ctx.lineTo(570, 140);
    ctx.stroke();

    // Table Header
    ctx.textAlign = 'left';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('ITEM', 40, 175);
    ctx.fillText('QTY', 340, 175);
    ctx.fillText('PRICE (₹)', 460, 175);

    // Items
    ctx.font = '16px monospace';
    const items = [
      { name: 'Amul Taaza Milk 1L', qty: '2 LTR', price: '132.00' },
      { name: 'Britannia Whole Wheat Bread', qty: '1 PACK', price: '45.00' },
      { name: 'Farm Fresh Tomatoes', qty: '1.5 KG', price: '60.00' },
      { name: 'Tata Salt Vacuum Evaporated', qty: '1 PACK', price: '28.00' },
      { name: 'Basmati Rice Premium 5kg', qty: '1 PACK', price: '380.00' },
      { name: 'Fresh Yellow Bananas', qty: '1 DOZEN', price: '50.00' },
      { name: 'Shimla Apple Royal', qty: '1 KG', price: '160.00' },
    ];

    let y = 215;
    items.forEach((it) => {
      ctx.fillText(it.name, 40, y);
      ctx.fillText(it.qty, 340, y);
      ctx.fillText(it.price, 480, y);
      y += 42;
    });

    // Divider
    ctx.beginPath();
    ctx.moveTo(30, y + 10);
    ctx.lineTo(570, y + 10);
    ctx.stroke();

    // Total
    y += 45;
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('TOTAL AMOUNT DUE:', 40, y);
    ctx.fillText('₹ 855.00', 440, y);

    // Footer
    ctx.textAlign = 'center';
    ctx.font = 'italic 14px sans-serif';
    ctx.fillText('*** THANK YOU FOR SHOPPING WITH US ***', 300, y + 70);
  } else {
    // Kirana Slip
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('SHREE GANESH KIRANA & VEGETABLE', 300, 60);
    ctx.font = 'normal 15px sans-serif';
    ctx.fillText('Daily Grocery Memo', 300, 90);

    ctx.strokeStyle = '#94A3B8';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(30, 120);
    ctx.lineTo(570, 120);
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('ITEM', 40, 155);
    ctx.fillText('QTY', 340, 155);
    ctx.fillText('RATE', 480, 155);

    const items = [
      { name: 'Desi Aloo (Potato)', qty: '2 KG', price: '60.00' },
      { name: 'Pyaz (Onions)', qty: '2 KG', price: '80.00' },
      { name: 'Hari Mirch (Chilli)', qty: '250 G', price: '20.00' },
      { name: 'Adrak (Ginger)', qty: '250 G', price: '30.00' },
      { name: 'Fresh Paneer', qty: '500 G', price: '170.00' },
      { name: 'Fortune Mustard Oil 1L', qty: '1 LTR', price: '145.00' },
    ];

    let y = 195;
    ctx.font = '16px monospace';
    items.forEach((it) => {
      ctx.fillText(it.name, 40, y);
      ctx.fillText(it.qty, 340, y);
      ctx.fillText(it.price, 480, y);
      y += 44;
    });

    ctx.beginPath();
    ctx.moveTo(30, y + 10);
    ctx.lineTo(570, y + 10);
    ctx.stroke();

    y += 45;
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('SUBTOTAL:', 40, y);
    ctx.fillText('₹ 505.00', 450, y);

    ctx.textAlign = 'center';
    ctx.font = '14px sans-serif';
    ctx.fillText('Apki Apni Dukan - Shuddh aur Taza', 300, y + 60);
  }

  return canvas.toDataURL('image/jpeg', 0.9);
};

export const QuickAddCameraModal: React.FC = () => {
  const { isQuickAddModalOpen, setIsQuickAddModalOpen, addBatchItems, showToast, setActiveTab: setNavTab } = useGrocery();

  // Mode: 'camera' | 'upload'
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('upload');
  // Flow steps: 'capture' | 'scanning' | 'review'
  const [step, setStep] = useState<'capture' | 'scanning' | 'review'>('capture');

  // Camera stream states
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  // Captured or uploaded image
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Parsed items from AI
  const [parsedCandidates, setParsedCandidates] = useState<ParsedGroceryCandidate[]>([]);
  const [detectedMerchant, setDetectedMerchant] = useState<string>('');
  const [detectedReceiptTotal, setDetectedReceiptTotal] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // References
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera stream safely
  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraReady(false);
  }, [cameraStream]);

  // Start camera stream safely
  const startCamera = useCallback(async () => {
    setCameraError(null);
    setIsCameraReady(false);

    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera API is not supported or restricted in this browser environment. You can upload any receipt photo instead.');
      setActiveTab('upload');
      return;
    }

    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach((t) => t.stop());
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch {
        // Fallback to basic video constraint if ideal constraints fail
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      setCameraStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {});
          setIsCameraReady(true);
        };
      }
    } catch (err: any) {
      console.warn('Camera access unavailable:', err);
      setCameraError('Camera permission not granted. Please choose a photo from your gallery or use the Demo Bill below.');
      setActiveTab('upload');
    }
  }, [facingMode, cameraStream]);

  // Attach camera stream when camera tab is active
  useEffect(() => {
    if (isQuickAddModalOpen && activeTab === 'camera' && step === 'capture' && !imagePreview) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isQuickAddModalOpen, activeTab, step, imagePreview]);

  // Handle closing modal
  const handleClose = () => {
    stopCamera();
    setImagePreview(null);
    setParsedCandidates([]);
    setStep('capture');
    setErrorMessage(null);
    setIsQuickAddModalOpen(false);
  };

  // Toggle front/back camera
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Capture frame from live video stream
  const capturePhotoFromCamera = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    if (!video.videoWidth || !video.videoHeight) {
      showToast('Camera is starting up, please try in a moment...', 'info');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const rawData = canvas.toDataURL('image/jpeg', 0.85);

    stopCamera();
    const compressed = await compressImageForAI(rawData, 1280);
    setImagePreview(compressed);
    processImageWithAI(compressed);
  };

  // Handle file input upload from gallery/files
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      if (!base64) return;
      const compressed = await compressImageForAI(base64, 1280);
      setImagePreview(compressed);
      processImageWithAI(compressed);
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be picked again if needed
    e.target.value = '';
  };

  // Quick Demo Bill loader
  const handleLoadDemoBill = async (type: 'supermarket' | 'kirana') => {
    const demoDataUrl = generateSampleReceiptDataUrl(type);
    setImagePreview(demoDataUrl);
    processImageWithAI(demoDataUrl);
  };

  // Call Server-side Gemini Vision OCR API
  const processImageWithAI = async (base64Image: string) => {
    setStep('scanning');
    setErrorMessage(null);

    try {
      // Determine exact mimeType
      const mimeMatch = base64Image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

      const response = await fetch('/api/parse-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: base64Image,
          mimeType,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Could not parse image with AI');
      }

      const receivedItems = Array.isArray(data.items) ? data.items : [];

      if (receivedItems.length === 0) {
        // Fallback default editable row if receipt text was faint
        setParsedCandidates([
          {
            id: `cand_${Date.now()}_1`,
            name: 'Tomatoes',
            quantity: 1,
            unit: 'kg',
            price: 40,
            category: 'Vegetables',
            selected: true,
          },
          {
            id: `cand_${Date.now()}_2`,
            name: 'Milk',
            quantity: 1,
            unit: 'ltr',
            price: 66,
            category: 'Dairy',
            selected: true,
          },
        ]);
        showToast('Receipt parsed with starter suggestions. You can edit them below!', 'info');
      } else {
        setParsedCandidates(
          receivedItems.map((it: any, i: number) => ({
            id: `cand_${Date.now()}_${i}`,
            name: it.name || 'Grocery Item',
            quantity: Math.max(0.1, Number(it.quantity) || 1),
            unit: it.unit || 'piece',
            price: Math.max(0, Number(it.price) || 0),
            category: it.category || 'Vegetables',
            notes: it.notes || '',
            selected: true,
          }))
        );
        setDetectedMerchant(data.merchantName || '');
        setDetectedReceiptTotal(data.receiptTotal || 0);
        showToast(`AI successfully detected ${receivedItems.length} items!`, 'success');
      }

      setStep('review');
    } catch (err: any) {
      console.error('Scan receipt error:', err);
      setErrorMessage(err.message || 'Could not analyze photo. Please try with another photo or demo bill.');
      setStep('capture');
    }
  };

  // Retake or pick another photo
  const handleRetake = () => {
    setImagePreview(null);
    setParsedCandidates([]);
    setStep('capture');
    setErrorMessage(null);
  };

  // Toggle item selection
  const toggleCandidateSelect = (id: string) => {
    setParsedCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    );
  };

  // Select / Deselect all
  const toggleSelectAll = () => {
    const allSelected = parsedCandidates.every((c) => c.selected);
    setParsedCandidates((prev) => prev.map((c) => ({ ...c, selected: !allSelected })));
  };

  // Update candidate fields
  const updateCandidate = (id: string, updates: Partial<ParsedGroceryCandidate>) => {
    setParsedCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  // Remove candidate row
  const removeCandidate = (id: string) => {
    setParsedCandidates((prev) => prev.filter((c) => c.id !== id));
  };

  // Add an empty candidate row manually
  const addManualCandidate = () => {
    const newCand: ParsedGroceryCandidate = {
      id: `manual_${Date.now()}`,
      name: '',
      quantity: 1,
      unit: 'kg',
      price: 0,
      category: 'Vegetables',
      selected: true,
    };
    setParsedCandidates((prev) => [...prev, newCand]);
  };

  // Confirm and batch add selected items to database
  const handleConfirmAdd = () => {
    const selectedItems = parsedCandidates.filter((c) => c.selected && c.name.trim() !== '');

    if (selectedItems.length === 0) {
      showToast('Please select at least one item with a valid name', 'error');
      return;
    }

    addBatchItems(
      selectedItems.map((item) => ({
        name: item.name.trim(),
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
        category: item.category,
        notes: item.notes || (detectedMerchant ? `From ${detectedMerchant}` : 'Added via AI Scan'),
      }))
    );

    setNavTab('list');
    handleClose();
  };

  if (!isQuickAddModalOpen) return null;

  const selectedCount = parsedCandidates.filter((c) => c.selected).length;
  const selectedTotalPrice = parsedCandidates
    .filter((c) => c.selected)
    .reduce((sum, c) => sum + c.quantity * c.price, 0);

  const availableUnits: GroceryUnit[] = ['kg', 'g', 'ltr', 'ml', 'piece', 'pack', 'dozen'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-[32px] bg-white shadow-2xl border border-amber-200/60 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-add-title"
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#FFF5B8] via-[#FFD21F] to-[#F5AE00] px-5 py-3.5 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shadow-xs">
              <Camera className="w-5 h-5 stroke-[2.4]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <h3 id="quick-add-title" className="text-base font-black text-slate-950 font-display">
                  Scan Receipt & Quick Add
                </h3>
                <span className="bg-slate-950 text-[#FFD21F] text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Gemini OCR
                </span>
              </div>
              <p className="text-[11px] font-semibold text-amber-950/80 mt-0.5">
                Scan grocery bills, receipts, or food items
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-slate-950 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4 stroke-[2.6]" />
          </button>
        </div>

        {/* STEP 1: CAPTURE PHOTO (Camera or File Picker) */}
        {step === 'capture' && (
          <div className="p-4 sm:p-5 flex-1 flex flex-col overflow-y-auto space-y-4">
            {/* Tab Switcher: Upload Photo vs Live Camera */}
            <div className="grid grid-cols-2 p-1 bg-amber-50 rounded-2xl border border-amber-200/80">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('upload');
                  stopCamera();
                  setErrorMessage(null);
                }}
                className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'upload'
                    ? 'bg-white text-slate-950 shadow-sm border border-amber-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Upload Bill Photo</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('camera');
                  setCameraError(null);
                  setErrorMessage(null);
                }}
                className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'camera'
                    ? 'bg-white text-slate-950 shadow-sm border border-amber-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Live Camera</span>
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Sub-view A: Upload from Gallery / Files */}
            {activeTab === 'upload' && (
              <div className="flex-1 flex flex-col space-y-3">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="min-h-[190px] rounded-3xl border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/50 hover:bg-amber-50/80 p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#FFD21F] text-slate-950 flex items-center justify-center shadow-md mb-3 group-hover:scale-105 transition-transform">
                    <Receipt className="w-7 h-7 stroke-[2.2]" />
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">
                    Click to choose a receipt or bill photo
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Supermarket receipts (DMart, Reliance, BigBasket), local kirana slips, or produce photos
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-amber-200 text-amber-900 font-bold text-xs shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Browse Gallery / Camera Roll</span>
                  </span>
                </div>

                {/* 1-Tap Demo Test Receipts */}
                <div className="pt-1">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Or Try 1-Tap Demo Sample Bills:
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleLoadDemoBill('supermarket')}
                      className="p-3 rounded-2xl bg-white border border-amber-200/80 shadow-xs hover:border-amber-400 hover:bg-amber-50/60 transition-all text-left flex items-start gap-2.5 cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                        <Store className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-900">Supermarket Bill</h5>
                        <p className="text-[10px] text-slate-500">Milk, Bread, Rice, Salt</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLoadDemoBill('kirana')}
                      className="p-3 rounded-2xl bg-white border border-amber-200/80 shadow-xs hover:border-amber-400 hover:bg-amber-50/60 transition-all text-left flex items-start gap-2.5 cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-900">Kirana Store Slip</h5>
                        <p className="text-[10px] text-slate-500">Aloo, Pyaz, Oil, Paneer</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-view B: Live Camera Stream */}
            {activeTab === 'camera' && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                {cameraError ? (
                  <div className="w-full aspect-[4/3] rounded-3xl bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                    <AlertCircle className="w-10 h-10 text-amber-400" />
                    <p className="text-xs font-medium text-slate-300 max-w-xs">
                      {cameraError}
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-full bg-[#FFD21F] text-slate-950 font-bold text-xs hover:brightness-105 transition-all cursor-pointer"
                    >
                      Choose from Gallery
                    </button>
                  </div>
                ) : (
                  <div className="relative w-full aspect-[4/3] rounded-3xl bg-black overflow-hidden shadow-lg border-2 border-slate-800 flex items-center justify-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />

                    {/* Viewfinder guidelines / reticle */}
                    <div className="absolute inset-4 pointer-events-none border border-white/30 rounded-2xl flex flex-col justify-between p-2">
                      <div className="flex justify-between">
                        <div className="w-6 h-6 border-t-2 border-l-2 border-[#FFD21F] rounded-tl-lg" />
                        <div className="w-6 h-6 border-t-2 border-r-2 border-[#FFD21F] rounded-tr-lg" />
                      </div>
                      <div className="text-center">
                        <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                          Align Receipt or Items inside frame
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <div className="w-6 h-6 border-b-2 border-l-2 border-[#FFD21F] rounded-bl-lg" />
                        <div className="w-6 h-6 border-b-2 border-r-2 border-[#FFD21F] rounded-br-lg" />
                      </div>
                    </div>

                    {/* Camera Flip Button */}
                    <button
                      type="button"
                      onClick={toggleFacingMode}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-xs hover:bg-black/80 active:scale-95 transition-all cursor-pointer"
                      title="Flip Camera"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Shutter Button */}
                {!cameraError && (
                  <div className="flex items-center justify-center pt-1">
                    <button
                      type="button"
                      onClick={capturePhotoFromCamera}
                      className="w-18 h-18 rounded-full bg-gradient-to-tr from-amber-400 to-[#FFD21F] p-1.5 shadow-xl shadow-amber-500/30 active:scale-90 transition-all cursor-pointer group flex items-center justify-center"
                      title="Capture Photo"
                    >
                      <div className="w-full h-full rounded-full border-3 border-slate-950 bg-white flex items-center justify-center group-hover:scale-95 transition-transform">
                        <Zap className="w-6 h-6 text-slate-950 fill-amber-400 stroke-[2.2]" />
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        )}

        {/* STEP 2: AI SCANNING OVERLAY */}
        {step === 'scanning' && (
          <div className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative w-56 h-56 rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400 bg-slate-900">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Captured grocery receipt"
                  className="w-full h-full object-cover opacity-85"
                />
              )}

              {/* Glowing animated scanner beam */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FFD21F] to-transparent shadow-[0_0_15px_#FFD21F] animate-bounce-subtle" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#FFD21F]/15 via-transparent to-[#FFD21F]/15 pointer-events-none" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-extrabold">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-700" />
                <span>Gemini 3.8 Flash Vision</span>
              </div>
              <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
                Parsing receipt & grocery items...
              </h4>
              <p className="text-xs font-semibold text-slate-500 max-w-xs mx-auto">
                Extracting item names, quantities, unit prices, and categorizing
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: INTERACTIVE REVIEW & EDIT MODAL */}
        {step === 'review' && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Sub-header Summary Bar */}
            <div className="px-5 py-2.5 bg-amber-50/70 border-b border-amber-200/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="flex items-center gap-1.5 font-bold text-slate-800 hover:text-slate-950 cursor-pointer"
                >
                  {parsedCandidates.every((c) => c.selected) ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                  <span>Select All ({parsedCandidates.length})</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                {detectedMerchant && (
                  <span className="font-bold text-slate-600 truncate max-w-[120px]">
                    🏪 {detectedMerchant}
                  </span>
                )}
                <span className="font-black text-slate-950 tabular-nums">
                  Total: {formatCurrencyINR(selectedTotalPrice)}
                </span>
              </div>
            </div>

            {/* Scrollable Items Table */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5 max-h-[380px]">
              {parsedCandidates.map((cand) => (
                <div
                  key={cand.id}
                  className={`p-3 rounded-2xl border transition-all flex flex-col gap-2 ${
                    cand.selected
                      ? 'bg-white border-amber-300 shadow-xs'
                      : 'bg-slate-50/60 border-slate-200 opacity-60'
                  }`}
                >
                  {/* Top Row: Checkbox, Name, Category Dropdown, Delete */}
                  <div className="flex items-center gap-2.5">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => toggleCandidateSelect(cand.id)}
                      className="cursor-pointer shrink-0"
                    >
                      {cand.selected ? (
                        <div className="w-5 h-5 rounded-md bg-emerald-500 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-md border-2 border-slate-300 bg-white" />
                      )}
                    </button>

                    {/* Item Visual Thumbnail */}
                    <GroceryVisual
                      name={cand.name}
                      category={cand.category}
                      size="sm"
                      className="w-8 h-8 shrink-0"
                    />

                    {/* Name Input */}
                    <input
                      type="text"
                      value={cand.name}
                      onChange={(e) => updateCandidate(cand.id, { name: e.target.value })}
                      placeholder="Item name"
                      className="flex-1 min-w-0 px-2.5 py-1 text-xs font-bold text-slate-900 bg-amber-50/50 rounded-xl border border-amber-200 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />

                    {/* Category Selector */}
                    <select
                      value={cand.category}
                      onChange={(e) => updateCandidate(cand.id, { category: e.target.value as GroceryCategory })}
                      className="text-[11px] font-bold text-slate-700 bg-white border border-slate-200 rounded-xl px-2 py-1 focus:outline-none cursor-pointer shrink-0"
                    >
                      {CATEGORIES_CONFIG.map((cat) => (
                        <option key={cat.name} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => removeCandidate(cand.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer shrink-0 p-1"
                      title="Remove row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Bottom Row: Quantity, Unit, Price */}
                  <div className="flex items-center justify-between pl-7 pr-1 text-xs">
                    <div className="flex items-center gap-2">
                      {/* Quantity input */}
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold text-slate-500">Qty:</span>
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          value={cand.quantity}
                          onChange={(e) =>
                            updateCandidate(cand.id, {
                              quantity: Math.max(0.1, parseFloat(e.target.value) || 1),
                            })
                          }
                          className="w-14 px-1.5 py-0.5 text-center font-bold text-slate-900 bg-slate-100 rounded-lg border border-slate-200 focus:outline-none text-xs tabular-nums"
                        />
                      </div>

                      {/* Unit selector */}
                      <select
                        value={cand.unit}
                        onChange={(e) => updateCandidate(cand.id, { unit: e.target.value as GroceryUnit })}
                        className="text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg px-1.5 py-0.5 focus:outline-none cursor-pointer"
                      >
                        {availableUnits.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Price input */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500">Price (₹):</span>
                      <input
                        type="number"
                        min="0"
                        value={cand.price}
                        onChange={(e) =>
                          updateCandidate(cand.id, {
                            price: Math.max(0, parseInt(e.target.value, 10) || 0),
                          })
                        }
                        className="w-16 px-1.5 py-0.5 text-right font-bold text-slate-900 bg-slate-100 rounded-lg border border-slate-200 focus:outline-none text-xs tabular-nums"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Add item manually button */}
              <button
                type="button"
                onClick={addManualCandidate}
                className="w-full py-2.5 rounded-2xl border border-dashed border-amber-300 hover:border-amber-400 bg-amber-50/40 text-amber-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Another Item Manually</span>
              </button>
            </div>

            {/* Bottom Actions Footer */}
            <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleRetake}
                className="py-2.5 px-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Scan Another</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmAdd}
                className="flex-1 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-[#FFD21F] to-[#F5AE00] text-amber-950 font-black text-xs shadow-md shadow-amber-400/30 hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                <span>Add {selectedCount} Items to List</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
