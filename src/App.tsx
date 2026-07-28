import React, { useState, useEffect } from 'react';
import { Logo } from './components/Logo';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
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
import { DatasetElus } from './components/DatasetElus';
import { DatasetCultural } from './components/DatasetCultural';
import { DatasetConnectivity } from './components/DatasetConnectivity';
import { DatasetPriceForecast } from './components/DatasetPriceForecast';
import { DatasetLocalTaxation } from './components/DatasetLocalTaxation';
import { AiSynthesisTab } from './components/AiSynthesisTab';
import { CompareAddressesModal } from './components/CompareAddressesModal';

import { generateReportForAddress } from './services/apiAdresse';
import { AddressSearchResult, ActiveNavTab, PropertyReport } from './types';

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

// Parse address & tab state from URL (e.g., /report?q=15+Rue+de+la+Paix...)
function parseStateFromUrl(): { address: AddressSearchResult | null; tab: ActiveNavTab } {
  if (typeof window === 'undefined') {
    return { address: null, tab: 'search' };
  }

  const pathname = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);

  const isReportPath = pathname.startsWith('/report');
  const q = searchParams.get('q') || searchParams.get('label') || searchParams.get('address');
  const idParam = searchParams.get('id');

  if (!isReportPath && !q && !idParam) {
    return { address: null, tab: 'search' };
  }

  // Check presets by ID
  if (idParam) {
    const presetById = PRESET_SAMPLE_ADDRESSES.find((p) => p.id === idParam);
    if (presetById) {
      const tab = (searchParams.get('tab') as ActiveNavTab) || 'search';
      return { address: presetById, tab };
    }
  }

  // Check presets by Label or Name
  if (q) {
    const presetByLabel = PRESET_SAMPLE_ADDRESSES.find(
      (p) => p.label.toLowerCase() === q.toLowerCase() || p.name.toLowerCase() === q.toLowerCase()
    );
    if (presetByLabel) {
      const tab = (searchParams.get('tab') as ActiveNavTab) || 'search';
      return { address: presetByLabel, tab };
    }
  }

  // Reconstruct address object from URL parameters
  if (q || searchParams.get('lat')) {
    const labelStr = q || 'Adresse Sélectionnée';
    const postcode = searchParams.get('postcode') || (labelStr.match(/\b\d{5}\b/)?.[0] || '75000');
    const city = searchParams.get('city') || labelStr.split(',')[1]?.trim() || '';
    const citycode = searchParams.get('citycode') || '';
    const context = searchParams.get('context') || '';
    const street = searchParams.get('street') || '';
    const housenumber = searchParams.get('housenumber') || '';
    const lat = parseFloat(searchParams.get('lat') || '') || 48.8566;
    const lon = parseFloat(searchParams.get('lon') || '') || 2.3522;
    const tab = (searchParams.get('tab') as ActiveNavTab) || 'search';

    const reconstructed: AddressSearchResult = {
      id: idParam || `addr-url-${encodeURIComponent(labelStr)}`,
      label: labelStr,
      name: labelStr.split(',')[0] || labelStr,
      postcode,
      city,
      citycode,
      context,
      street,
      housenumber,
      lat,
      lon,
    };

    return { address: reconstructed, tab };
  }

  // Fallback for /report route
  if (isReportPath) {
    const tab = (searchParams.get('tab') as ActiveNavTab) || 'search';
    return { address: PRESET_SAMPLE_ADDRESSES[0], tab };
  }

  return { address: null, tab: 'search' };
}

// Build URL from state
function buildUrlFromState(address: AddressSearchResult | null, tab: ActiveNavTab): string {
  if (!address) {
    return '/';
  }

  const params = new URLSearchParams();
  if (address.label) params.set('q', address.label);
  if (address.id) params.set('id', address.id);
  if (address.lat) params.set('lat', address.lat.toString());
  if (address.lon) params.set('lon', address.lon.toString());
  if (address.postcode) params.set('postcode', address.postcode);
  if (address.city) params.set('city', address.city);
  if (address.citycode) params.set('citycode', address.citycode);
  if (address.context) params.set('context', address.context);
  if (address.street) params.set('street', address.street);
  if (address.housenumber) params.set('housenumber', address.housenumber);
  if (tab && tab !== 'search') params.set('tab', tab);

  return `/report?${params.toString()}`;
}

export default function App() {
  const [initialParsed] = useState(() => parseStateFromUrl());
  const [activeTab, setActiveTab] = useState<ActiveNavTab>(initialParsed.tab);
  const [selectedAddress, setSelectedAddress] = useState<AddressSearchResult | null>(initialParsed.address);

  // Sync state to browser URL dynamically
  useEffect(() => {
    const targetUrl = buildUrlFromState(selectedAddress, activeTab);
    const currentUrl = window.location.pathname + window.location.search;

    if (currentUrl !== targetUrl) {
      window.history.pushState({ address: selectedAddress, tab: activeTab }, '', targetUrl);
    }
  }, [selectedAddress, activeTab]);

  // Handle browser Back / Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseStateFromUrl();
      setSelectedAddress(parsed.address);
      setActiveTab(parsed.tab);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Compute property report dynamically if an address is selected
  const currentReport: PropertyReport | null = selectedAddress ? generateReportForAddress(selectedAddress) : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-teal-500 selection:text-white">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedAddress={selectedAddress}
        onSelectAddress={(addr) => setSelectedAddress(addr)}
      />

      {/* Main Container */}
      {!selectedAddress ? (
        <HomePage
          onSelectAddress={(addr) => setSelectedAddress(addr)}
          presetAddresses={PRESET_SAMPLE_ADDRESSES}
        />
      ) : (
        <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-16 sm:pb-20 space-y-6 sm:space-y-8">
          {currentReport && (
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

                  {/* Section 2b: Modèle de Prévision & Projection Prix m2 */}
                  <section id="section-forecast" className="scroll-mt-24">
                    <DatasetPriceForecast projection={currentReport.priceProjection} />
                  </section>

                  {/* Section 2c: Taxe Foncière & Fiscalité Locale (DGFiP REI) */}
                  <section id="section-fiscalite" className="scroll-mt-24">
                    <DatasetLocalTaxation taxation={currentReport.localTaxation} />
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

                  {/* Section 12: Élus & Cadre Politique */}
                  <section id="section-elus" className="scroll-mt-24">
                    <DatasetElus elus={currentReport.elus} />
                  </section>

                  {/* Section 13: Équipements Culturels */}
                  <section id="section-culture" className="scroll-mt-24">
                    <DatasetCultural cultural={currentReport.cultural} />
                  </section>

                  {/* Section 14: Connexion Internet */}
                  <section id="section-internet" className="scroll-mt-24">
                    <DatasetConnectivity connectivity={currentReport.connectivity} />
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
              {activeTab === 'dataset-elus' && (
                <div className="space-y-6">
                  <DatasetElus elus={currentReport.elus} />
                </div>
              )}
              {activeTab === 'dataset-cultural' && (
                <div className="space-y-6">
                  <DatasetCultural cultural={currentReport.cultural} />
                </div>
              )}
              {activeTab === 'dataset-connectivity' && (
                <div className="space-y-6">
                  <DatasetConnectivity connectivity={currentReport.connectivity} />
                </div>
              )}
              {activeTab === 'dataset-forecast' && (
                <div className="space-y-6">
                  <DatasetPriceForecast projection={currentReport.priceProjection} />
                </div>
              )}
              {activeTab === 'dataset-taxation' && (
                <div className="space-y-6">
                  <DatasetLocalTaxation taxation={currentReport.localTaxation} />
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
          )}
        </main>
      )}

      {/* Report View Footer */}
      {selectedAddress && (
        <footer className="border-t border-slate-200 bg-white py-10 text-center text-xs text-slate-500 space-y-2">
          <div className="flex items-center justify-center">
            <button
              onClick={() => {
                setSelectedAddress(null);
                setActiveTab('search');
              }}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              title="Retour à l'accueil"
            >
              <Logo size="sm" />
            </button>
          </div>
          <p className="max-w-2xl mx-auto text-[11px] text-slate-500">
            Analyse foncière multicritère certifiée : Cadastre, Historique des Ventes DVF, Diagnostic Énergétique, Risques Naturels, Démographie et Urbanisme.
          </p>
        </footer>
      )}

    </div>
  );
}
