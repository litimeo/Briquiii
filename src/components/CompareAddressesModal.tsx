import React, { useState, useEffect } from 'react';
import { PropertyReport, AddressSearchResult } from '../types';
import { generateReportForAddress, searchBANAddresses } from '../services/apiAdresse';
import { X, ArrowRightLeft, Search, MapPin, Loader2, Trophy, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

interface CompareAddressesModalProps {
  currentReport: PropertyReport;
  onClose: () => void;
}

export const CompareAddressesModal: React.FC<CompareAddressesModalProps> = ({ currentReport, onClose }) => {
  const [compareQuery, setCompareQuery] = useState('');
  const [compareResults, setCompareResults] = useState<AddressSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [compareAddress, setCompareAddress] = useState<AddressSearchResult | null>(null);

  // Debounced search for compare address
  useEffect(() => {
    if (!compareQuery.trim() || compareQuery.length < 2) {
      setCompareResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const res = await searchBANAddresses(compareQuery);
      setCompareResults(res);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [compareQuery]);

  const compareReport = compareAddress ? generateReportForAddress(compareAddress) : null;

  // Comparison Verdict Calculation
  let winnerText = '';
  let winnerDetails: string[] = [];

  if (compareReport) {
    const scoreDiff = currentReport.briquiaIndexScore - compareReport.briquiaIndexScore;
    if (scoreDiff > 0) {
      winnerText = `🏆 L'Emplacement N°1 (${currentReport.address.city}) surpasse l'Emplacement N°2 de +${scoreDiff} points sur l'Indice Signal Immo.`;
    } else if (scoreDiff < 0) {
      winnerText = `🏆 L'Emplacement N°2 (${compareReport.address.city}) surpasse l'Emplacement N°1 de +${Math.abs(scoreDiff)} points sur l'Indice Signal Immo.`;
    } else {
      winnerText = `⚖️ Les deux emplacements présentent un Indice Signal Immo équivalent (${currentReport.briquiaIndexScore}/100).`;
    }

    // Key Advantage Highlights
    if (currentReport.dpe.energyRating < compareReport.dpe.energyRating) {
      winnerDetails.push(`N°1 a une meilleure performance énergétique (DPE ${currentReport.dpe.energyRating} vs ${compareReport.dpe.energyRating})`);
    } else if (compareReport.dpe.energyRating < currentReport.dpe.energyRating) {
      winnerDetails.push(`N°2 a une meilleure performance énergétique (DPE ${compareReport.dpe.energyRating} vs ${currentReport.dpe.energyRating})`);
    }

    if (currentReport.safetySecurity.securityIndexScore > compareReport.safetySecurity.securityIndexScore + 5) {
      winnerDetails.push(`N°1 offre un niveau de sécurité supérieur (${currentReport.safetySecurity.securityIndexScore} vs ${compareReport.safetySecurity.securityIndexScore}/100)`);
    } else if (compareReport.safetySecurity.securityIndexScore > currentReport.safetySecurity.securityIndexScore + 5) {
      winnerDetails.push(`N°2 offre un niveau de sécurité supérieur (${compareReport.safetySecurity.securityIndexScore} vs ${currentReport.safetySecurity.securityIndexScore}/100)`);
    }

    if (currentReport.insee.medianAnnualIncomeEur > compareReport.insee.medianAnnualIncomeEur + 1500) {
      winnerDetails.push(`N°1 est situé dans une zone au revenu médian plus élevé (+${(currentReport.insee.medianAnnualIncomeEur - compareReport.insee.medianAnnualIncomeEur).toLocaleString('fr-FR')} €/an)`);
    } else if (compareReport.insee.medianAnnualIncomeEur > currentReport.insee.medianAnnualIncomeEur + 1500) {
      winnerDetails.push(`N°2 est situé dans une zone au revenu médian plus élevé (+${(compareReport.insee.medianAnnualIncomeEur - currentReport.insee.medianAnnualIncomeEur).toLocaleString('fr-FR')} €/an)`);
    }

    if (currentReport.georisques.riskScoreNumber > compareReport.georisques.riskScoreNumber) {
      winnerDetails.push(`N°1 présente une meilleure résilience face aux risques naturels (${currentReport.georisques.riskScoreNumber} vs ${compareReport.georisques.riskScoreNumber}/10)`);
    } else if (compareReport.georisques.riskScoreNumber > currentReport.georisques.riskScoreNumber) {
      winnerDetails.push(`N°2 présente une meilleure résilience face aux risques naturels (${compareReport.georisques.riskScoreNumber} vs ${currentReport.georisques.riskScoreNumber}/10)`);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-3xl p-4 sm:p-8 space-y-6 shadow-xl my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Comparateur d'Emplacements Immobiliers</h3>
              <p className="text-xs text-slate-500">Analyse comparative certifiée côte à côte sur 9 axes</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Location Selectors Header Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Location 1 (Current) */}
          <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-200 space-y-1">
            <span className="text-[10px] font-extrabold uppercase text-blue-700 tracking-wider">Emplacement Actuel (N°1)</span>
            <div className="text-sm sm:text-base font-black text-slate-900 line-clamp-1">{currentReport.address.label}</div>
            <div className="text-xs text-slate-600 font-mono flex items-center gap-2">
              <span>Score Signal Immo: <strong className="text-blue-700 font-black text-sm">{currentReport.briquiaIndexScore}/100</strong></span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">{currentReport.ratingLabel}</span>
            </div>
          </div>

          {/* Location 2 (Live Search) */}
          <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200 space-y-2 relative">
            <span className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wider">Rechercher la 2ème Adresse (N°2)</span>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Entrez une 2ème adresse (ex: 10 Place Bellecour Lyon)..."
                value={compareQuery}
                onChange={(e) => setCompareQuery(e.target.value)}
                className="w-full bg-white text-slate-900 text-xs font-bold pl-9 pr-8 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 shadow-2xs"
              />
              {isSearching && (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2" />
              )}
            </div>

            {/* Live Autocomplete Dropdown */}
            {compareResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto divide-y divide-slate-100">
                {compareResults.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCompareAddress(item);
                      setCompareQuery(item.label);
                      setCompareResults([]);
                    }}
                    className="w-full p-2.5 text-left hover:bg-slate-50 transition-colors flex items-center gap-2 group"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">{item.label}</div>
                      <div className="text-[10px] text-slate-500">{item.context}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {compareReport && (
              <div className="text-xs text-slate-600 font-mono flex items-center gap-2">
                <span>Score Signal Immo: <strong className="text-emerald-700 font-black text-sm">{compareReport.briquiaIndexScore}/100</strong></span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">{compareReport.ratingLabel}</span>
              </div>
            )}
          </div>

        </div>

        {/* Executive Verdict Banner if Compare Report is Loaded */}
        {compareReport && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white space-y-2.5 shadow-md">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Synthèse Comparative Signal Immo</span>
            </div>
            <div className="text-sm sm:text-base font-bold leading-snug">{winnerText}</div>
            {winnerDetails.length > 0 && (
              <div className="pt-1 border-t border-slate-700/60 space-y-1">
                {winnerDetails.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Comparison Table */}
        {compareReport ? (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-black">
                  <th className="py-3.5 px-4">Indicateur Foncier & Environnemental</th>
                  <th className="py-3.5 px-4 text-blue-700">Emplacement N°1</th>
                  <th className="py-3.5 px-4 text-emerald-800">Emplacement N°2</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                
                {/* Score Row */}
                <tr className="bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    Indice Foncier Signal Immo (0-100)
                  </td>
                  <td className="py-3.5 px-4 font-black text-blue-700 text-sm">
                    {currentReport.briquiaIndexScore} / 100
                    {currentReport.briquiaIndexScore > compareReport.briquiaIndexScore && (
                      <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        <Sparkles className="w-3 h-3" /> Avantage N°1
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-black text-emerald-800 text-sm">
                    {compareReport.briquiaIndexScore} / 100
                    {compareReport.briquiaIndexScore > currentReport.briquiaIndexScore && (
                      <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        <Sparkles className="w-3 h-3" /> Avantage N°2
                      </span>
                    )}
                  </td>
                </tr>

                {/* Price / m2 */}
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-700">
                    Prix Médian au m² (DVF Notaires)
                  </td>
                  <td className="py-3.5 px-4 font-black text-slate-900">
                    {currentReport.dvf.medianPricePerM2Street.toLocaleString('fr-FR')} €/m²
                  </td>
                  <td className="py-3.5 px-4 font-black text-slate-900">
                    {compareReport.dvf.medianPricePerM2Street.toLocaleString('fr-FR')} €/m²
                  </td>
                </tr>

                {/* 5Y Growth */}
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-700">
                    Croissance Prix 5 ans (DVF)
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">
                    +{currentReport.dvf.fiveYearPriceGrowthPercent}% / an
                    {currentReport.dvf.fiveYearPriceGrowthPercent > compareReport.dvf.fiveYearPriceGrowthPercent && (
                      <span className="ml-2 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded">Plus dynamique</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">
                    +{compareReport.dvf.fiveYearPriceGrowthPercent}% / an
                    {compareReport.dvf.fiveYearPriceGrowthPercent > currentReport.dvf.fiveYearPriceGrowthPercent && (
                      <span className="ml-2 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded">Plus dynamique</span>
                    )}
                  </td>
                </tr>

                {/* DPE Energy Rating */}
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-700">
                    Diagnostic Énergétique (ADEME DPE)
                  </td>
                  <td className="py-3.5 px-4 font-bold text-amber-800">
                    Classe {currentReport.dpe.energyRating} ({currentReport.dpe.consumptionKwhM2Year} kWh/m²/an)
                    {currentReport.dpe.energyRating < compareReport.dpe.energyRating && (
                      <span className="ml-2 text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">Moins énergivore</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-amber-800">
                    Classe {compareReport.dpe.energyRating} ({compareReport.dpe.consumptionKwhM2Year} kWh/m²/an)
                    {compareReport.dpe.energyRating < currentReport.dpe.energyRating && (
                      <span className="ml-2 text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">Moins énergivore</span>
                    )}
                  </td>
                </tr>

                {/* Passoire Thermique */}
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-700">
                    Statut Passoire Thermique
                  </td>
                  <td className="py-3.5 px-4 font-bold">
                    {currentReport.dpe.isPassoireThermique ? (
                      <span className="text-rose-600 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Oui (Risque location)</span>
                    ) : (
                      <span className="text-emerald-700 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Non (Conforme)</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-bold">
                    {compareReport.dpe.isPassoireThermique ? (
                      <span className="text-rose-600 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Oui (Risque location)</span>
                    ) : (
                      <span className="text-emerald-700 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Non (Conforme)</span>
                    )}
                  </td>
                </tr>

                {/* Géorisques Overall */}
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-700">
                    Niveau de Résilience Risques (Géorisques)
                  </td>
                  <td className="py-3.5 px-4 font-bold text-rose-800">
                    Note {currentReport.georisques.riskScoreNumber}/10 ({currentReport.georisques.overallRiskLevel})
                    {currentReport.georisques.riskScoreNumber > compareReport.georisques.riskScoreNumber && (
                      <span className="ml-2 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded">Moins exposé</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-rose-800">
                    Note {compareReport.georisques.riskScoreNumber}/10 ({compareReport.georisques.overallRiskLevel})
                    {compareReport.georisques.riskScoreNumber > currentReport.georisques.riskScoreNumber && (
                      <span className="ml-2 text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded">Moins exposé</span>
                    )}
                  </td>
                </tr>

                {/* INSEE Median Income */}
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-700">
                    Revenu Médian Foyer (INSEE)
                  </td>
                  <td className="py-3.5 px-4 font-bold text-purple-700">
                    {currentReport.insee.medianAnnualIncomeEur.toLocaleString('fr-FR')} €/an
                    {currentReport.insee.medianAnnualIncomeEur > compareReport.insee.medianAnnualIncomeEur && (
                      <span className="ml-2 text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200 px-1.5 py-0.5 rounded">Zone plus aisée</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-purple-700">
                    {compareReport.insee.medianAnnualIncomeEur.toLocaleString('fr-FR')} €/an
                    {compareReport.insee.medianAnnualIncomeEur > currentReport.insee.medianAnnualIncomeEur && (
                      <span className="ml-2 text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200 px-1.5 py-0.5 rounded">Zone plus aisée</span>
                    )}
                  </td>
                </tr>

                {/* PLU WalkScore */}
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-700">
                    Marchabilité & Services (WalkScore)
                  </td>
                  <td className="py-3.5 px-4 font-bold text-teal-700">
                    {currentReport.pluAmenities.walkScore} / 100
                    {currentReport.pluAmenities.walkScore > compareReport.pluAmenities.walkScore && (
                      <span className="ml-2 text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 px-1.5 py-0.5 rounded">Plus accessible</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-teal-700">
                    {compareReport.pluAmenities.walkScore} / 100
                    {compareReport.pluAmenities.walkScore > currentReport.pluAmenities.walkScore && (
                      <span className="ml-2 text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 px-1.5 py-0.5 rounded">Plus accessible</span>
                    )}
                  </td>
                </tr>

                {/* Rental Market */}
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-700">
                    Loyer Médian Apt & Rendement Brut (Carte Loyers)
                  </td>
                  <td className="py-3.5 px-4 font-bold text-cyan-700">
                    {currentReport.rentalMarket.avgRentApartmentPerM2} €/m² ({currentReport.rentalMarket.estimatedGrossYieldPercent}% rendement)
                  </td>
                  <td className="py-3.5 px-4 font-bold text-cyan-700">
                    {compareReport.rentalMarket.avgRentApartmentPerM2} €/m² ({compareReport.rentalMarket.estimatedGrossYieldPercent}% rendement)
                  </td>
                </tr>

                {/* Water Quality */}
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-700">
                    Qualité Eau Potable (Conformité ARS)
                  </td>
                  <td className="py-3.5 px-4 font-bold text-sky-700">
                    {currentReport.waterQuality.complianceBacterialPercent}% conformité
                  </td>
                  <td className="py-3.5 px-4 font-bold text-sky-700">
                    {compareReport.waterQuality.complianceBacterialPercent}% conformité
                  </td>
                </tr>

                {/* Safety & Security */}
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-700">
                    Indice de Sérénité & Sécurité (SSMSI)
                  </td>
                  <td className="py-3.5 px-4 font-bold text-indigo-700">
                    {currentReport.safetySecurity.securityIndexScore} / 100
                    {currentReport.safetySecurity.securityIndexScore > compareReport.safetySecurity.securityIndexScore && (
                      <span className="ml-2 text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 px-1.5 py-0.5 rounded">Plus serein</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-indigo-700">
                    {compareReport.safetySecurity.securityIndexScore} / 100
                    {compareReport.safetySecurity.securityIndexScore > currentReport.safetySecurity.securityIndexScore && (
                      <span className="ml-2 text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 px-1.5 py-0.5 rounded">Plus serein</span>
                    )}
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <Search className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-700">Saisissez une 2ème adresse ci-dessus pour lancer la comparaison</p>
            <p className="text-xs text-slate-500">
              Le rapport comparatif évaluera immédiatement les deux emplacements sur les 9 axes fonciers.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};


