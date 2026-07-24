import React, { useState, useEffect, useRef } from 'react';
import { AddressSearchResult, ActiveNavTab } from '../types';
import { searchBANAddresses } from '../services/apiAdresse';
import { Search, MapPin, Database, Sparkles, ArrowRightLeft, FileText, Building2, TrendingUp, Zap, ShieldAlert, Users, Compass, Loader2, Home, Droplets, ShieldCheck } from 'lucide-react';

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

  // Sync input with selectedAddress when changed externally
  useEffect(() => {
    if (selectedAddress) {
      setQuery(selectedAddress.label);
    }
  }, [selectedAddress]);

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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      
      {/* Top Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between py-3 sm:h-20 gap-3 sm:gap-4">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <button
              onClick={() => setActiveTab('search')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-lg sm:text-xl font-serif shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
                B
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight font-serif">
                    Briquia<span className="text-blue-600">.fr</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                    <Database className="w-3 h-3 text-blue-600" />
                    Audit & Intelligence Foncière
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium line-clamp-1">Rapport d'Audit Foncier Complexe & Analyse Territoriale</p>
              </div>
            </button>

            {/* Mobile Actions Header shortcut when address is selected */}
            {selectedAddress && (
              <div className="flex sm:hidden items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('compare')}
                  className={`p-2 rounded-xl text-xs font-bold transition-all border ${
                    activeTab === 'compare'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                  title="Comparer"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('ai-synthesis')}
                  className={`p-2 rounded-xl text-xs font-black transition-all border ${
                    activeTab === 'ai-synthesis'
                      ? 'bg-emerald-600 text-white border-emerald-600'
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
              <Search className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher une adresse en France (ex: 15 Rue de la Paix, Paris)..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                onFocus={() => {
                  if (results.length > 0) setShowDropdown(true);
                }}
                className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs pl-10 pr-10 py-2.5 sm:py-3 rounded-2xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-xs font-medium transition-all"
              />

              {isLoading && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              )}
            </div>

            {/* Live Autocomplete Results */}
            {showDropdown && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 divide-y divide-slate-100">
                <div className="px-3.5 py-2 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Adresses Recommandées</span>
                  <span className="text-blue-600 font-mono">{results.length} résultats</span>
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
                    className="w-full p-3.5 text-left hover:bg-blue-50/80 transition-colors flex items-start gap-3 group"
                  >
                    <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">{item.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{item.context}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Action Tools: Comparison & AI */}
          {selectedAddress && (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => setActiveTab('compare')}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  activeTab === 'compare'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
                }`}
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Comparer 2 adresses</span>
              </button>

              <button
                onClick={() => setActiveTab('ai-synthesis')}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border ${
                  activeTab === 'ai-synthesis'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                    : 'bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border-emerald-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Rapport AI</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Sections Jump Navigation Bar (Only when address is selected) */}
      {selectedAddress && (
        <div className="bg-slate-50/90 border-t border-slate-200 overflow-x-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 py-2">
            
            <button
              onClick={() => {
                setActiveTab('search');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'search'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Rapport Global</span>
            </button>

            <div className="h-4 w-px bg-slate-200 mx-1 flex-shrink-0" />

            {/* Section 1: Cadastre */}
            <button
              onClick={() => {
                setActiveTab('search');
                const el = document.getElementById('section-cadastre');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap text-slate-700 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Cadastre & Parcelle</span>
            </button>

            {/* Section 2: Prix & Ventes */}
            <button
              onClick={() => {
                setActiveTab('search');
                const el = document.getElementById('section-prix');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap text-slate-700 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Prix & Transactions</span>
            </button>

            {/* Section 3: Marché Locatif */}
            <button
              onClick={() => {
                setActiveTab('search');
                const el = document.getElementById('section-loyers');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap text-slate-700 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5 text-cyan-600" />
              <span>Marché Locatif</span>
            </button>

            {/* Section 4: Performance Énergétique */}
            <button
              onClick={() => {
                setActiveTab('search');
                const el = document.getElementById('section-energie');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap text-slate-700 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Performance Énergétique</span>
            </button>

            {/* Section 5: Eau Potable */}
            <button
              onClick={() => {
                setActiveTab('search');
                const el = document.getElementById('section-eau');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap text-slate-700 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <Droplets className="w-3.5 h-3.5 text-sky-600" />
              <span>Eau Potable ARS</span>
            </button>

            {/* Section 6: Risques */}
            <button
              onClick={() => {
                setActiveTab('search');
                const el = document.getElementById('section-risques');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap text-slate-700 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Risques & Environnement</span>
            </button>

            {/* Section 7: Sécurité */}
            <button
              onClick={() => {
                setActiveTab('search');
                const el = document.getElementById('section-securite');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap text-slate-700 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Sécurité & Sérénité</span>
            </button>

            {/* Section 8: Démographie */}
            <button
              onClick={() => {
                setActiveTab('search');
                const el = document.getElementById('section-demographie');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap text-slate-700 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span>Démographie & Revenus</span>
            </button>

            {/* Section 9: Urbanisme */}
            <button
              onClick={() => {
                setActiveTab('search');
                const el = document.getElementById('section-urbanisme');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap text-slate-700 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-teal-600" />
              <span>Urbanisme & Transports</span>
            </button>

          </div>
        </div>
      )}

    </header>
  );
};

