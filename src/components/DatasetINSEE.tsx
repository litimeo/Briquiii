import React from 'react';
import { InseeData } from '../types';
import { Users, Euro, ShieldCheck, TrendingUp, Building, ExternalLink, Briefcase, HeartHandshake, UserCheck } from 'lucide-react';

interface DatasetINSEEProps {
  insee: InseeData;
}

export const DatasetINSEE: React.FC<DatasetINSEEProps> = ({ insee }) => {
  const employeesPct = insee.employeesPercent ?? 28.5;
  const workersPct = insee.workersPercent ?? 16.2;
  const retireesPct = insee.retireesPercent ?? 22.4;
  const singleHouseholds = insee.singlePersonHouseholdsPercent ?? 42.1;
  const familyHouseholds = insee.familiesWithChildrenPercent ?? 34.5;
  const avgHouseholdSize = insee.avgHouseholdSize ?? 2.1;

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
                INSEE Données Déclaratives
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">Indicateurs socio-économiques, catégories socioprofessionnelles, composition des ménages et niveau de vie.</p>
          </div>
        </div>

        <div className="px-4 py-2.5 rounded-xl bg-white text-purple-900 text-xs sm:text-sm font-bold border border-purple-200 flex items-center gap-2 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-purple-600" />
          <span>Statistiques Officielles INSEE</span>
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

      {/* Extended Socio-Professional Categories Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">Catégories Socioprofessionnelles (PCS INSEE)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100 text-center">
            <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Cadres & Prof. Sup.</span>
            <span className="text-2xl font-extrabold text-purple-950 font-heading">{insee.executiveWorkersPercent}%</span>
            <span className="text-[11px] text-slate-500 block mt-1">Secteur tertiaire supérieur</span>
          </div>
          <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100 text-center">
            <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Employés & Prof. Interm.</span>
            <span className="text-2xl font-extrabold text-purple-950 font-heading">{employeesPct}%</span>
            <span className="text-[11px] text-slate-500 block mt-1">Services & commerces</span>
          </div>
          <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100 text-center">
            <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Ouvriers / Artisans</span>
            <span className="text-2xl font-extrabold text-purple-950 font-heading">{workersPct}%</span>
            <span className="text-[11px] text-slate-500 block mt-1">Industrie & BTP</span>
          </div>
          <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100 text-center">
            <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Retraités</span>
            <span className="text-2xl font-extrabold text-purple-950 font-heading">{retireesPct}%</span>
            <span className="text-[11px] text-slate-500 block mt-1">Seniors inscrits</span>
          </div>
        </div>
      </div>

      {/* Household Structure & Housing Tenancy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Owner vs Renter Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wider font-heading">Répartition du Parc de Logements</h3>

          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold flex-wrap gap-2">
              <span className="text-slate-800">Propriétaires ({insee.ownerOccupiedPercent}%)</span>
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

        {/* Household Structure */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wider font-heading">Structure des Ménages</h3>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Personnes Seules :</span>
              <strong className="text-slate-900 font-bold">{singleHouseholds}% des ménages</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Familles avec Enfants :</span>
              <strong className="text-purple-900 font-bold">{familyHouseholds}% des ménages</strong>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500 font-medium">Taille Moyenne du Ménage :</span>
              <strong className="text-slate-900 font-bold">{avgHouseholdSize} personnes / foyer</strong>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

