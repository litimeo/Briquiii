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
      <div className="bg-purple-50/50 p-6 sm:p-7 rounded-3xl border border-purple-100/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100/80 text-purple-800 border border-purple-200 flex items-center justify-center font-bold shadow-xs flex-shrink-0">
            <Users className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">Environnement Socio-Démographique</h2>
              <span className="bg-purple-100 text-purple-900 text-xs font-bold px-3 py-1 rounded-full border border-purple-200/90">
                INSEE
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">Indicateurs socio-économiques, niveau de vie et dynamisme du quartier.</p>
          </div>
        </div>
      </div>

      {/* Main Socio-Economic Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Median Annual Income */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-2 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">Revenu Médian / Foyer</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-900 font-heading">
            {insee.medianAnnualIncomeEur.toLocaleString('fr-FR')} €/an
          </div>
          <span className="text-xs text-slate-500 font-medium block">Niveau de vie par foyer fiscal</span>
        </div>

        {/* Population */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-2 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">Population Commune</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            {insee.populationTotal.toLocaleString('fr-FR')} hab.
          </div>
          <span className="text-xs text-slate-500 font-medium block">Recensement officiel INSEE</span>
        </div>

        {/* Executive Ratio */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-2 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">Cadres & Prof. Sup.</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-900 font-heading">
            {insee.executiveWorkersPercent}%
          </div>
          <span className="text-xs text-slate-500 font-medium block">Part de la population active</span>
        </div>

        {/* Unemployment Rate */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-2 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">Taux de Chômage</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            {insee.unemploymentRatePercent}%
          </div>
          <span className="text-xs text-slate-500 font-medium block">Population active 15-64 ans</span>
        </div>

      </div>

      {/* Owner vs Renter Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wider font-heading">Répartition du Parc de Logements (INSEE)</h3>

        <div className="space-y-3.5">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold flex-wrap gap-2">
            <span className="text-slate-800">Propriétaires Résidence Principale ({insee.ownerOccupiedPercent}%)</span>
            <span className="text-purple-900">Locataires ({insee.tenantOccupiedPercent}%)</span>
          </div>

          <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex p-0.5 border border-slate-200/80">
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
