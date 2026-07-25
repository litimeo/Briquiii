import React, { useState, useEffect, useRef } from 'react';
import { AddressSearchResult, ActiveNavTab } from '../types';
import { searchBANAddresses } from '../services/apiAdresse';
import { Search, MapPin, Database, Sparkles, ArrowRightLeft, FileText, Building2, TrendingUp, Zap, ShieldAlert, Users, Compass, Loader2, Home, Droplets, ShieldCheck, Command, Footprints, HardHat, Landmark, Palette, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
  activeTab: ActiveNavTab;
  setActiveTab: (tab: ActiveNavTab) => void;
  selectedAddress: AddressSearchResult | null;
  onSelectAddress: (addr: AddressSearchResult) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedAddress,
  onSelectAddress,
}) => {
  const [query, setQuery] = useState(selectedAddress ? selectedAddress.label : '');
  const [results, setResults] = useState<AddressSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync input with selectedAddress when changed externally
  useEffect(() => {
    if (selectedAddress) {
      setQuery(selectedAddress.label);
    }
  }, [selectedAddress]);

  // Global CMD+K shortcut listener to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search to BAN API
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    // Don't search if the query is exact label of current selected address
    if (selectedAddress && query === selectedAddress.label) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      const res = await searchBANAddresses(query);
      setResults(res);
      setIsLoading(false);
      setShowDropdown(res.length > 0);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, selectedAddress]);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition-all">
      
      {/* Top Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between py-3.5 sm:h-20 gap-3 sm:gap-4">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <button
              onClick={() => setActiveTab('search')}
              className="flex items-center gap-3 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#f56902] via-[#ff8a3d] to-amber-500 flex items-center justify-center font-black text-white text-xl sm:text-2xl font-heading shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform flex-shrink-0">
                B
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-heading">
                    Briquia<span className="text-[#f56902]">.fr</span>
                  </span>
                  
                  {/* Hero UI Chip Badge */}
                  <span className="hidden sm:inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-950 border border-orange-500/20 text-[11px] font-extrabold px-3 py-0.5 rounded-full shadow-2xs">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f56902]"></span>
                    </span>
                    <Database className="w-3 h-3 text-[#f56902]" />
                    Open Data 12 Axes
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium line-clamp-1">Audit Foncier, Risques, Prix & Urbanisme en France</p>
              </div>
            </button>

            {/* Mobile Actions Header shortcut when address is selected */}
            {selectedAddress && (
              <div className="flex sm:hidden items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('compare')}
                  className={`p-2.5 rounded-2xl text-xs font-bold transition-all border ${
                    activeTab === 'compare'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                  title="Comparer"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('ai-synthesis')}
                  className={`p-2.5 rounded-2xl text-xs font-black transition-all border ${
                    activeTab === 'ai-synthesis'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}
                  title="Rapport AI"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* BAN Address Search Input */}
          <div ref={searchRef} className="relative flex-1 max-w-xl">
            <div className="relative">
              <Search className="w-4.5 h-4.5 text-blue-600 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Rechercher une adresse en France (ex: 15 Rue de la Paix, Paris)..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                onFocus={() => {
                  if (results.length > 0) setShowDropdown(true);
                }}
                className="w-full bg-slate-100/80 text-slate-900 placeholder-slate-400 text-xs sm:text-sm pl-11 pr-16 py-3 rounded-2xl border border-slate-200/90 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100/80 shadow-2xs font-medium transition-all"
              />

              {/* CMD+K Keyboard Shortcut Tag */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-slate-200/70 border border-slate-300/80 text-[10px] font-mono font-bold text-slate-600 pointer-events-none">
                <Command className="w-3 h-3" />
                <span>K</span>
              </div>

              {isLoading && (
                <div className="absolute right-12 top-1/2 -translate-y-1/2 text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              )}
            </div>

            {/* Live Autocomplete Results */}
            {showDropdown && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-100/80">
                <div className="px-4 py-2.5 bg-slate-50/90 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Adresses Suggérées</span>
                  <span className="text-blue-700 font-mono font-bold">{results.length} résultats</span>
                </div>

                {results.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectAddress(item);
                      setQuery(item.label);
                      setShowDropdown(false);
                      setActiveTab('search');
                    }}
                    className="w-full p-3.5 text-left hover:bg-blue-50/90 transition-colors flex items-start gap-3.5 group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700">{item.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.context}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Action Tools: Comparison & AI */}
          {selectedAddress && (
            <div className="hidden sm:flex items-center gap-2.5">
              <button
                onClick={() => setActiveTab('compare')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  activeTab === 'compare'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/90 shadow-2xs'
                }`}
              >
                <ArrowRightLeft className="w-4 h-4 text-blue-500" />
                <span className="hidden md:inline">Comparer 2 adresses</span>
              </button>

              <button
                onClick={() => setActiveTab('ai-synthesis')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 border ${
                  activeTab === 'ai-synthesis'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-md shadow-emerald-600/25'
                    : 'bg-emerald-50/90 hover:bg-emerald-100 text-emerald-900 border-emerald-200'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Rapport AI</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Sections Jump Navigation Bar (Only when address is selected) */}
      {selectedAddress && (
        <div className="bg-slate-50/90 border-t border-slate-200/80 overflow-x-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1.5 py-2">
            
            <button
              onClick={() => {
                setActiveTab('search');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all flex items-center gap-2 relative ${
                activeTab === 'search'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Rapport Global</span>
            </button>

            <div className="h-5 w-px bg-slate-200 mx-1 flex-shrink-0" />

            {/* Section 1: Cadastre */}
            <button
              onClick={() => {
                setActiveTab('search');
                const el = document.getElementById('section-cadastre');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap text-slate-700 hover:text-slate-950 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Cadastre</span>
            </button>

            {/* Section 2: Prix & Ventes */}
            <button
              onClick={() => {
                setActiveTab('search');
                const el = document.getElementById('section-prix');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap text-slate-700 hover:text-slate-950 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Prix & Ventes</span>
            </button>

            {/* Section 3: Marché Locatif */}
            <button
              onClick={() => {
                setActiveTab('search');
                const el = document.getElementById('section-loyers');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap text-slate-700 hover:text-slate-950 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <Home className="w-4 h-4 text-cyan-600" />
              <span>Marché Locatif</span>
            </button>

            {/* Section 4: Performance Énergétique */}
            <button
              onClick={() => {
                setActiveTab('search');
                const el = document.getElementById('section-energie');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap text-slate-700 hover:text-slate-950 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4 text-amber-600" />
              <span>Performance DPE</span>
            </button>

            {/* Section 5: Eau Potable */}
            <button
              onClick={() => {
                setActiveTab('search');
                const el = document.getElementById('section-eau');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap text-slate-700 hover:text-slate-950 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <Droplets className="w-4 h-4 text-sky-600" />
              <span>Eau Potable</span>
            </button>

            {/* Section 6: Risques */}
            <button
              onClick={() => {
                setActiveTab('search');
                const el = document.getElementById('section-risques');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap text-slate-700 hover:text-slate-950 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Risques</span>
            </button>

            {/* Section 7: Sécurité */}
            <button
              onClick={() => {
                setActiveTab('search');
                const el = document.getElementById('section-securite');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap text-slate-700 hover:text-slate-950 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Sécurité</span>
            </button>

            {/* Section 8: Démographie */}
            <button
              onClick={() => {
                setActiveTab('search');
                const el = document.getElementById('section-demographie');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap text-slate-700 hover:text-slate-950 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <Users className="w-4 h-4 text-purple-600" />
              <span>Démographie</span>
            </button>

            {/* Section 9: Urbanisme */}
            <button
              onClick={() => {
                setActiveTab('search');
                const el = document.getElementById('section-urbanisme');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap text-slate-700 hover:text-slate-950 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-teal-600" />
              <span>Urbanisme</span>
            </button>

            {/* Section 10: Qualité de Vie */}
            <button
              onClick={() => {
                setActiveTab('search');
                const el = document.getElementById('section-qualite-vie');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap text-slate-700 hover:text-slate-950 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <Footprints className="w-4 h-4 text-[#f56902]" />
              <span>Qualité de vie</span>
            </button>

            {/* Section 11: Permis de Construire */}
            <button
              onClick={() => {
                setActiveTab('search');
                const el = document.getElementById('section-permis');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap text-slate-700 hover:text-slate-950 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <HardHat className="w-4 h-4 text-amber-600" />
              <span>Permis de Construire</span>
            </button>

            {/* Section 12: Élus & Politique */}
            <button
              onClick={() => {
                setActiveTab('search');
                const el = document.getElementById('section-elus');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap text-slate-700 hover:text-slate-950 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <Landmark className="w-4 h-4 text-indigo-600" />
              <span>Élus & Politique</span>
            </button>

            {/* Section 13: Équipements Culturels */}
            <button
              onClick={() => {
                setActiveTab('search');
                const el = document.getElementById('section-culture');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap text-slate-700 hover:text-slate-950 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <Palette className="w-4 h-4 text-amber-600" />
              <span>Lieux Culturels</span>
            </button>

            {/* Section 14: Internet & Fibre */}
            <button
              onClick={() => {
                setActiveTab('search');
                const el = document.getElementById('section-internet');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap text-slate-700 hover:text-slate-950 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <Wifi className="w-4 h-4 text-cyan-600" />
              <span>Connexion Internet</span>
            </button>

          </div>
        </div>
      )}

    </header>
  );
};


