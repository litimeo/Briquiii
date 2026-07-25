import React from 'react';
import { DPEData } from '../types';
import { Zap, Flame, AlertTriangle, CheckCircle2, ShieldAlert, Thermometer, ExternalLink, Calculator, PiggyBank, Car, Home, ShieldCheck } from 'lucide-react';

interface DatasetDPEProps {
  dpe: DPEData;
}

export const DatasetDPE: React.FC<DatasetDPEProps> = ({ dpe }) => {
  const ratings: Array<'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'> = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  const getDpeColor = (r: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G') => {
    switch (r) {
      case 'A': return 'bg-emerald-600 text-white border-emerald-400';
      case 'B': return 'bg-emerald-500 text-slate-950 border-emerald-300';
      case 'C': return 'bg-lime-500 text-slate-950 border-lime-300';
      case 'D': return 'bg-amber-400 text-slate-950 border-amber-200';
      case 'E': return 'bg-amber-600 text-white border-amber-400';
      case 'F': return 'bg-rose-500 text-white border-rose-300';
      case 'G': return 'bg-red-700 text-white border-red-500';
    }
  };

  const monthlyMin = dpe.estimatedMonthlyCostMin ?? Math.round(dpe.estimatedAnnualCostMin / 12);
  const monthlyMax = dpe.estimatedMonthlyCostMax ?? Math.round(dpe.estimatedAnnualCostMax / 12);
  const renovationBudget = dpe.recommendedRenovationBudget ?? (dpe.isPassoireThermique ? 31500 : 8400);
  const grantEstimate = dpe.maPrimeRenovGrantEstimate ?? (dpe.isPassoireThermique ? 12600 : 2800);
  const carKmEquivalent = dpe.co2EquivalentCarKm ?? Math.round(dpe.co2EmissionsKgM2Year * 70 * 8.2);
  const thermalLoss = dpe.thermalLossBreakdown ?? (dpe.energyRating <= 'C' ? { roof: 15, walls: 20, windows: 15, ventilation: 20 } : { roof: 30, walls: 25, windows: 20, ventilation: 15 });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-amber-50/50 p-6 sm:p-7 rounded-3xl border border-amber-100/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-800 border border-amber-200 flex items-center justify-center font-bold shadow-xs flex-shrink-0">
            <Zap className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">Performance Énergétique & DPE</h2>
              <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-200/90">
                Bilan DPE Certifié ADEME
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">Évaluations énergétiques certifiées, projection des charges de chauffage et plan MaPrimeRénov'.</p>
          </div>
        </div>

        <div className="px-4 py-2.5 rounded-xl bg-white text-amber-900 text-xs sm:text-sm font-bold border border-amber-200 flex items-center gap-2 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>Dispositif France Rénov'</span>
        </div>
      </div>

      {/* Passoire Thermique Regulatory Warning Banner if F or G */}
      {dpe.isPassoireThermique && (
        <div className="bg-rose-50 border border-rose-200/90 p-5 sm:p-6 rounded-3xl shadow-sm flex items-start gap-4 text-rose-950">
          <ShieldAlert className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-extrabold text-rose-900 uppercase tracking-wider text-sm font-heading">
              Alerte Passoire Thermique (Loi Climat & Résilience)
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed text-rose-900">
              Ce logement est classé en <strong className="text-slate-950 underline font-bold">Classe {dpe.energyRating}</strong>. Selon la réglementation française, il est soumis au gel des loyers et aux interdictions progressives de mise en location ({dpe.rentalBanDate}).
            </p>
          </div>
        </div>
      )}

      {/* Main DPE Scale & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* DPE Energy Rating Scale Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wider font-heading">Consommation Énergétique Primaire</h3>
            <span className="text-xs sm:text-sm font-mono font-bold text-amber-900">{dpe.consumptionKwhM2Year} kWh/m²/an</span>
          </div>

          {/* Scale Bars */}
          <div className="space-y-2.5 pt-2">
            {ratings.map((r) => {
              const isCurrent = dpe.energyRating === r;
              return (
                <div key={r} className="flex items-center gap-3">
                  <div className={`h-9 rounded-xl font-extrabold text-xs sm:text-sm px-3.5 flex items-center justify-between transition-all ${getDpeColor(r)} ${isCurrent ? 'w-full ring-2 ring-slate-900 shadow-md scale-[1.02]' : 'w-4/5 opacity-40'}`}>
                    <span>Classe {r}</span>
                    {isCurrent && <span className="font-bold font-mono">{dpe.consumptionKwhM2Year} kWh/m²/an</span>}
                  </div>
                  {isCurrent && <span className="text-xs sm:text-sm font-extrabold text-slate-900 whitespace-nowrap">← Votre Logement</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Climate GHG Scale & Energy Cost */}
        <div className="space-y-6">
          
          {/* Estimated Energy Bill */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Facture Énergétique Estimée</span>
              <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-md">
                ~{monthlyMin}€ à {monthlyMax}€ / mois
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-900 font-heading">
              {dpe.estimatedAnnualCostMin.toLocaleString('fr-FR')} € - {dpe.estimatedAnnualCostMax.toLocaleString('fr-FR')} € / an
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Estimation basée sur un usage standard des équipements de chauffage, eau chaude sanitaire et éclairage (tarifs réglementés 2024).
            </p>
          </div>

          {/* Heating & Insulation Specs */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wider font-heading">Équipements & Isolation</h3>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Mode de Chauffage:</span>
                <strong className="text-slate-900 text-right font-bold">{dpe.heatingType}</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Eau Chaude Sanitaire:</span>
                <strong className="text-slate-900 text-right font-bold">{dpe.waterHeatingType}</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Isolation des Murs:</span>
                <strong className="text-amber-800 font-bold">{dpe.insulationQuality.walls}</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Isolation Toiture:</span>
                <strong className="text-amber-800 font-bold">{dpe.insulationQuality.roof}</strong>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500 font-medium">Menuiseries & Vitrage:</span>
                <strong className="text-emerald-800 font-bold">{dpe.insulationQuality.windows}</strong>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Extended Renovation, Grant Estimates & Carbon Footprint Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Recommended Renovation Budget */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
            <Calculator className="w-4 h-4" />
            <span>Budget Rénovation Énergétique</span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-heading">
            ~{renovationBudget.toLocaleString('fr-FR')} €
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Estimation des travaux pour passer de la classe DPE actuelle à une classe B ou C (isolation, pompe à chaleur, VMC double flux).
          </p>
        </div>

        {/* Subsidies MaPrimeRénov */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <PiggyBank className="w-4 h-4" />
            <span>Estimation Subventions MaPrimeRénov'</span>
          </div>
          <div className="text-2xl font-black text-emerald-800 font-heading">
            jusqu'à {grantEstimate.toLocaleString('fr-FR')} €
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Financements publics cumulables (Anah + CEE) accessibles selon les barèmes de revenus pour le parcours accompagné.
          </p>
        </div>

        {/* Carbon Impact Equivalent */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
            <Car className="w-4 h-4" />
            <span>Impact Émissions CO₂ Logement</span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-heading">
            {dpe.co2EmissionsKgM2Year} kg/m²/an
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Équivalent à l'empreinte carbone d'environ <strong className="text-slate-900 font-bold">{carKmEquivalent.toLocaleString('fr-FR')} km</strong> parcourus en voiture thermique chaque année.
          </p>
        </div>

      </div>

      {/* Thermal Loss Distribution Diagram */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">Répartition des Déperditions Thermiques Estimées</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 text-center">
            <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Toiture & Combles</span>
            <span className="text-2xl font-extrabold text-amber-900 font-heading">{thermalLoss.roof}%</span>
            <span className="text-[11px] text-slate-500 block mt-1">1er poste de déperdition</span>
          </div>
          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 text-center">
            <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Murs Extérieurs</span>
            <span className="text-2xl font-extrabold text-amber-900 font-heading">{thermalLoss.walls}%</span>
            <span className="text-[11px] text-slate-500 block mt-1">Façade & pignons</span>
          </div>
          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 text-center">
            <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Fenêtres & Portes</span>
            <span className="text-2xl font-extrabold text-amber-900 font-heading">{thermalLoss.windows}%</span>
            <span className="text-[11px] text-slate-500 block mt-1">Vitrage & ponts thermiques</span>
          </div>
          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 text-center">
            <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Renouvellement d'Air</span>
            <span className="text-2xl font-extrabold text-amber-900 font-heading">{thermalLoss.ventilation}%</span>
            <span className="text-[11px] text-slate-500 block mt-1">Ventilation VMC</span>
          </div>
        </div>
      </div>

    </div>
  );
};

