'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DESKS, 
  CHAIRS, 
  ACCESSORIES, 
  ZONES, 
  Product, 
  WorkspaceState, 
  calculateRentDetails 
} from '../data/products';
import { 
  Check, 
  Plus, 
  Info, 
  Calendar, 
  Percent, 
  CheckCircle,
  Sparkles,
  MapPin,
  Brush,
  Eye,
  EyeOff
} from 'lucide-react';

interface SidebarOptionsProps {
  state: WorkspaceState;
  setState: React.Dispatch<React.SetStateAction<WorkspaceState>>;
  onRentClick: () => void;
}

type TabType = 'furniture' | 'accessories' | 'zones' | 'room' | 'duration';

const ROOM_PRESETS = [
  { id: 'middle', name: 'Middle Space', desc: 'Position your office setup in the center of the room' },
  { id: 'corner', name: 'Corner of Room', desc: 'Shift setup to the left-side wall corner area' },
  { id: 'window', name: 'In Front of Window', desc: 'Align setup directly in front of the right-side window' }
];

const WALL_PAINTS = [
  { name: 'Warm Terracotta Red', hex: '#991b1b' },
  { name: 'Sage Green', hex: '#166534' },
  { name: 'Charcoal Slate', hex: '#3f3f46' },
  { name: 'Studio Off-White', hex: '#f4f4f5' }
];

export default function SidebarOptions({ state, setState, onRentClick }: SidebarOptionsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('furniture');
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product>(state.desk);

  // Active pricing calculation
  const { weeklyRate, baseTotal, discountPercent, discountAmount, finalTotal } = calculateRentDetails(state);

  // Helper to toggle items in a list
  const toggleAccessory = (id: string) => {
    setState(prev => {
      const isSelected = prev.accessories.includes(id);
      let updatedAccessories = [];
      
      const monitorIds = ['acc-office-24', 'acc-multimedia-27', 'acc-gaming-34', 'acc-apple-studio'];
      const isMonitor = monitorIds.includes(id);

      if (isMonitor && !isSelected) {
        updatedAccessories = [...prev.accessories.filter(item => !monitorIds.includes(item)), id];
      } else {
        updatedAccessories = isSelected
          ? prev.accessories.filter(item => item !== id)
          : [...prev.accessories, id];
      }

      return {
        ...prev,
        accessories: updatedAccessories
      };
    });
  };

  const toggleZone = (id: string) => {
    setState(prev => {
      const isSelected = prev.zones.includes(id);
      const updatedZones = isSelected
        ? prev.zones.filter(item => item !== id)
        : [...prev.zones, id];
      return {
        ...prev,
        zones: updatedZones
      };
    });
  };

  return (
    <div className="w-full flex flex-col h-full bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
      
      {/* Top Global Mode Toggles (Photo vs Draft Model) */}
      <div className="flex items-center justify-between border-b border-zinc-900 bg-zinc-900/30 px-5 py-3">
        <span className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest">
          View Render Mode
        </span>
        <div className="flex bg-zinc-950 rounded-xl p-1 border border-zinc-800">
          <button
            type="button"
            onClick={() => setState(prev => ({ ...prev, renderMode: 'photo' }))}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-300 ${
              state.renderMode === 'photo'
                ? 'bg-emerald-500 text-zinc-950 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Real Photo
          </button>
          <button
            type="button"
            onClick={() => setState(prev => ({ ...prev, renderMode: 'model' }))}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-300 ${
              state.renderMode === 'model'
                ? 'bg-emerald-500 text-zinc-950 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Draft Model
          </button>
        </div>
      </div>

      {/* Category selector tabs */}
      <div className="flex border-b border-zinc-800 bg-zinc-900/50 p-2 gap-1">
        {[
          { id: 'furniture', label: '1. Furniture' },
          { id: 'accessories', label: '2. Tech' },
          { id: 'room', label: '3. Room Setup' },
          { id: 'zones', label: '4. Zones' },
          { id: 'duration', label: '5. Rent Block' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex-1 text-center py-2 px-1 rounded-xl text-[10px] sm:text-xs font-semibold tracking-wide transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-emerald-500 text-zinc-950 font-bold shadow-[0_4px_12px_rgba(16,185,129,0.3)]'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content space */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 max-h-[380px] lg:max-h-[460px]">
        {activeTab === 'furniture' && (
          <div className="space-y-6">
            {/* Desks Section */}
            <div>
              <h3 className="text-sm font-bold text-zinc-300 mb-3 flex items-center justify-between">
                <span>Select Your Desk</span>
                <span className="text-[10px] text-zinc-500 font-normal">Choose 1</span>
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                {DESKS.map(deskItem => {
                  const isSelected = state.desk.id === deskItem.id;
                  return (
                    <div
                      key={deskItem.id}
                      onClick={() => {
                        setState(prev => ({ ...prev, desk: deskItem }));
                        setSelectedProductDetail(deskItem);
                      }}
                      className={`group cursor-pointer rounded-2xl p-3 border transition-all duration-300 relative flex items-center gap-4 ${
                        isSelected
                          ? 'bg-emerald-950/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                          : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-zinc-800 shrink-0 flex items-center justify-center p-1.5">
                        <img 
                          src={deskItem.image} 
                          alt={deskItem.name} 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                            {deskItem.name}
                          </span>
                          {isSelected && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-2 leading-relaxed">{deskItem.description}</p>
                      </div>
                      <div className="text-right pl-2 shrink-0">
                        <span className="text-sm font-bold text-emerald-400">${deskItem.price}</span>
                        <span className="text-[10px] text-zinc-500 block">/week</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chairs Section */}
            <div>
              <h3 className="text-sm font-bold text-zinc-300 mb-3 flex items-center justify-between">
                <span>Select Ergonomic Seating</span>
                <span className="text-[10px] text-zinc-500 font-normal">Choose 1</span>
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                {CHAIRS.map(chairItem => {
                  const isSelected = state.chair.id === chairItem.id;
                  return (
                    <div
                      key={chairItem.id}
                      onClick={() => {
                        setState(prev => ({ ...prev, chair: chairItem }));
                        setSelectedProductDetail(chairItem);
                      }}
                      className={`group cursor-pointer rounded-2xl p-3 border transition-all duration-300 relative flex items-center gap-4 ${
                        isSelected
                          ? 'bg-emerald-950/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                          : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-zinc-800 shrink-0 flex items-center justify-center p-1.5">
                        <img 
                          src={chairItem.image} 
                          alt={chairItem.name} 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                            {chairItem.name}
                          </span>
                          {isSelected && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-2 leading-relaxed">{chairItem.description}</p>
                      </div>
                      <div className="text-right pl-2 shrink-0">
                        <span className="text-sm font-bold text-emerald-400">${chairItem.price}</span>
                        <span className="text-[10px] text-zinc-500 block">/week</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'accessories' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-300 mb-1 flex items-center justify-between">
              <span>Enhance Your Space</span>
              <span className="text-[10px] text-zinc-500 font-normal">Select Multiple</span>
            </h3>
            <p className="text-[11px] text-zinc-500 leading-normal mb-3">
              Note: You can select one monitor choice. Selecting a different display automatically replaces the active monitor on the canvas.
            </p>
            <div className="grid grid-cols-1 gap-2.5">
              {ACCESSORIES.map(acc => {
                const isSelected = state.accessories.includes(acc.id);
                return (
                  <div
                    key={acc.id}
                    onClick={() => {
                      toggleAccessory(acc.id);
                      setSelectedProductDetail(acc);
                    }}
                    className={`group cursor-pointer rounded-2xl p-3 border transition-all duration-300 flex items-center gap-4 ${
                      isSelected
                        ? 'bg-emerald-950/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                        : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-zinc-800 shrink-0 flex items-center justify-center p-1.5">
                      <img 
                        src={acc.image} 
                        alt={acc.name} 
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                          {acc.name}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400 stroke-[3px] shrink-0" />}
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-2 leading-relaxed">{acc.description}</p>
                    </div>
                    <div className="text-right pl-2 shrink-0">
                      <span className="text-sm font-bold text-emerald-400">+${acc.price}</span>
                      <span className="text-[10px] text-zinc-500 block">/week</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'room' && (
          <div className="space-y-6">
            {/* Room Background Presets */}
            <div>
              <h3 className="text-sm font-bold text-zinc-300 mb-3 flex items-center justify-between">
                <span>Select Setup Position</span>
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                {ROOM_PRESETS.map(room => {
                  const isSelected = state.roomScene === room.id;
                  return (
                    <div
                      key={room.id}
                      onClick={() => setState(prev => ({ ...prev, roomScene: room.id as any }))}
                      className={`group cursor-pointer rounded-2xl p-3 border transition-all duration-300 flex items-center gap-3 ${
                        isSelected
                          ? 'bg-emerald-950/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)] text-white'
                          : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center shrink-0">
                        {isSelected && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs sm:text-sm font-bold text-white block">{room.name}</span>
                        <span className="text-[10px] text-zinc-500 line-clamp-1">{room.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Wall Paint colors overlay selector */}
            <div>
              <h3 className="text-sm font-bold text-zinc-300 mb-3 flex items-center gap-1.5">
                <Brush className="w-4 h-4 text-emerald-400" />
                <span>Wall Paint Color</span>
              </h3>
              <div className="grid grid-cols-4 gap-2.5">
                {WALL_PAINTS.map(paint => {
                  const isSelected = state.wallColor === paint.hex;
                  return (
                    <button
                      key={paint.hex}
                      type="button"
                      onClick={() => setState(prev => ({ ...prev, wallColor: paint.hex }))}
                      className={`h-12 rounded-xl border flex flex-col items-center justify-center transition-all ${
                        isSelected ? 'border-emerald-500 scale-105 shadow-md' : 'border-zinc-800 hover:border-zinc-700'
                      }`}
                      title={paint.name}
                      style={{ backgroundColor: paint.hex }}
                    >
                      {isSelected && (
                        <Check className={`w-4 h-4 ${paint.hex === '#f4f4f5' ? 'text-zinc-950' : 'text-white'} stroke-[3px]`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'zones' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-300 mb-1 flex items-center justify-between">
              <span>Bali Lifestyle Add-ons</span>
              <span className="text-[10px] text-zinc-500 font-normal">Select Multiple</span>
            </h3>
            <p className="text-[11px] text-zinc-500 leading-normal mb-3">
              Add premium setups that will be delivered and mounted around your work area for comfort.
            </p>
            <div className="grid grid-cols-1 gap-2.5">
              {ZONES.map(zone => {
                const isSelected = state.zones.includes(zone.id);
                return (
                  <div
                    key={zone.id}
                    onClick={() => {
                      toggleZone(zone.id);
                      setSelectedProductDetail(zone);
                    }}
                    className={`group cursor-pointer rounded-2xl p-3 border transition-all duration-300 flex items-center gap-4 ${
                      isSelected
                        ? 'bg-emerald-950/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                        : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-zinc-800 shrink-0 flex items-center justify-center p-1.5">
                      <img 
                        src={zone.image} 
                        alt={zone.name} 
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                          {zone.name}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400 stroke-[3px] shrink-0" />}
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-2 leading-relaxed">{zone.description}</p>
                    </div>
                    <div className="text-right pl-2 shrink-0">
                      <span className="text-sm font-bold text-emerald-400">+${zone.price}</span>
                      <span className="text-[10px] text-zinc-500 block">/week</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'duration' && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-zinc-300 mb-2">Select Rental Duration</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '1 Week', weeks: 1, discount: 'No discount' },
                { label: '2 Weeks', weeks: 2, discount: 'No discount' },
                { label: '1 Month', weeks: 4, discount: '10% OFF', promo: true },
                { label: '3 Months', weeks: 12, discount: '20% OFF', promo: true }
              ].map(item => {
                const isSelected = state.durationWeeks === item.weeks;
                return (
                  <button
                    key={item.weeks}
                    type="button"
                    onClick={() => setState(prev => ({ ...prev, durationWeeks: item.weeks }))}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
                      isSelected
                        ? 'bg-emerald-950/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)] text-white'
                        : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                    }`}
                  >
                    <span className="text-sm font-bold">{item.label}</span>
                    <span className={`text-[10px] mt-1 px-2 py-0.5 rounded-full font-medium ${
                      item.promo
                        ? isSelected ? 'bg-emerald-500 text-zinc-950 font-bold' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'text-zinc-500'
                    }`}>
                      {item.discount}
                    </span>
                  </button>
                );
              })}
            </div>
            
            <div className="p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl flex items-start gap-3">
              <Percent className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-zinc-300">Long-term Nomad Discount</h4>
                <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                  Startups and remote developers in Bali enjoy discounts of 10% off for 1 month rents, and 20% off for 3+ months block rentals.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selected Product Specifications Detail Section */}
      {selectedProductDetail && (
        <div className="px-5 py-3 border-t border-b border-zinc-800 bg-zinc-900/20">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
            <Info className="w-3.5 h-3.5" />
            <span>Specifications & Details</span>
          </div>
          <div className="text-xs text-zinc-300 font-bold mt-0.5">
            {selectedProductDetail.name}
          </div>
          <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1">
            {selectedProductDetail.details.map((detail, idx) => (
              <li key={idx} className="text-[10px] text-zinc-400 flex items-start gap-1">
                <span className="text-emerald-500 shrink-0 mt-0.5">•</span>
                <span className="leading-tight">{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pricing summary & Checkout Trigger */}
      <div className="p-5 bg-zinc-900 border-t border-zinc-800 space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Weekly Subtotal</span>
            <span className="font-semibold text-zinc-300">${weeklyRate.toFixed(2)}/wk</span>
          </div>
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Duration block</span>
            <span className="font-semibold text-zinc-300">{state.durationWeeks} {state.durationWeeks === 1 ? 'Week' : 'Weeks'}</span>
          </div>
          {discountPercent > 0 && (
            <div className="flex justify-between text-xs text-emerald-400">
              <span className="flex items-center gap-1 font-medium">
                <Percent className="w-3 h-3" />
                Nomad discount ({discountPercent}%)
              </span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm pt-2 border-t border-zinc-800">
            <span className="font-bold text-white">Estimated Total</span>
            <span className="font-bold text-emerald-400">${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={onRentClick}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-zinc-950 font-extrabold text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.3)] active:scale-[0.98]"
        >
          Rent This Setup
        </button>
      </div>
    </div>
  );
}
