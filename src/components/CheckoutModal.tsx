'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorkspaceState, calculateRentDetails, getProductById } from '../data/products';
import { X, Calendar, MapPin, CheckCircle2, ShoppingBag, ArrowRight, Clipboard } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  state: WorkspaceState;
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ state, isOpen, onClose }: CheckoutModalProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: 'Canggu',
    deliveryDate: '',
    notes: ''
  });

  const { weeklyRate, baseTotal, discountPercent, discountAmount, finalTotal } = calculateRentDetails(state);

  const selectedAccessories = state.accessories.map(id => getProductById(id)).filter(Boolean);
  const selectedZones = state.zones.map(id => getProductById(id)).filter(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate simple required inputs
    if (!formData.name || !formData.email || !formData.deliveryDate) {
      alert('Please fill out all required fields.');
      return;
    }

    // Trigger success state and explosion
    setIsSuccess(true);
    triggerExplosion();
  };

  const triggerExplosion = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // Confetti burst from random locations near center
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      location: 'Canggu',
      deliveryDate: '',
      notes: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark backdrop blur layer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Main modal container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 20 }}
        className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col lg:flex-row max-h-[90vh] lg:max-h-[85vh]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-full bg-zinc-900 border border-zinc-800 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <>
            {/* Left side: Checkout Form details */}
            <div className="flex-1 p-6 lg:p-8 overflow-y-auto border-b lg:border-b-0 lg:border-r border-zinc-800">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Complete Rent Booking</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">Delivery & Contact Details</h2>
              <p className="text-xs text-zinc-500 mt-1">We deliver, set up, and test everything right in your villa or workspace in Bali.</p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wide mb-1.5">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vinit Vansha"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wide mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="vinit@example.com"
                      value={formData.email}
                      onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wide mb-1.5">
                      WhatsApp/Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+62 812-3456-7890"
                      value={formData.phone}
                      onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Bali Delivery Area</span>
                    </label>
                    <select
                      value={formData.location}
                      onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      <option value="Canggu">Canggu</option>
                      <option value="Seminyak">Seminyak</option>
                      <option value="Ubud">Ubud</option>
                      <option value="Uluwatu">Uluwatu</option>
                      <option value="Sanur">Sanur</option>
                      <option value="Kuta">Kuta / Legian</option>
                      <option value="Nusa Dua">Nusa Dua</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Desired Setup Date</span> <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.deliveryDate}
                      onChange={e => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))}
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                    <Clipboard className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Villa Directions / Setup Notes</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Villa Lotus in Gang Melati, Canggu. Leaning beside the banana plant. Please place setup on 2nd floor desk room."
                    value={formData.notes}
                    onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2 group"
                  >
                    <span>Confirm & Book Setup</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-[10px] text-zinc-500 mt-2 text-center">
                    By submitting, you agree to rent for {state.durationWeeks} {state.durationWeeks === 1 ? 'week' : 'weeks'}. Pay upon delivery (Card, Wise, or IDR Cash).
                  </p>
                </div>
              </form>
            </div>

            {/* Right side: Office Setup Cart Summary */}
            <div className="w-full lg:w-80 bg-zinc-900/50 p-6 lg:p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-3">
                  Workspace Summary
                </h3>

                <div className="mt-4 space-y-4">
                  {/* Desk item */}
                  <div className="flex justify-between items-start text-xs">
                    <div>
                      <span className="font-semibold text-white block">{state.desk.name}</span>
                      <span className="text-[10px] text-zinc-500">Core Desk option</span>
                    </div>
                    <span className="font-bold text-zinc-300">${state.desk.price}/wk</span>
                  </div>

                  {/* Chair item */}
                  <div className="flex justify-between items-start text-xs">
                    <div>
                      <span className="font-semibold text-white block">{state.chair.name}</span>
                      <span className="text-[10px] text-zinc-500">Ergonomic seating</span>
                    </div>
                    <span className="font-bold text-zinc-300">${state.chair.price}/wk</span>
                  </div>

                  {/* Accessories */}
                  {selectedAccessories.length > 0 && (
                    <div className="space-y-3 pt-2 border-t border-zinc-800/40">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide block">Accessories</span>
                      {selectedAccessories.map(acc => (
                        <div key={acc!.id} className="flex justify-between items-start text-xs pl-2 border-l border-emerald-500/30">
                          <span className="text-zinc-300 text-[11px]">{acc!.name}</span>
                          <span className="font-bold text-zinc-400">${acc!.price}/wk</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Lifestyle Zones */}
                  {selectedZones.length > 0 && (
                    <div className="space-y-3 pt-2 border-t border-zinc-800/40">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide block">Lifestyle Zones</span>
                      {selectedZones.map(zone => (
                        <div key={zone!.id} className="flex justify-between items-start text-xs pl-2 border-l border-emerald-500/30">
                          <span className="text-zinc-300 text-[11px]">{zone!.name}</span>
                          <span className="font-bold text-zinc-400">${zone!.price}/wk</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Total Block Summary */}
              <div className="pt-6 border-t border-zinc-800 mt-6 space-y-2">
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Weekly Rate</span>
                  <span>${weeklyRate}/wk</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Duration</span>
                  <span>{state.durationWeeks} {state.durationWeeks === 1 ? 'Week' : 'Weeks'}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-xs text-emerald-400">
                    <span>{discountPercent}% Nomad discount</span>
                    <span>-${discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-zinc-800">
                  <span>Total Rent Est.</span>
                  <span className="text-emerald-400 text-base">${finalTotal}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* SUCCESS STATE PANEL */
          <div className="w-full p-8 lg:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <CheckCircle2 className="w-20 h-20 text-emerald-400" />
            </motion.div>
            
            <h2 className="text-3xl font-black text-white mt-6">Order Ploned!</h2>
            <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
              Terima Kasih, <strong className="text-white">{formData.name}</strong>! Your dream setup booking has been received.
            </p>
            
            <div className="w-full bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 mt-6 text-left space-y-2.5 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Setup Location:</span>
                <span className="font-semibold text-white">{formData.location}, Bali</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Setup Date:</span>
                <span className="font-semibold text-white">{formData.deliveryDate}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Duration Period:</span>
                <span className="font-semibold text-white">{state.durationWeeks} {state.durationWeeks === 1 ? 'Week' : 'Weeks'}</span>
              </div>
              <div className="flex justify-between text-zinc-400 border-t border-zinc-800 pt-2.5">
                <span>Rental Bill:</span>
                <span className="font-bold text-emerald-400">${finalTotal} Total</span>
              </div>
            </div>

            <p className="text-xs text-zinc-500 mt-4 leading-relaxed">
              We have sent a confirmation email to <strong>{formData.email}</strong>. Our local delivery team will contact you via WhatsApp shortly to coordinate delivery.
            </p>

            <button
              onClick={handleReset}
              className="mt-8 px-8 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wide transition-colors"
            >
              Back to Designer
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
