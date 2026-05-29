'use client';

import { ArrowRight, Microscope, CloudSun, Smartphone, Sparkles } from 'lucide-react';

export default function BeekToolsPortal() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDF9] via-[#FFFBF0] to-[#FFF6E5] text-[#2D2A26] flex flex-col justify-between font-sans selection:bg-[#F5A623]/30 selection:text-[#723910]">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[#F5A623]/5 to-transparent blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-[#E99B1A]/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-80 right-10 w-96 h-96 bg-[#F5B731]/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-4xl mx-auto px-6 py-5 flex items-center justify-between border-b border-[#F5A623]/10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#F5A623] to-[#D97706] rounded-xl flex items-center justify-center text-white shadow-md shadow-[#F5A623]/20 animate-pulse">
            <span className="text-xl">🐝</span>
          </div>
          <span className="text-xl font-black uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#8B4513] to-[#C47F0A]">
            BeekTools
          </span>
        </div>
        <div className="text-xs font-bold text-[#7A7468] uppercase tracking-widest bg-white/50 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/85 shadow-sm">
          v2.0 Active
        </div>
      </header>

      {/* Main Hero & Portals */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-6 py-8 sm:py-10 flex-1 flex flex-col justify-center items-center">
        
        {/* Intro */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 bg-[#F5A623]/10 text-[#C47F0A] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-3 border border-[#F5A623]/20">
            <Sparkles size={12} /> The Future of Beekeeping is Here
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#4A3C28] leading-[1.08] mb-3">
            One Portal.<br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#D97706] via-[#E99B1A] to-[#8B4513]">
              Smarter Beekeeping.
            </span>
          </h1>
          <p className="text-sm sm:text-base font-medium text-[#7A7468] leading-relaxed max-w-xl mx-auto">
            Manage your apiaries with native support for both <strong className="text-[#8B4513] font-bold">Top Bar Hives</strong> and <strong className="text-[#D97706] font-bold">Langstroth Hives</strong>. Track inspections, forecast ideal weather slots, and care for your bees with ease.
          </p>
        </div>

        {/* 3. Android Closed Beta Promo Card */}
        <div className="w-full max-w-4xl bg-gradient-to-r from-[#FFFBF0] to-[#FFF3DC] border border-[#F5A623]/20 rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md hover:shadow-lg transition-all duration-300 mb-6 relative z-10">
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            <div className="w-14 h-14 bg-gradient-to-br from-[#F5A623] to-[#D97706] rounded-2xl flex items-center justify-center text-white shadow-md shadow-[#F5A623]/10">
              <Smartphone size={28} />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#4A3C28] flex items-center gap-1.5 justify-center md:justify-start">
                📱 BeekTools Beekeeper is on Android!
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-[#7A7468] mt-1 leading-relaxed max-w-xl">
                Get early native access on Google Play. Register your Gmail on our closed testing page for instant download authorization.
              </p>
            </div>
          </div>
          <a 
            href="https://beekeeper.beektools.com/beta" 
            className="px-6 py-4 bg-[#8B4513] hover:bg-[#723910] text-white rounded-2xl font-black text-center text-sm shadow-sm active:scale-95 transition-all flex-shrink-0 min-w-[170px]"
          >
            🚀 Join Android Beta
          </a>
        </div>

        {/* Dynamic Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto mb-10">
          
          {/* 1. Beekeeper App Card */}
          <div className="group bg-white/70 backdrop-blur-sm border-2 border-[#E0D8C8]/40 hover:border-[#F5A623]/40 p-6 sm:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden active:scale-[0.99]">
            {/* Warm corner glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#F5A623]/10 rounded-full blur-2xl group-hover:bg-[#F5A623]/15 transition-colors" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-[#F5A623]/10 text-[#D97706] rounded-2xl flex items-center justify-center mb-6 border border-[#F5A623]/20 shadow-inner">
                <Microscope size={24} />
              </div>
              <h2 className="text-2xl font-black text-[#4A3C28] mb-3 flex items-center gap-1.5">
                BeekTools Beekeeper
              </h2>
              <p className="text-sm text-[#7A7468] leading-relaxed mb-4 font-medium">
                Your primary hive logs, inspections, tasks, and varroa mite load tracker. Fully supports both Top Bar and Langstroth hive designs with real-time secure database synchronization.
              </p>
              
              {/* Dual Hive Support Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-[#8B4513]/10 text-[#8B4513] text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-xl border border-[#8B4513]/25 flex items-center gap-1">
                  📐 Top Bar Hives
                </span>
                <span className="bg-[#D97706]/10 text-[#D97706] text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-xl border border-[#D97706]/25 flex items-center gap-1">
                  🏢 Langstroth Hives
                </span>
              </div>
              
              {/* Visual mini-illustration */}
              <div className="flex gap-[3px] bg-[#FFFBF0] p-3 rounded-2xl border border-[#E6DCC3] mb-8 w-fit shadow-inner">
                <div className="w-2.5 h-6 bg-[#8B4513] rounded-[2px]" />
                <div className="w-2.5 h-6 bg-[#F59E0B] rounded-[2px]" />
                <div className="w-2.5 h-6 bg-[#93C5FD] rounded-[2px]" />
                <div className="w-2.5 h-6 bg-[#E5E7EB] rounded-[2px]" />
                <div className="w-2.5 h-6 bg-[#F59E0B] rounded-[2px]" />
                <div className="w-2.5 h-6 bg-[#8B4513] rounded-[2px]" />
              </div>
            </div>

            <a 
              href="https://beekeeper.beektools.com" 
              className="relative z-10 w-full py-4 bg-gradient-to-r from-[#8B4513] to-[#723910] text-white rounded-2xl font-black text-center text-sm shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group-hover:gap-3"
            >
              Launch Beekeeper Web App <ArrowRight size={16} />
            </a>
          </div>

          {/* 2. Forecast App Card */}
          <div className="group bg-white/70 backdrop-blur-sm border-2 border-[#E0D8C8]/40 hover:border-[#F5A623]/40 p-6 sm:p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden active:scale-[0.99]">
            {/* Warm corner glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#22C55E]/10 rounded-full blur-2xl group-hover:bg-[#22C55E]/15 transition-colors" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-green-500/10 text-green-600 rounded-2xl flex items-center justify-center mb-6 border border-green-500/20 shadow-inner">
                <CloudSun size={24} />
              </div>
              <h2 className="text-2xl font-black text-[#4A3C28] mb-3">
                BeekTools Forecast
              </h2>
              <p className="text-sm text-[#7A7468] leading-relaxed mb-6 font-medium">
                Intelligent, weather-based hive inspection planning. Automatically scores and color-codes hourly and daily slots over a 7-day forecast.
              </p>
              
              {/* Visual mini-illustration */}
              <div className="grid grid-cols-4 gap-[3px] bg-[#FFFBF0] p-3 rounded-2xl border border-[#E6DCC3] mb-8 w-fit shadow-inner">
                <div className="w-5 h-5 bg-[#22C55E] rounded-md text-[9px] font-black text-white flex items-center justify-center shadow-sm">7</div>
                <div className="w-5 h-5 bg-[#22C55E] rounded-md text-[9px] font-black text-white flex items-center justify-center shadow-sm">8</div>
                <div className="w-5 h-5 bg-[#F59E0B] rounded-md text-[9px] font-black text-white flex items-center justify-center shadow-sm">5</div>
                <div className="w-5 h-5 bg-[#EF4444] rounded-md text-[9px] font-black text-white flex items-center justify-center shadow-sm">2</div>
              </div>
            </div>

            <a 
              href="https://forecast.beektools.com" 
              className="relative z-10 w-full py-4 bg-gradient-to-r from-[#E99B1A] to-[#D97706] text-white rounded-2xl font-black text-center text-sm shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group-hover:gap-3"
            >
              Launch Forecast Web App <ArrowRight size={16} />
            </a>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto px-6 py-6 border-t border-[#F5A623]/10 text-center text-xs font-black uppercase tracking-wider text-[#A19B90] flex flex-col sm:flex-row justify-between gap-4">
        <div>
          © 2026 BeekTools. All rights reserved.
        </div>
        <div className="flex justify-center gap-4">
          <span>Smarter Apiary Management</span>
          <span className="text-[#F5A623]">•</span>
          <span>Forecast & Analytics</span>
        </div>
      </footer>

    </div>
  );
}
