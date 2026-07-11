'use client';

import React, { useState } from 'react';
import { DESKS, CHAIRS, ACCESSORIES, ALL_PRODUCTS, WorkspaceState, calculateRentDetails, getProductById } from '../data/products';
import WorkspacePreview from '../components/WorkspacePreview';
import CheckoutModal from '../components/CheckoutModal';
import AmbientPlayer from '../components/AmbientPlayer';
import { Sparkles, Palmtree, MapPin, ShieldCheck, Heart, Check, Plus, ShoppingCart, LayoutGrid, Upload, ArrowUpRight, Home as HomeIcon } from 'lucide-react';

export default function Home() {
  const [state, setState] = useState<WorkspaceState>({
    desk: DESKS[0], // default to first black table
    chair: CHAIRS[0], // default to Ergonomic Chair
    accessories: ['monitor-sidestand', 'laptop-mac', 'acc-hub-mav'], // default accessories
    zones: [], 
    durationWeeks: 4, // default to 1 month term (10% off)
    roomScene: 'middle',
    wallColor: '#f4f4f5',
    renderMode: 'photo'
  });

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'table' | 'chair' | 'monitor' | 'stand' | 'laptop' | 'sidetable' | 'accessories'>('all');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Compute pricing totals for summary card
  const pricing = calculateRentDetails(state);

  const handleItemSelect = (productId: string, category: 'table' | 'chair' | 'monitor' | 'stand' | 'laptop' | 'sidetable' | 'accessories') => {
    setState(prev => {
      if (category === 'table') {
        const selectedDesk = DESKS.find(d => d.id === productId) || prev.desk;
        return { ...prev, desk: selectedDesk };
      }
      if (category === 'chair') {
        const selectedChair = CHAIRS.find(c => c.id === productId) || prev.chair;
        return { ...prev, chair: selectedChair };
      }
      // Monitors, stands, laptops, sidetables, and general accessories are mapped into accessories state array
      const exists = prev.accessories.includes(productId);
      const newAccs = exists 
        ? prev.accessories.filter(id => id !== productId)
        : [...prev.accessories, productId];
      return { ...prev, accessories: newAccs };
    });
  };

  // Get items based on selected folder/category filter
  const getFilteredItems = () => {
    if (activeCategoryFilter === 'all') {
      return ALL_PRODUCTS;
    }
    return ALL_PRODUCTS.filter(p => p.category === activeCategoryFilter);
  };

  const isItemSelected = (productId: string, category: 'table' | 'chair' | 'monitor' | 'stand' | 'laptop' | 'sidetable' | 'accessories') => {
    if (category === 'table') return state.desk.id === productId;
    if (category === 'chair') return state.chair.id === productId;
    return state.accessories.includes(productId);
  };

  return (
    <div className="min-h-screen bg-[#f9f9fb] text-zinc-800 font-sans selection:bg-black selection:text-white flex flex-col justify-between relative">
      
      {/* Header section - Borderless, clean white monis.rent layout */}
      <header className="bg-white border-none z-40 relative">
        <div className="w-full max-w-[1500px] mx-auto px-8 sm:px-12 lg:px-16 h-20 flex items-center justify-between">
          
          {/* Leftmost: monis logo (bigger, no green dot) */}
          <div className="flex items-center gap-1">
            <span className="text-[28px] font-black tracking-tight text-black flex items-center cursor-pointer select-none">
              monis
            </span>
          </div>

          {/* Center: Home icon + monis.site link (borderless, shadowless) */}
          <div className="flex items-center">
            <a 
              href="https://monis.rent"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-zinc-950 hover:bg-zinc-50 hover:text-black transition-all border-none"
            >
              <HomeIcon className="w-3.5 h-3.5 stroke-[2.5] text-zinc-700" />
              <span>monis.site</span>
            </a>
          </div>

          {/* Rightmost: MapPin icon + Bali */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-800 font-black tracking-wide uppercase select-none">
            <MapPin className="w-4 h-4 text-black stroke-[2.5]" />
            <span>Bali</span>
          </div>

        </div>
      </header>

      {/* Main Designer Area */}
      <main className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative flex-grow">
        
        {/* Title Info */}
        <section className="text-center max-w-2xl mx-auto space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black">
            Design Your Bali Office Setup
          </h1>
          <p className="text-sm text-zinc-500 font-medium">
            Drag, resize, and custom-position objects in the villa visualizer. Select setup gear from the picker box.
          </p>
        </section>

        {/* 2-Column Dashboard (Visualizer on Left, Unified Item Picker on Right) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* 1. Left Panel - Visualizer & Setup Summary controls (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Visualizer Canvas Card */}
            <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
              <WorkspacePreview state={state} />
            </div>

            {/* Customizer Sub-settings Toolbar (Duration, Color picker, Camera presets, Wallpaper Upload) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-white border border-zinc-200 p-4 rounded-3xl shadow-sm">
              
              {/* Settings Item: Wall Paint */}
              <div className="flex flex-col gap-1.5 justify-center">
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest">Wall Color</span>
                <div className="flex gap-2">
                  {[
                    { hex: '#f4f4f5', name: 'White' },
                    { hex: '#dbeafe', name: 'Soft Blue' },
                    { hex: '#fef3c7', name: 'Warm Beige' },
                    { hex: '#e2e8f0', name: 'Slate Grey' },
                    { hex: '#d1fae5', name: 'Mint Green' }
                  ].map(color => (
                    <button
                      key={color.hex}
                      onClick={() => setState(prev => ({ ...prev, wallColor: color.hex }))}
                      className={`w-5 h-5 rounded-full border transition-all ${
                        state.wallColor === color.hex
                          ? 'border-black scale-110 shadow-md'
                          : 'border-zinc-200 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Settings Item: Room Scene preset */}
              <div className="flex flex-col gap-1.5 justify-center">
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest">View Angle</span>
                <div className="flex bg-zinc-50 rounded-xl p-1 border border-zinc-200 gap-0.5">
                  {[
                    { id: 'middle', label: 'Center' },
                    { id: 'corner', label: 'Corner' },
                    { id: 'window', label: 'Window' }
                  ].map(scene => (
                    <button
                      key={scene.id}
                      onClick={() => setState(prev => ({ ...prev, roomScene: scene.id as any }))}
                      disabled={!!state.customBgUrl}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        state.customBgUrl
                          ? 'text-zinc-300 cursor-not-allowed'
                          : state.roomScene === scene.id
                            ? 'bg-black text-white shadow-sm'
                            : 'text-zinc-500 hover:text-zinc-900'
                      }`}
                    >
                      {scene.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Settings Item: Rental Duration Weeks */}
              <div className="flex flex-col gap-1.5 justify-center">
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest">Duration</span>
                <div className="flex bg-zinc-50 rounded-xl p-1 border border-zinc-200 gap-0.5">
                  {[
                    { val: 1, label: '1 Wk' },
                    { val: 2, label: '2 Wk' },
                    { val: 4, label: '4 Wk' },
                    { val: 12, label: '12 Wk' }
                  ].map(dur => (
                    <button
                      key={dur.val}
                      onClick={() => setState(prev => ({ ...prev, durationWeeks: dur.val }))}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        state.durationWeeks === dur.val
                          ? 'bg-black text-white shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-900'
                      }`}
                    >
                      {dur.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Settings Item: Custom Wallpaper Upload */}
              <div className="flex flex-col gap-1.5 justify-center">
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest">Custom Wallpaper</span>
                <div className="flex items-center gap-2">
                  <label className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 hover:border-zinc-300 bg-zinc-50 text-[10px] font-bold text-zinc-700 hover:text-black cursor-pointer transition-colors shadow-sm select-none">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setState(prev => ({ ...prev, customBgUrl: url }));
                        }
                      }}
                    />
                  </label>
                  {state.customBgUrl && (
                    <button
                      type="button"
                      onClick={() => setState(prev => ({ ...prev, customBgUrl: undefined }))}
                      className="text-[9px] text-rose-500 font-extrabold hover:underline"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Premium pricing and rent call-to-action */}
            <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border border-zinc-200 rounded-3xl gap-4 shadow-sm">
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-zinc-400 tracking-wider uppercase mb-1">Weekly Rental Total</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-black">${pricing.weeklyRate}</span>
                  <span className="text-zinc-400 text-xs font-semibold">/ week</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-1">
                  <span>Term: <strong>{state.durationWeeks} weeks</strong></span>
                  {pricing.discountPercent > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-black font-bold">-{pricing.discountPercent}% Duration Discount</span>
                    </>
                  )}
                </div>
              </div>

              {/* Shopping Cart button trigger */}
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(true)}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-black hover:bg-zinc-800 text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer border-none"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Rent Your Setup</span>
              </button>
            </div>

          </div>

          {/* 2. Right Panel - Single Unified Select box containing all items (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-3xl p-5 flex flex-col gap-4 shadow-sm">
            
            {/* Box Header & Category Filter Buttons (Folder Names) */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-black" />
                  <span className="text-xs font-black text-black uppercase tracking-wider">Select Setup Elements</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Setup Items Picker</span>
              </div>

              {/* Pill filter row (Using folder names) */}
              <div className="flex flex-wrap bg-zinc-50 rounded-xl p-1 border border-zinc-200 gap-0.5">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'table', label: 'table' },
                  { id: 'chair', label: 'chair' },
                  { id: 'monitor', label: 'monitor' },
                  { id: 'stand', label: 'stand' },
                  { id: 'laptop', label: 'laptop' },
                  { id: 'sidetable', label: 'sidetable' },
                  { id: 'accessories', label: 'accessories' }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveCategoryFilter(filter.id as any)}
                    className={`flex-1 min-w-[70px] py-2 text-[10px] font-bold rounded-lg transition-all duration-300 ${
                      activeCategoryFilter === filter.id
                        ? 'bg-black text-white shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable grid list of products */}
            <div className="flex-grow overflow-y-auto max-h-[500px] pr-1 space-y-2.5">
              {getFilteredItems().map(product => {
                const isSelected = isItemSelected(product.id, product.category);
                
                return (
                  <div
                    key={product.id}
                    onClick={() => handleItemSelect(product.id, product.category)}
                    className={`group cursor-pointer rounded-2xl p-3 border transition-all duration-300 flex items-center justify-between bg-white ${
                      isSelected
                        ? 'border-black bg-zinc-50 shadow-sm'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-11 h-11 rounded-xl object-cover border border-zinc-200 bg-zinc-50" 
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-zinc-900 group-hover:text-black transition-colors">
                          {product.name}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-semibold">
                          ${product.price}/week
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center shadow-sm">
                          <Check className="w-3.5 h-3.5 stroke-[3px]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-zinc-200 text-zinc-400 flex items-center justify-center group-hover:border-zinc-400 group-hover:text-zinc-700">
                          <Plus className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ambient Player inside selector box */}
            <div className="border-t border-zinc-150 pt-4 mt-1">
              <AmbientPlayer />
            </div>

          </div>

        </section>

      </main>

      {/* Footer section */}
      <footer className="border-t border-zinc-200 bg-white py-8 text-center text-xs text-zinc-400 mt-6 relative z-10">
        <div className="w-full max-w-[1500px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} Monis Rent. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-1 text-zinc-400">
            <span>Built with passion in Bali for nomads worldwide</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
          </div>
        </div>
      </footer>

      {/* Checkout modal sheet */}
      <CheckoutModal
        state={state}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

    </div>
  );
}
