import React, { useState, useEffect, useRef } from 'react';
import { AddressSearchResult } from '../types';
import { searchBANAddresses } from '../services/apiAdresse';
import { Logo } from './Logo';
import {
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  Building2,
  TrendingUp,
  Zap,
  ShieldAlert,
  Users,
  Compass,
  Home as HomeIcon,
  Droplets,
  ShieldCheck,
  Footprints,
  HardHat,
  Landmark,
  Palette,
  Wifi,
  LineChart,
  CheckCircle2,
  Loader2,
  Briefcase,
  Hammer,
  Eye,
  ChevronRight,
  HelpCircle,
  ChevronDown,
  ArrowUpRight,
  Award,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface HomePageProps {
  onSelectAddress: (addr: AddressSearchResult) => void;
  presetAddresses: AddressSearchResult[];
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectAddress,
  presetAddresses,
}) => {
  // Hero Search State
  const [heroQuery, setHeroQuery] = useState('');
  const [heroResults, setHeroResults] = useState<AddressSearchResult[]>([]);
  const [isHeroSearching, setIsHeroSearching] = useState(false);
  const [showHeroDropdown, setShowHeroDropdown] = useState(false);
  const heroSearchRef = useRef<HTMLDivElement>(null);

  // Bottom CTA Search State
  const [ctaQuery, setCtaQuery] = useState('');
  const [ctaResults, setCtaResults] = useState<AddressSearchResult[]>([]);
  const [isCtaSearching, setIsCtaSearching] = useState(false);
  const [showCtaDropdown, setShowCtaDropdown] = useState(false);
  const ctaSearchRef = useRef<HTMLDivElement>(null);

  // Active Showcase Card Tab on Hero
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<'dpe' | 'dvf' | 'rent' | 'water'>('dpe');

  // FAQ Toggle State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Debounced search for hero
  useEffect(() => {
    if (!heroQuery.trim() || heroQuery.length < 2) {
      setHeroResults([]);
      setShowHeroDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsHeroSearching(true);
      const res = await searchBANAddresses(heroQuery);
      setHeroResults(res);
      setIsHeroSearching(false);
      setShowHeroDropdown(res.length > 0);
    }, 300);

    return () => clearTimeout(timer);
  }, [heroQuery]);

  // Debounced search for bottom CTA
  useEffect(() => {
    if (!ctaQuery.trim() || ctaQuery.length < 2) {
      setCtaResults([]);
      setShowCtaDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCtaSearching(true);
      const res = await searchBANAddresses(ctaQuery);
      setCtaResults(res);
      setIsCtaSearching(false);
      setShowCtaDropdown(res.length > 0);
    }, 300);

    return () => clearTimeout(timer);
  }, [ctaQuery]);

  // Outside click handlers
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (heroSearchRef.current && !heroSearchRef.current.contains(e.target as Node)) {
        setShowHeroDropdown(false);
      }
      if (ctaSearchRef.current && !ctaSearchRef.current.contains(e.target as Node)) {
        setShowCtaDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-emerald-500 selection:text-white overflow-hidden">
      
      {/* Background Glows (Predikt Style Soft Green Auras) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-60">
        <div className="absolute top-[-5%] left-[25%] w-[600px] h-[600px] bg-emerald-100/50 rounded-full filter blur-[140px]" />
        <div className="absolute top-[25%] right-[5%] w-[500px] h-[500px] bg-teal-100/40 rounded-full filter blur-[120px]" />
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-16 pb-20 sm:pt-24 sm:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Floating Announcement Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-2xs text-xs font-semibold text-slate-700">
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">NOUVEAU</span>
            <span>Rapport d'Adresse Open Data & Prévisions 2026</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-heading text-slate-900 leading-[1.08]">
            Découvrez tout ce qu'une <br className="hidden sm:inline" />
            <span className="text-slate-900">adresse peut révéler.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-2xl text-slate-600 font-normal max-w-3xl mx-auto leading-relaxed">
            Avant d'acheter, d'investir ou de construire, comprenez réellement le lieu que vous envisagez.
          </p>

          <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
            En quelques secondes, obtenez une vision complète d'une adresse, de son environnement et de son potentiel dans un seul rapport.
          </p>
        </div>

        {/* Hero Search Box */}
        <div className="mt-10 max-w-2xl mx-auto relative z-30" ref={heroSearchRef}>
          <div className="bg-white p-2.5 sm:p-3 rounded-full border border-slate-200 shadow-xl flex flex-col sm:flex-row items-center gap-2 focus-within:border-slate-800 focus-within:ring-4 focus-within:ring-slate-900/5 transition-all">
            
            <div className="relative flex-1 flex items-center pl-4 pr-2 w-full">
              <MapPin className="w-5 h-5 text-emerald-500 flex-shrink-0 mr-3" />
              <input
                id="hero-search-input"
                type="text"
                placeholder="Entrez une adresse..."
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                onFocus={() => {
                  if (heroResults.length > 0) setShowHeroDropdown(true);
                }}
                className="w-full py-3 text-slate-900 placeholder-slate-400 text-base font-medium focus:outline-none bg-transparent"
              />
              {isHeroSearching && (
                <Loader2 className="w-5 h-5 text-emerald-500 animate-spin flex-shrink-0 ml-2" />
              )}
            </div>

            <button
              onClick={() => {
                if (heroResults.length > 0) {
                  onSelectAddress(heroResults[0]);
                } else if (heroQuery.trim()) {
                  searchBANAddresses(heroQuery).then((res) => {
                    if (res.length > 0) onSelectAddress(res[0]);
                  });
                }
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-md flex-shrink-0 cursor-pointer"
            >
              <span>Analyser l'adresse</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {showHeroDropdown && heroResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-100">
              <div className="px-5 py-3 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between items-center">
                <span>Adresses officielles BAN</span>
                <span className="text-emerald-600 font-mono">{heroResults.length} résultats</span>
              </div>
              {heroResults.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectAddress(item);
                    setShowHeroDropdown(false);
                  }}
                  className="w-full p-4 text-left hover:bg-slate-50 transition-colors flex items-center gap-4 group"
                >
                  <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-slate-900">{item.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{item.context}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Preset Sample Quick Chips */}
          <div className="mt-4 flex items-center justify-center flex-wrap gap-2 text-xs">
            <span className="text-slate-500 font-medium mr-1">Exemples populaires :</span>
            {presetAddresses.slice(0, 4).map((preset) => (
              <button
                key={preset.id}
                onClick={() => onSelectAddress(preset)}
                className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 transition-all font-medium text-xs shadow-2xs"
              >
                {preset.city} ({preset.postcode})
              </button>
            ))}
          </div>
        </div>

        {/* Hero Interactive UI Showcase Dashboard Card */}
        <div className="mt-16 sm:mt-24 max-w-5xl mx-auto relative">
          {/* Subtle glowing aura behind dashboard */}
          <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 via-teal-400/10 to-blue-500/10 rounded-[40px] filter blur-2xl pointer-events-none" />

          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden relative z-10">
            
            {/* Top Showcase Controls Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="h-4 w-px bg-slate-800 mx-2" />
                <span className="text-xs font-medium text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Rapport : 15 Rue de la Paix, 75002 Paris
                </span>
              </div>

              {/* Showcase Tab Switchers */}
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl text-xs font-semibold overflow-x-auto max-w-full">
                <button
                  onClick={() => setActiveShowcaseTab('dpe')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeShowcaseTab === 'dpe'
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  DPE & Énergie
                </button>
                <button
                  onClick={() => setActiveShowcaseTab('dvf')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeShowcaseTab === 'dvf'
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Prix & Ventes
                </button>
                <button
                  onClick={() => setActiveShowcaseTab('rent')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeShowcaseTab === 'rent'
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Loyers & Rendement
                </button>
                <button
                  onClick={() => setActiveShowcaseTab('water')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeShowcaseTab === 'water'
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Eau & ARS
                </button>
              </div>
            </div>

            {/* Showcase Tab Dynamic Content Panel */}
            <div className="p-6 sm:p-8 bg-slate-50/50">
              
              {activeShowcaseTab === 'dpe' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* DPE Grade Badge */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Performance Énergétique</span>
                        <h4 className="text-xl font-extrabold text-slate-900 mt-1">DPE de l'Adresse</h4>
                      </div>
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-200 text-xs font-black rounded-lg">
                        ADEME
                      </span>
                    </div>

                    <div className="my-6 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white font-black text-3xl flex items-center justify-center shadow-md">
                        E
                      </div>
                      <div>
                        <div className="text-2xl font-black text-slate-900">275 <span className="text-sm font-normal text-slate-500">kWh/m²/an</span></div>
                        <div className="text-xs text-slate-500 font-medium">GES : <strong className="text-slate-700">48 kg CO₂/m²/an</strong></div>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Facture estimée :</span>
                        <strong className="text-slate-900">3 069 € - 4 143 €/an</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Chauffage :</span>
                        <strong className="text-slate-900">Gaz individuel</strong>
                      </div>
                    </div>
                  </div>

                  {/* DPE Color Ladder */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs col-span-1 md:col-span-2 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-bold text-slate-900">Échelle DPE Diagnostic Énergétique</h4>
                      <span className="text-xs text-slate-500">Janvier 2024</span>
                    </div>

                    <div className="space-y-2">
                      {[
                        { letter: 'A', range: '< 70', color: 'bg-emerald-600', active: false },
                        { letter: 'B', range: '71 - 110', color: 'bg-emerald-500', active: false },
                        { letter: 'C', range: '111 - 180', color: 'bg-lime-500', active: false },
                        { letter: 'D', range: '181 - 250', color: 'bg-amber-400', active: false },
                        { letter: 'E', range: '251 - 330', color: 'bg-amber-500', active: true },
                        { letter: 'F', range: '331 - 420', color: 'bg-orange-500', active: false },
                        { letter: 'G', range: '> 420', color: 'bg-rose-600', active: false },
                      ].map((item) => (
                        <div key={item.letter} className="flex items-center gap-3">
                          <div className={`h-7 rounded-lg text-white font-black text-xs px-3 flex items-center justify-between transition-all ${item.color} ${item.active ? 'w-full shadow-sm scale-[1.01]' : 'w-2/3 opacity-50'}`}>
                            <span>Classe {item.letter}</span>
                            <span>{item.range} kWh/m²</span>
                          </div>
                          {item.active && (
                            <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md whitespace-nowrap">
                              ← Adresse analysée
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeShowcaseTab === 'dvf' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Actes Notariés DVF</span>
                    <div className="mt-3 text-3xl font-black text-slate-900">11 480 €<span className="text-base font-medium text-slate-500">/m²</span></div>
                    <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> +2.9% / an sur 5 ans
                    </p>
                    <div className="mt-6 pt-4 border-t border-slate-100 text-xs space-y-2">
                      <div className="flex justify-between"><span className="text-slate-500">Prix médian rue :</span><strong>11 250 €/m²</strong></div>
                      <div className="flex justify-between"><span className="text-slate-500">Dernière vente :</span><strong>890 000 € (78 m²)</strong></div>
                      <div className="flex justify-between"><span className="text-slate-500">Liquidité secteur :</span><strong className="text-emerald-700">78 / 100 (Très forte)</strong></div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs col-span-1 md:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-bold text-slate-900">Évolution Historique des Prix au m² (DVF DGFiP)</h4>
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">Source Notaires</span>
                    </div>

                    <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-200">
                      {[
                        { year: '2020', price: 9800, height: '60%' },
                        { year: '2021', price: 10400, height: '70%' },
                        { year: '2022', price: 11100, height: '82%' },
                        { year: '2023', price: 11200, height: '85%' },
                        { year: '2024', price: 11480, height: '92%' },
                        { year: '2025', price: 11850, height: '100%' },
                      ].map((bar) => (
                        <div key={bar.year} className="flex-1 flex flex-col items-center gap-2 group">
                          <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">{bar.price}€</span>
                          <div className={`w-full rounded-t-lg bg-emerald-500 transition-all group-hover:bg-emerald-600`} style={{ height: bar.height }} />
                          <span className="text-xs font-semibold text-slate-500">{bar.year}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeShowcaseTab === 'rent' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Marché Locatif & Rendement</span>
                    <div className="mt-3 text-3xl font-black text-slate-900">32.40 €<span className="text-base font-medium text-slate-500">/m²/mois</span></div>
                    <p className="text-xs text-slate-500 font-medium mt-1">Loyer médian secteur</p>
                    <div className="mt-6 pt-4 border-t border-slate-100 text-xs space-y-2">
                      <div className="flex justify-between"><span className="text-slate-500">Rendement brut estimé :</span><strong className="text-emerald-700">5.87 %</strong></div>
                      <div className="flex justify-between"><span className="text-slate-500">Taux d'occupation :</span><strong>96.7 %</strong></div>
                      <div className="flex justify-between"><span className="text-slate-500">Tension locative :</span><strong className="text-rose-600">Extrême (Zone Tendu)</strong></div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs col-span-1 md:col-span-2">
                    <h4 className="text-sm font-bold text-slate-900 mb-4">Loyers Médians par Typologie de Bien</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: 'Studio (T1)', rent: '720 €', m2: '33.5 €/m²' },
                        { label: 'T2 (2 pièces)', rent: '1 150 €', m2: '31.8 €/m²' },
                        { label: 'T3 (3 pièces)', rent: '1 680 €', m2: '29.2 €/m²' },
                        { label: 'T4+ (Familial)', rent: '2 400 €', m2: '27.5 €/m²' },
                      ].map((t) => (
                        <div key={t.label} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                          <span className="text-xs font-semibold text-slate-500 block">{t.label}</span>
                          <span className="text-lg font-black text-slate-900 block mt-1">{t.rent}</span>
                          <span className="text-[11px] text-emerald-600 font-bold block">{t.m2}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeShowcaseTab === 'water' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Agence Régionale de Santé (ARS)</span>
                    <div className="mt-3 text-3xl font-black text-emerald-600 flex items-center gap-2">
                      99.6% <ShieldCheck className="w-7 h-7 text-emerald-500" />
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">Conformité Microbiologique</p>
                    <div className="mt-6 pt-4 border-t border-slate-100 text-xs space-y-2">
                      <div className="flex justify-between"><span className="text-slate-500">Nitrates :</span><strong className="text-emerald-700">12 mg/L (Conforme)</strong></div>
                      <div className="flex justify-between"><span className="text-slate-500">Pesticides :</span><strong className="text-emerald-700">Non détectés</strong></div>
                      <div className="flex justify-between"><span className="text-slate-500">PFAS / Polluants :</span><strong className="text-emerald-700">Conforme aux normes</strong></div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs col-span-1 md:col-span-2 flex flex-col justify-between">
                    <h4 className="text-sm font-bold text-slate-900 mb-2">Bilan Qualité de l'Eau au Robinet</h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      Réseau d'eau sous contrôle continu de l'ARS d'Île-de-France. Eau conforme à l'ensemble des limites réglementaires de qualité sanitaires.
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <span className="text-[11px] font-bold text-emerald-800 block">Bactériologie</span>
                        <span className="text-base font-black text-emerald-900">Excellente</span>
                      </div>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                        <span className="text-[11px] font-bold text-blue-800 block">Dureté Eau</span>
                        <span className="text-base font-black text-blue-900">22.4 °fH</span>
                      </div>
                      <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl">
                        <span className="text-[11px] font-bold text-teal-800 block">Plomb</span>
                        <span className="text-base font-black text-teal-900">&lt; 1 µg/L</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </section>

      {/* SECTION 2: Une adresse. Une vision complète. */}
      <section className="py-20 sm:py-28 bg-white border-y border-slate-200/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Text Content */}
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                Vision Globale
              </span>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-heading leading-tight">
                Une adresse. <br />
                <span className="text-slate-900">Une vision complète.</span>
              </h2>

              <div className="space-y-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
                <p className="font-semibold text-slate-800">
                  Un bien ne se résume pas à ses quatre murs.
                </p>
                <ul className="space-y-2.5 font-medium text-slate-700">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Sa valeur dépend de son quartier.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>De son marché.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Des projets qui l'entourent.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Des risques.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Des opportunités.</span>
                  </li>
                </ul>

                <p className="pt-2 text-slate-600">
                  <strong>Signal Immo</strong> rassemble toutes les informations essentielles dans un rapport unique, conçu pour vous aider à prendre de meilleures décisions.
                </p>
              </div>
            </div>

            {/* Right Column: Visual Dashboard Card */}
            <div className="lg:col-span-6">
              <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Rapport Unifié Signal Immo</span>
                  </div>
                  <span className="text-xs text-slate-400">13 Modules Synchronisés</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                    <span className="text-xs text-slate-400 block font-medium">Prix au m² DVF</span>
                    <span className="text-xl font-black text-white mt-1 block">3 662 € / m²</span>
                    <span className="text-[11px] text-emerald-400 font-bold mt-1 block">+2.9% / an sur 5 ans</span>
                  </div>

                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                    <span className="text-xs text-slate-400 block font-medium">Note DPE Énergie</span>
                    <span className="text-xl font-black text-amber-400 mt-1 block">Classe C (142 kWh)</span>
                    <span className="text-[11px] text-slate-300 font-medium mt-1 block">Coût : ~1 250 € / an</span>
                  </div>

                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                    <span className="text-xs text-slate-400 block font-medium">Risques Naturels</span>
                    <span className="text-xl font-black text-emerald-400 mt-1 block">Inondation Faible</span>
                    <span className="text-[11px] text-slate-300 font-medium mt-1 block">Retrait-gonflement argiles</span>
                  </div>

                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                    <span className="text-xs text-slate-400 block font-medium">Connectivité Fibre</span>
                    <span className="text-xl font-black text-emerald-400 mt-1 block">Éligible 100%</span>
                    <span className="text-[11px] text-slate-300 font-medium mt-1 block">Orange, SFR, Bouygues, Free</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-bold text-slate-200">Synthèse par Intelligence Artificielle</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">Inclus</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 3: Tout ce qu'il faut savoir. En un seul rapport. */}
      <section className="py-20 sm:py-28 bg-[#F8FAFC] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3.5 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-bold">
              Analyse à 360 Degrés
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-heading mt-3">
              Tout ce qu'il faut savoir. <br />
              <span className="text-slate-900">En un seul rapport.</span>
            </h2>
            <p className="mt-4 text-slate-600 text-base sm:text-lg">
              Chaque axe d'analyse est extrait des registres officiels et structuré pour une lecture rapide et intuitive.
            </p>
          </div>

          {/* 8 Grid Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: HomeIcon,
                title: '🏡 Le bien',
                desc: 'Les informations essentielles sur le bien et son terrain.',
                accent: 'bg-slate-100 text-slate-800 border-slate-200',
              },
              {
                icon: TrendingUp,
                title: '📈 Le marché',
                desc: 'Prix, ventes récentes, tendances et dynamique locale.',
                accent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              },
              {
                icon: LineChart,
                title: '💰 Investissement',
                desc: 'Potentiel, demande locative et perspectives.',
                accent: 'bg-teal-50 text-teal-700 border-teal-200',
              },
              {
                icon: Compass,
                title: '🏗 Urbanisme',
                desc: 'PLU, zonage, servitudes et projets à proximité.',
                accent: 'bg-slate-100 text-slate-800 border-slate-200',
              },
              {
                icon: ShieldAlert,
                title: '🌍 Risques',
                desc: 'Risques naturels, environnementaux et contraintes réglementaires.',
                accent: 'bg-rose-50 text-rose-700 border-rose-200',
              },
              {
                icon: Footprints,
                title: '🚆 Mobilité',
                desc: 'Transports, accessibilité et temps de trajet.',
                accent: 'bg-amber-50 text-amber-700 border-amber-200',
              },
              {
                icon: Users,
                title: '🏫 Cadre de vie',
                desc: 'Écoles, commerces, santé, services et vie de quartier.',
                accent: 'bg-slate-100 text-slate-800 border-slate-200',
              },
              {
                icon: Wifi,
                title: '🌐 Connectivité',
                desc: 'Fibre, couverture mobile et qualité de la connexion.',
                accent: 'bg-slate-100 text-slate-800 border-slate-200',
              },
            ].map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all group duration-200"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border ${pillar.accent} group-hover:scale-105 transition-transform`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 4: Pensé pour chaque projet immobilier */}
      <section className="py-20 sm:py-28 bg-white border-t border-slate-200/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              Pour Particuliers & Professionnels
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-heading mt-3">
              Pensé pour chaque <span className="text-slate-900">projet immobilier.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Habiter */}
            <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-slate-200 text-slate-800 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <HomeIcon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">🏠 Habiter</h3>
                <p className="mt-3 text-slate-600 text-base leading-relaxed">
                  Découvrez ce que sera réellement votre quotidien avant de déménager.
                </p>
              </div>
              <ul className="mt-8 space-y-2.5 text-xs font-semibold text-slate-700 border-t border-slate-200/80 pt-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Écoles & Commerces à proximité</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Niveau de bruit & Risques naturels</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Qualité de l'eau potable & Fibre</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Investir */}
            <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <Briefcase className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">💼 Investir</h3>
                <p className="mt-3 text-slate-600 text-base leading-relaxed">
                  Analysez un marché avant d'engager votre capital.
                </p>
              </div>
              <ul className="mt-8 space-y-2.5 text-xs font-semibold text-slate-700 border-t border-slate-200/80 pt-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Rendement locatif brut & Taux occupation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Prévision des prix à 1, 3 et 5 ans</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Historique DVF des ventes de la rue</span>
                </li>
              </ul>
            </div>

            {/* Card 3: Construire */}
            <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-slate-200 text-slate-800 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <Hammer className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">🏗 Construire</h3>
                <p className="mt-3 text-slate-600 text-base leading-relaxed">
                  Comprenez le terrain avant de lancer votre projet.
                </p>
              </div>
              <ul className="mt-8 space-y-2.5 text-xs font-semibold text-slate-700 border-t border-slate-200/80 pt-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Zonage PLU & Emprise au sol</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Permis de construire déposés à proximité</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Contraintes géotechniques & Sol</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 5: FAQ Accordion Section */}
      <section className="py-20 sm:py-28 bg-[#F8FAFC] border-t border-slate-200/80 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <span className="px-3.5 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-bold">
              Questions Fréquentes
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-heading mt-3">
              Foire Aux Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "D'où proviennent les données présentées dans le rapport ?",
                a: "Toutes les données sont issues directement des bases de données publiques et registres officiels de l'État Français (DGFiP, ADEME, Ministère du Logement, Géorisques, ARS, INSEE, et la Base Adresse Nationale).",
              },
              {
                q: "Combien de temps faut-il pour générer un rapport ?",
                a: "Le rapport s'affiche instantanément en 2 à 3 secondes après la saisie de l'adresse dans la barre de recherche.",
              },
              {
                q: "Les prévisions de prix à 1-5 ans sont-elles fiables ?",
                a: "Les prévisions utilisent nos algorithmes basés sur l'historique des transactions DVF des 10 dernières années, l'évolution démographique et les facteurs macroéconomiques locaux.",
              },
              {
                q: "Le service est-il gratuit ?",
                a: "L'accès aux données essentielles et aux prévisions principales est totalement libre et gratuit.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between font-bold text-slate-900 text-base sm:text-lg focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FINAL CTA: Commencez avec une adresse. */}
      <section className="py-20 sm:py-28 bg-white relative z-10 border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
            Commencez avec une adresse.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Saisissez n'importe quelle adresse et découvrez tout ce qu'il faut savoir avant de prendre une décision.
          </p>

          {/* CTA Search Input Box */}
          <div className="mt-10 max-w-xl mx-auto relative" ref={ctaSearchRef}>
            <div className="bg-[#F8FAFC] p-2.5 rounded-full border border-slate-200 shadow-xl flex flex-col sm:flex-row items-center gap-2 focus-within:border-slate-800 transition-all">
              <div className="relative flex-1 flex items-center pl-4 pr-2 w-full">
                <MapPin className="w-5 h-5 text-emerald-500 flex-shrink-0 mr-3" />
                <input
                  type="text"
                  placeholder="Entrez une adresse..."
                  value={ctaQuery}
                  onChange={(e) => setCtaQuery(e.target.value)}
                  onFocus={() => {
                    if (ctaResults.length > 0) setShowCtaDropdown(true);
                  }}
                  className="w-full py-3 text-slate-900 placeholder-slate-400 text-base font-medium focus:outline-none bg-transparent"
                />
                {isCtaSearching && (
                  <Loader2 className="w-5 h-5 text-emerald-500 animate-spin flex-shrink-0 ml-2" />
                )}
              </div>

              <button
                onClick={() => {
                  if (ctaResults.length > 0) {
                    onSelectAddress(ctaResults[0]);
                  } else if (ctaQuery.trim()) {
                    searchBANAddresses(ctaQuery).then((res) => {
                      if (res.length > 0) onSelectAddress(res[0]);
                    });
                  }
                }}
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-md flex-shrink-0 cursor-pointer"
              >
                <span>Générer le rapport</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* CTA Autocomplete Dropdown */}
            {showCtaDropdown && ctaResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-100 text-left">
                {ctaResults.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectAddress(item);
                      setShowCtaDropdown(false);
                    }}
                    className="w-full p-4 text-left hover:bg-slate-50 transition-colors flex items-center gap-3.5 group"
                  >
                    <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-slate-900">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.context}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Footer Predikt */}
      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
            <div className="space-y-4 md:col-span-1">
              <Logo size="md" variant="light" />
              <p className="text-xs text-slate-400 leading-relaxed">
                Plateforme d'analyse et d'intelligence prédictive sur l'immobilier, les risques et le cadastre en France.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Produit</h4>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#open-data" className="hover:text-white transition-colors">13 Axes Open Data</a></li>
                <li><a href="#dvf" className="hover:text-white transition-colors">Actes DVF Notaires</a></li>
                <li><a href="#dpe" className="hover:text-white transition-colors">DPE ADEME</a></li>
                <li><a href="#forecast" className="hover:text-white transition-colors">Prévisions 1-5 Ans</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Projets</h4>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#habiter" className="hover:text-white transition-colors">Acheter & Habiter</a></li>
                <li><a href="#investir" className="hover:text-white transition-colors">Investissement Locatif</a></li>
                <li><a href="#construire" className="hover:text-white transition-colors">Urbanisme & Permis</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Données Officielles</h4>
              <ul className="space-y-2.5 text-xs">
                <li><span className="text-slate-500">DGFiP (DVF)</span></li>
                <li><span className="text-slate-500">ADEME (DPE)</span></li>
                <li><span className="text-slate-500">Géorisques & ARS</span></li>
                <li><span className="text-slate-500">IGN Cadastre & BAN</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} signalimmo.fr — Analyse Foncier & Données Publiques data.gouv.fr.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-slate-300">Mentions Légales</a>
              <a href="#" className="hover:text-slate-300">Confidentialité</a>
              <a href="#" className="hover:text-slate-300">Open Data</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

