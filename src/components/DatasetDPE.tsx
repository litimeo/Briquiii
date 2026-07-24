import React from 'react';
import { DPEData } from '../types';
import { Zap, Flame, AlertTriangle, CheckCircle2, ShieldAlert, Thermometer, ExternalLink } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold shadow-xs">
            <Zap className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">Section 3: Performance Énergétique & Bilan Thermique</h2>
              <span className="bg-amber-50 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                Bilan DPE Certifié
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">Évaluations énergétiques certifiées et estimation des coûts de chauffage.</p>
          </div>
        </div>
      </div>

      {/* Passoire Thermique Regulatory Warning Banner if F or G */}
      {dpe.isPassoireThermique && (
        <div className="bg-rose-50 border border-rose-200 p-5 rounded-3xl shadow-sm flex items-start gap-4 text-xs text-rose-900">
          <ShieldAlert className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-black text-rose-800 uppercase tracking-wider text-sm">
              Alerte Passoire Thermique (Loi Climat & Résilience)
            </h4>
            <p className="leading-relaxed">
              Ce logement est classé en <strong className="text-slate-900 underline">Classe {dpe.energyRating}</strong>. Selon la réglementation française, il est soumis aux gel des loyers et aux interdictions progressives de mise en location ({dpe.rentalBanDate}).
            </p>
          </div>
        </div>
      )}

      {/* Main DPE Scale & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* DPE Energy Rating Scale Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Consommation Énergétique Primaire</h3>
            <span className="text-xs font-mono font-bold text-amber-800">{dpe.consumptionKwhM2Year} kWh/m²/an</span>
          </div>

          {/* Scale Bars */}
          <div className="space-y-2">
            {ratings.map((r) => {
              const isCurrent = dpe.energyRating === r;
              return (
                <div key={r} className="flex items-center gap-3">
                  <div className={`h-8 rounded-xl font-black text-xs px-3 flex items-center justify-between transition-all ${getDpeColor(r)} ${isCurrent ? 'w-full ring-2 ring-slate-900 shadow-md scale-[1.02]' : 'w-4/5 opacity-40'}`}>
                    <span>Classe {r}</span>
                    {isCurrent && <span className="font-bold font-mono">{dpe.consumptionKwhM2Year} kWh/m²/an</span>}
                  </div>
                  {isCurrent && <span className="text-xs font-black text-slate-900 whitespace-nowrap">← Votre Logement</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Climate GHG Scale & Energy Cost */}
        <div className="space-y-6">
          
          {/* Estimated Energy Bill */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Facture Énergétique Annuelle Estimée</span>
            <div className="text-3xl font-black text-amber-800 font-serif">
              {dpe.estimatedAnnualCostMin.toLocaleString('fr-FR')} € - {dpe.estimatedAnnualCostMax.toLocaleString('fr-FR')} € / an
            </div>
            <p className="text-xs text-slate-600">
              Estimation basée sur un usage standard des équipements de chauffage, eau chaude sanitaire et éclairage.
            </p>
          </div>

          {/* Heating & Insulation Specs */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Équipements & Qualité de l'Isolation</h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Mode de Chauffage:</span>
                <strong className="text-slate-900 text-right">{dpe.heatingType}</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Production Eau Chaude:</span>
                <strong className="text-slate-900 text-right">{dpe.waterHeatingType}</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Isolation des Murs:</span>
                <strong className="text-amber-800">{dpe.insulationQuality.walls}</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Isolation Toiture:</span>
                <strong className="text-amber-800">{dpe.insulationQuality.roof}</strong>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Menuiseries & Vitrage:</span>
                <strong className="text-emerald-700">{dpe.insulationQuality.windows}</strong>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
