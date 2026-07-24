import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { AddressHeaderCard } from './components/AddressHeaderCard';
import { DatasetBAN } from './components/DatasetBAN';
import { DatasetDVF } from './components/DatasetDVF';
import { DatasetDPE } from './components/DatasetDPE';
import { DatasetGeorisques } from './components/DatasetGeorisques';
import { DatasetINSEE } from './components/DatasetINSEE';
import { DatasetPLU } from './components/DatasetPLU';
import { DatasetRentalMarket } from './components/DatasetRentalMarket';
import { DatasetWaterQuality } from './components/DatasetWaterQuality';
import { DatasetSafetySecurity } from './components/DatasetSafetySecurity';
import { DatasetQualityOfLife } from './components/DatasetQualityOfLife';
import { DatasetConstructionPermits } from './components/DatasetConstructionPermits';
import { AiSynthesisTab } from './components/AiSynthesisTab';
import { CompareAddressesModal } from './components/CompareAddressesModal';

import { generateReportForAddress, searchBANAddresses } from './services/apiAdresse';
import { AddressSearchResult, ActiveNavTab, PropertyReport } from './types';

import { Database, Search, MapPin, Building2, TrendingUp, Zap, ShieldAlert, Users, Compass, Loader2, ArrowRight, Sparkles, Home, Droplets, ShieldCheck, Footprints, HardHat } from 'lucide-react';

// Preset Sample Addresses for 1-Click Instant Analysis
const PRESET_SAMPLE_ADDRESSES: AddressSearchResult[] = [
  {
    id: 'preset-paris',
    label: '15 Rue de la Paix, 75002 Paris',
    name: '15 Rue de la Paix',
    postcode: '75002',
    city: 'Paris',
    citycode: '75102',
    context: '75, Paris, Île-de-France',
    street: 'Rue de la Paix',
    housenumber: '15',
    lat: 48.8692,
    lon: 2.3312,
  },
  {
    id: 'preset-lyon',
    label: '1 Place Bellecour, 69002 Lyon',
    name: '1 Place Bellecour',
    postcode: '69002',
    city: 'Lyon',
    citycode: '69382',
    context: '69, Rhône, Auvergne-Rhône-Alpes',
    street: 'Place Bellecour',
    housenumber: '1',
    lat: 45.7578,
    lon: 4.8320,
  },
  {
    id: 'preset-marseille',
    label: '10 Quai des Belges, 13001 Marseille',
    name: '10 Quai des Belges',
    postcode: '13001',
    city: 'Marseille',
    citycode: '13201',
    context: '13, Bouches-du-Rhône, PACA',
    street: 'Quai des Belges',
    housenumber: '10',
    lat: 43.2952,
    lon: 5.3744,
  },
  {
    id: 'preset-bordeaux',
    label: '5 Place de la Comédie, 33000 Bordeaux',
    name: '5 Place de la Comédie',
    postcode: '33000',
    city: 'Bordeaux',
    citycode: '33063',
    context: '33, Gironde, Nouvelle-Aquitaine',
    street: 'Place de la Comédie',
    housenumber: '5',
    lat: 44.8427,
    lon: -0.5750,
  },
  {
    id: 'preset-toulouse',
    label: '2 Place du Capitole, 31000 Toulouse',
    name: '2 Place du Capitole',
    postcode: '31000',
    city: 'Toulouse',
    citycode: '31555',
    context: '31, Haute-Garonne, Occitanie',
    street: 'Place du Capitole',
    housenumber: '2',
    lat: 43.6045,
    lon: 1.4442,
  },
  {
    id: 'preset-nice',
    label: '1 Promenade des Anglais, 06000 Nice',
    name: '1 Promenade des Anglais',
    postcode: '06000',
    city: 'Nice',
    citycode: '06088',
    context: '06, Alpes-Maritimes, PACA',
    street: 'Promenade des Anglais',
    housenumber: '1',
    lat: 43.6951,
    lon: 7.2653,
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('search');
  const [selectedAddress, setSelectedAddress] = useState<AddressSearchResult | null>(null);

  // Hero Search State
  const [heroQuery, setHeroQuery] = useState('');
  const [heroResults, setHeroResults] = useState<AddressSearchResult[]>([]);
  const [isHeroSearching, setIsHeroSearching] = useState(false);
  const heroSearchRef = useRef<HTMLDivElement>(null);

  // Debounced search for hero input
  useEffect(() => {
    if (!heroQuery.trim() || heroQuery.length < 2) {
      setHeroResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsHeroSearching(true);
      const res = await searchBANAddresses(heroQuery);
      setHeroResults(res);
      setIsHeroSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [heroQuery]);

  // Compute property report dynamically if an address is selected
  const currentReport: PropertyReport | null = selectedAddress ? generateReportForAddress(selectedAddress) : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedAddress={selectedAddress}
        onSelectAddress={(addr) => setSelectedAddress(addr)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 space-y-8">
        
        {/* IF NO ADDRESS SELECTED: HERO LIVE SEARCH INTERFACE */}
        {!selectedAddress ? (
          <div className="py-10 md:py-16 max-w-4xl mx-auto space-y-12">
            
            {/* Hero Heading Banner */}
            <div className="text-center space-y-5">
              <div className="stand">
                <span className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 text-orange-950 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                  <Database className="w-4 h-4 text-[#f56902]" />
                  <span>Plateforme d'Audit Foncier Open Data 9 Axes</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight font-heading leading-tight">
                Entrez une adresse pour générer son <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f56902] via-orange-600 to-amber-600">rapport d'audit complet</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
                Briquia croise en direct <strong className="text-slate-900 font-bold">9 axes d'analyses foncières certifiées</strong> (Cadastre, Prix & Transactions DVF, Marché Locatif, Performance Énergétique, Eau ARS, Risques Naturels, Sécurité SSMSI, Démographie et Urbanisme).
              </p>
            </div>

            {/* Central Live Search Box */}
            <div ref={heroSearchRef} className="relative max-w-2xl mx-auto">
              <div className="relative">
                <Search className="w-5 h-5 text-[#f56902] absolute left-5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Saisissez une adresse exacte ou une ville (ex: 15 Rue de la Paix Paris)..."
                  value={heroQuery}
                  onChange={(e) => setHeroQuery(e.target.value)}
                  className="w-full bg-white text-slate-900 placeholder-slate-400 text-sm sm:text-base pl-14 pr-16 py-4 sm:py-5 rounded-3xl border-2 border-slate-200/90 focus:border-[#f56902] focus:ring-4 focus:ring-orange-100/80 focus:outline-none shadow-xl font-medium transition-all"
                />
                {isHeroSearching && (
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#f56902]">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                )}
              </div>

              {/* Live Search Results Dropdown */}
              {heroResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-100">
                  <div className="px-4 py-3 bg-slate-50/90 text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>Adresses Suggérées</span>
                    <span className="text-[#f56902] font-mono font-bold">{heroResults.length} résultats</span>
                  </div>

                  {heroResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedAddress(item);
                        setActiveTab('search');
                      }}
                      className="w-full p-4 text-left hover:bg-orange-50/70 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-9 h-9 rounded-2xl bg-orange-100 text-[#f56902] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <MapPin className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 group-hover:text-[#f56902]">{item.label}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{item.context}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#f56902] transition-colors" />
                    </button>
                  ))}
                </div>
              )}

              {/* Instant 1-Click Preset Suggestions Chips */}
              <div className="space-y-3 mt-8">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block text-center font-heading">
                  Adresses Prêtes à Tester (Accès Instantané)
                </span>
                <div className="flex items-center justify-center gap-2.5 text-xs flex-wrap">
                  {PRESET_SAMPLE_ADDRESSES.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setSelectedAddress(preset);
                        setActiveTab('search');
                      }}
                      className="px-4 py-2.5 rounded-2xl bg-white hover:bg-orange-50/80 border border-slate-200/90 hover:border-orange-300 text-slate-800 hover:text-[#f56902] transition-all flex items-center gap-2 font-bold group shadow-xs hover:shadow-md hover:-translate-y-0.5"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#f56902] group-hover:scale-110 transition-transform" />
                      <span>{preset.city} ({preset.postcode})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 9 Integrated Property Axes + Extensibility Showcase */}
            <div className="space-y-6 pt-6">
              <div className="flex items-center justify-between border-b border-slate-200/90 pb-3.5">
                <h3 className="text-xs sm:text-sm font-extrabold uppercase text-slate-500 tracking-wider font-heading">
                  Les 9 Axes d'Analyse Foncière Intégrés
                </h3>
                <span className="text-xs text-emerald-800 font-bold bg-emerald-50 border border-emerald-200/90 px-3 py-1 rounded-full shadow-2xs">
                  Rapport Unifié Certifié
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
                <div className="card-glow p-5 sm:p-6 rounded-3xl space-y-2">
                  <div className="flex items-center gap-3 text-blue-800 font-extrabold text-sm sm:text-base font-heading">
                    <div className="w-9 h-9 rounded-2xl bg-blue-100/80 text-blue-700 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-4.5 h-4.5" />
                    </div>
                    <span>1. Cadastre & Parcelle</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">Identifiant parcellaire, coordonnées géodésiques, emprise au sol et superficie du terrain.</p>
                </div>

                <div className="card-glow p-5 sm:p-6 rounded-3xl space-y-2">
                  <div className="flex items-center gap-3 text-emerald-800 font-extrabold text-sm sm:text-base font-heading">
                    <div className="w-9 h-9 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4.5 h-4.5" />
                    </div>
                    <span>2. Prix & Transactions (DVF)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">Transactions notariées réelles, prix médian au m² et historique d'évolution de la valeur foncière.</p>
                </div>

                <div className="card-glow p-5 sm:p-6 rounded-3xl space-y-2">
                  <div className="flex items-center gap-3 text-cyan-800 font-extrabold text-sm sm:text-base font-heading">
                    <div className="w-9 h-9 rounded-2xl bg-cyan-100/80 text-cyan-700 flex items-center justify-center flex-shrink-0">
                      <Home className="w-4.5 h-4.5" />
                    </div>
                    <span>3. Carte des Loyers & Rendement</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">Loyer d'annonce moyen au m², tension locative et estimation du rendement brut locatif.</p>
                </div>

                <div className="card-glow p-5 sm:p-6 rounded-3xl space-y-2">
                  <div className="flex items-center gap-3 text-amber-900 font-extrabold text-sm sm:text-base font-heading">
                    <div className="w-9 h-9 rounded-2xl bg-amber-100/80 text-amber-700 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4.5 h-4.5" />
                    </div>
                    <span>4. Performance Énergétique (DPE)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">Diagnostic de performance énergétique, émissions de CO2 et calendrier des passoires thermiques.</p>
                </div>

                <div className="card-glow p-5 sm:p-6 rounded-3xl space-y-2">
                  <div className="flex items-center gap-3 text-sky-800 font-extrabold text-sm sm:text-base font-heading">
                    <div className="w-9 h-9 rounded-2xl bg-sky-100/80 text-sky-700 flex items-center justify-center flex-shrink-0">
                      <Droplets className="w-4.5 h-4.5" />
                    </div>
                    <span>5. Qualité Eau Potable (ARS)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">Analyses bactériologiques et physico-chimiques ARS, nitrates, dureté et conformité eau.</p>
                </div>

                <div className="card-glow p-5 sm:p-6 rounded-3xl space-y-2">
                  <div className="flex items-center gap-3 text-rose-800 font-extrabold text-sm sm:text-base font-heading">
                    <div className="w-9 h-9 rounded-2xl bg-rose-100/80 text-rose-700 flex items-center justify-center flex-shrink-0">
                      <ShieldAlert className="w-4.5 h-4.5" />
                    </div>
                    <span>6. Géorisques & Environnement</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">Aléas inondation, retrait-gonflement des argiles, sismicité et cartographie réglementaire.</p>
                </div>

                <div className="card-glow p-5 sm:p-6 rounded-3xl space-y-2">
                  <div className="flex items-center gap-3 text-indigo-800 font-extrabold text-sm sm:text-base font-heading">
                    <div className="w-9 h-9 rounded-2xl bg-indigo-100/80 text-indigo-700 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-4.5 h-4.5" />
                    </div>
                    <span>7. Sécurité & Délinquance (SSMSI)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">Actes enregistrés par la Police et la Gendarmerie (cambriolages, dégradations) et indice de sérénité.</p>
                </div>

                <div className="card-glow p-5 sm:p-6 rounded-3xl space-y-2">
                  <div className="flex items-center gap-3 text-purple-800 font-extrabold text-sm sm:text-base font-heading">
                    <div className="w-9 h-9 rounded-2xl bg-purple-100/80 text-purple-700 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4.5 h-4.5" />
                    </div>
                    <span>8. Démographie & Revenus (INSEE)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">Revenu annuel médian par ménage, taux de propriétaires et profil socio-économique.</p>
                </div>

                <div className="card-glow p-5 sm:p-6 rounded-3xl space-y-2">
                  <div className="flex items-center gap-3 text-teal-800 font-extrabold text-sm sm:text-base font-heading">
                    <div className="w-9 h-9 rounded-2xl bg-teal-100/80 text-teal-700 flex items-center justify-center flex-shrink-0">
                      <Compass className="w-4.5 h-4.5" />
                    </div>
                    <span>9. Urbanisme & Transports (PLU)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">Zonage d'urbanisme, hauteur maximale autorisée, WalkScore et proximité des services.</p>
                </div>
              </div>

              {/* End of 9 Axes Grid */}
            </div>

          </div>
        ) : (
          /* IF ADDRESS IS SELECTED: FULL REPORT VIEW IN SECTIONS */
          currentReport && (
            <>
              {/* Top Aggregated Address Summary Header Card */}
              <AddressHeaderCard
                report={currentReport}
                onOpenAiSynthesis={() => setActiveTab('ai-synthesis')}
                onResetAddress={() => setSelectedAddress(null)}
              />

              {/* FULL REPORT IN SECTIONS */}
              {activeTab === 'search' && (
                <div className="space-y-12">
                  
                  {/* Section 1: Cadastre & Identifiants Fonciers */}
                  <section id="section-cadastre" className="scroll-mt-24">
                    <DatasetBAN ban={currentReport.ban} />
                  </section>

                  {/* Section 2: Transactions & Prix */}
                  <section id="section-prix" className="scroll-mt-24">
                    <DatasetDVF dvf={currentReport.dvf} />
                  </section>

                  {/* Section 3: Carte des Loyers & Marché Locatif */}
                  <section id="section-loyers" className="scroll-mt-24">
                    <DatasetRentalMarket rentalMarket={currentReport.rentalMarket} />
                  </section>

                  {/* Section 4: Performance Énergétique */}
                  <section id="section-energie" className="scroll-mt-24">
                    <DatasetDPE dpe={currentReport.dpe} />
                  </section>

                  {/* Section 5: Qualité de l'Eau Potable */}
                  <section id="section-eau" className="scroll-mt-24">
                    <DatasetWaterQuality waterQuality={currentReport.waterQuality} />
                  </section>

                  {/* Section 6: Risques Naturels & Environnement */}
                  <section id="section-risques" className="scroll-mt-24">
                    <DatasetGeorisques georisques={currentReport.georisques} />
                  </section>

                  {/* Section 7: Sécurité & Délinquance */}
                  <section id="section-securite" className="scroll-mt-24">
                    <DatasetSafetySecurity safetySecurity={currentReport.safetySecurity} />
                  </section>

                  {/* Section 8: Socio-Démographie */}
                  <section id="section-demographie" className="scroll-mt-24">
                    <DatasetINSEE insee={currentReport.insee} />
                  </section>

                  {/* Section 9: Urbanisme & Transports */}
                  <section id="section-urbanisme" className="scroll-mt-24">
                    <DatasetPLU plu={currentReport.pluAmenities} />
                  </section>

                  {/* Section 10: Qualité de Vie */}
                  <section id="section-qualite-vie" className="scroll-mt-24">
                    <DatasetQualityOfLife qualityOfLife={currentReport.qualityOfLife} />
                  </section>

                  {/* Section 11: Permis de Construire */}
                  <section id="section-permis" className="scroll-mt-24">
                    <DatasetConstructionPermits constructionPermits={currentReport.constructionPermits} />
                  </section>

                </div>
              )}

              {/* INDIVIDUAL DIRECT SECTION VIEWS IF SELECTED VIA NAV */}
              {activeTab === 'dataset-ban' && (
                <div className="space-y-6">
                  <DatasetBAN ban={currentReport.ban} />
                </div>
              )}
              {activeTab === 'dataset-dvf' && (
                <div className="space-y-6">
                  <DatasetDVF dvf={currentReport.dvf} />
                </div>
              )}
              {activeTab === 'dataset-rental' && (
                <div className="space-y-6">
                  <DatasetRentalMarket rentalMarket={currentReport.rentalMarket} />
                </div>
              )}
              {activeTab === 'dataset-dpe' && (
                <div className="space-y-6">
                  <DatasetDPE dpe={currentReport.dpe} />
                </div>
              )}
              {activeTab === 'dataset-water' && (
                <div className="space-y-6">
                  <DatasetWaterQuality waterQuality={currentReport.waterQuality} />
                </div>
              )}
              {activeTab === 'dataset-georisques' && (
                <div className="space-y-6">
                  <DatasetGeorisques georisques={currentReport.georisques} />
                </div>
              )}
              {activeTab === 'dataset-safety' && (
                <div className="space-y-6">
                  <DatasetSafetySecurity safetySecurity={currentReport.safetySecurity} />
                </div>
              )}
              {activeTab === 'dataset-insee' && (
                <div className="space-y-6">
                  <DatasetINSEE insee={currentReport.insee} />
                </div>
              )}
              {activeTab === 'dataset-plu' && (
                <div className="space-y-6">
                  <DatasetPLU plu={currentReport.pluAmenities} />
                </div>
              )}
              {activeTab === 'dataset-quality' && (
                <div className="space-y-6">
                  <DatasetQualityOfLife qualityOfLife={currentReport.qualityOfLife} />
                </div>
              )}
              {activeTab === 'dataset-permits' && (
                <div className="space-y-6">
                  <DatasetConstructionPermits constructionPermits={currentReport.constructionPermits} />
                </div>
              )}

              {/* AI SYNTHESIS TAB */}
              {activeTab === 'ai-synthesis' && <AiSynthesisTab report={currentReport} />}

              {/* LOCATION COMPARISON MODAL */}
              {activeTab === 'compare' && (
                <CompareAddressesModal
                  currentReport={currentReport}
                  onClose={() => setActiveTab('search')}
                />
              )}
            </>
          )
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-10 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-2 font-bold text-slate-800 text-sm">
          <Database className="w-4 h-4 text-blue-600" />
          <span>Briquia.fr — Audit Foncier & Intelligence Territoriale</span>
        </div>
        <p className="max-w-2xl mx-auto text-[11px] text-slate-500">
          Analyse foncière multicritère certifiée: Cadastre, Historique des Ventes, Diagnostic Énergétique, Risques Naturels, Démographie et Urbanisme.
        </p>
      </footer>

    </div>
  );
}

