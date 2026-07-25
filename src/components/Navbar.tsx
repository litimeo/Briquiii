import React, { useState, useEffect, useRef } from 'react';
import { AddressSearchResult, ActiveNavTab } from '../types';
import { searchBANAddresses } from '../services/apiAdresse';
import { Logo } from './Logo';
import { Search, MapPin, Database, Sparkles, ArrowRightLeft, FileText, Building2, TrendingUp, Zap, ShieldAlert, Users, Compass, Loader2, Home, Droplets, ShieldCheck, Command, Footprints, HardHat, Landmark, Palette, Wifi, LineChart, ChevronRight } from 'lucide-react';
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs transition-all">
      
      {/* Top Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Predikt Brand Logo */}
          <button
            onClick={() => setActiveTab('search')}
            className="flex items-center gap-2 sm:gap-3 text-left group focus:outline-none shrink-0"
          >
            <Logo size="md" />
          </button>

          {!selectedAddress ? (
            /* Predikt Inspiration Header Navigation Links */
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <a href="#produit" className="hover:text-slate-900 transition-colors">Produit</a>
              <a href="#benefices" className="hover:text-slate-900 transition-colors">Bénéfices</a>
              <a href="#open-data" className="hover:text-slate-900 transition-colors">Axes Open Data</a>
              <a href="#use-cases" className="hover:text-slate-900 transition-colors">Cas d'usage</a>
              <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
            </nav>
          ) : (
            /* BAN Address Search Input Header when Address is Selected */
            <div ref={searchRef} className="relative flex-1 min-w-0 max-w-xl mx-1 sm:mx-0">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Rechercher une adresse..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => {
                    if (results.length > 0) setShowDropdown(true);
                  }}
                  className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs sm:text-sm pl-8 sm:pl-11 pr-7 sm:pr-16 py-1.5 sm:py-2.5 rounded-full border border-slate-200 focus:bg-white focus:outline-none focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 font-medium transition-all min-w-0"
                />

                <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-slate-200/60 border border-slate-300/60 text-[10px] font-mono font-bold text-slate-600 pointer-events-none">
                  <Command className="w-3 h-3" />
                  <span>K</span>
                </div>

                {isLoading && (
                  <div className="absolute right-2 sm:right-12 top-1/2 -translate-y-1/2 text-emerald-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {showDropdown && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 divide-y divide-slate-100">
                  <div className="px-4 py-2 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>Adresses Suggérées</span>
                    <span className="text-emerald-600 font-mono">{results.length} résultats</span>
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
                      className="w-full p-3 text-left hover:bg-slate-50 transition-colors flex items-start gap-3 group"
                    >
                      <MapPin className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900">{item.label}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{item.context}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {selectedAddress ? (
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  onClick={() => setActiveTab('compare')}
                  className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 sm:gap-1.5 border shrink-0 whitespace-nowrap ${
                    activeTab === 'compare'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">Comparer</span>
                </button>

                <button
                  onClick={() => setActiveTab('ai-synthesis')}
                  className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 sm:gap-1.5 border shrink-0 whitespace-nowrap ${
                    activeTab === 'ai-synthesis'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="hidden min-[380px]:inline">Rapport AI</span>
                  <span className="min-[380px]:hidden">AI</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <button className="hidden sm:inline-block text-sm font-medium text-slate-700 hover:text-slate-950 transition-colors px-3 py-2">
                  Se connecter
                </button>
                
                {/* Predikt Black Pill Button */}
                <button
                  onClick={() => {
                    const searchEl = document.getElementById('hero-search-input');
                    if (searchEl) searchEl.focus();
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-3 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-200 shadow-xs flex items-center gap-1.5 sm:gap-2 group cursor-pointer shrink-0 whitespace-nowrap"
                >
                  <span className="hidden min-[380px]:inline">Demander une démo</span>
                  <span className="min-[380px]:hidden">Démo</span>
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Sections Jump Navigation Bar (Only when address is selected) */}
      {selectedAddress && (
        <div className="bg-slate-50/80 border-t border-slate-200/80 overflow-x-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1.5 py-2">
            
            <button
              onClick={() => {
                setActiveTab('search');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 relative ${
                activeTab === 'search'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Rapport Global</span>
            </button>

            <div className="h-4 w-px bg-slate-200 mx-1 flex-shrink-0" />

            {/* Section Jump buttons */}
            <button
              onClick={() => {
                setActiveTab('search');
                document.getElementById('section-cadastre')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap text-slate-700 hover:text-slate-950 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Cadastre</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('search');
                document.getElementById('section-prix')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap text-slate-700 hover:text-slate-950 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Prix & Ventes</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('search');
                document.getElementById('section-forecast')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap text-emerald-800 bg-emerald-50 border border-emerald-200 transition-all flex items-center gap-1.5"
            >
              <LineChart className="w-3.5 h-3.5 text-emerald-600" />
              <span>Prévisions 1-5 ans</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('search');
                document.getElementById('section-loyers')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap text-slate-700 hover:text-slate-950 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5 text-slate-500" />
              <span>Marché Locatif</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('search');
                document.getElementById('section-energie')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap text-slate-700 hover:text-slate-950 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Performance DPE</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('search');
                document.getElementById('section-eau')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap text-slate-700 hover:text-slate-950 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <Droplets className="w-3.5 h-3.5 text-sky-500" />
              <span>Eau Potable</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('search');
                document.getElementById('section-risques')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap text-slate-700 hover:text-slate-950 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
              <span>Risques</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('search');
                document.getElementById('section-securite')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap text-slate-700 hover:text-slate-950 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Sécurité</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('search');
                document.getElementById('section-demographie')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap text-slate-700 hover:text-slate-950 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>Démographie</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('search');
                document.getElementById('section-urbanisme')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap text-slate-700 hover:text-slate-950 hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-slate-500" />
              <span>Urbanisme</span>
            </button>

          </div>
        </div>
      )}

    </header>
  );
};



