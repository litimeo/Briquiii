import React from 'react';
import { InseeData } from '../types';
import { Users, Euro, ShieldCheck, TrendingUp, Building, ExternalLink } from 'lucide-react';

interface DatasetINSEEProps {
  insee: InseeData;
}

export const DatasetINSEE: React.FC<DatasetINSEEProps> = ({ insee }) => {
  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center font-bold shadow-xs">
            <Users className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">Section 5: Environnement Socio-Démographique</h2>
              <span className="bg-purple-50 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
                Statistiques Territoriales
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">Indicateurs socio-économiques, niveau de vie et dynamisme du quartier.</p>
          </div>
        </div>
      </div>

      {/* Main Socio-Economic Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Median Annual Income */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-1 shadow-sm">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Revenu Médian / Foyer</span>
          <div className="text-2xl font-black text-purple-700 font-serif">
            {insee.medianAnnualIncomeEur.toLocaleString('fr-FR')} €/an
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Niveau de vie par unité de consommation</span>
        </div>

        {/* Population */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-1 shadow-sm">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Population Commune</span>
          <div className="text-2xl font-black text-slate-900 font-serif">
            {insee.populationTotal.toLocaleString('fr-FR')} hab.
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Recensement officiel de la population</span>
        </div>

        {/* Executive Ratio */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-1 shadow-sm">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Cadres & Professions Sup.</span>
          <div className="text-2xl font-black text-purple-700 font-serif">
            {insee.executiveWorkersPercent}%
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Pourcentage dans la population active</span>
        </div>

        {/* Unemployment Rate */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-1 shadow-sm">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Taux de Chômage</span>
          <div className="text-2xl font-black text-slate-900 font-serif">
            {insee.unemploymentRatePercent}%
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Population active 15-64 ans</span>
        </div>

      </div>

      {/* Owner vs Renter Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Répartition du Parc de Logements (INSEE)</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700">Propriétaires Résidence Principale ({insee.ownerOccupiedPercent}%)</span>
            <span className="text-purple-700">Locataires ({insee.tenantOccupiedPercent}%)</span>
          </div>

          <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex p-0.5 border border-slate-200">
            <div
              style={{ width: `${insee.ownerOccupiedPercent}%` }}
              className="bg-purple-600 h-full rounded-l-full transition-all"
            />
            <div
              style={{ width: `${insee.tenantOccupiedPercent}%` }}
              className="bg-indigo-600 h-full rounded-r-full transition-all"
            />
          </div>
        </div>
      </div>

    </div>
  );
};
