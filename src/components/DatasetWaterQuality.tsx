import React from 'react';
import { WaterQualityData } from '../types';
import { Droplets, ShieldCheck, CheckCircle2, AlertTriangle, Activity, Building, Info } from 'lucide-react';

interface DatasetWaterQualityProps {
  waterQuality: WaterQualityData;
}

export const DatasetWaterQuality: React.FC<DatasetWaterQualityProps> = ({ waterQuality }) => {
  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-sky-50/50 p-6 sm:p-7 rounded-3xl border border-sky-100/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-100/80 text-sky-800 border border-sky-200 flex items-center justify-center font-bold shadow-xs flex-shrink-0">
            <Droplets className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">Qualité de l'Eau Potable & ARS</h2>
              <span className="bg-sky-100 text-sky-900 text-xs font-bold px-3 py-1 rounded-full border border-sky-200/90">
                ARS / Ministère Santé
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">Analyses sanitaires officielles, conformité microbiologique, nitrates et dureté de l'eau distribuée.</p>
          </div>
        </div>

        <div className="bg-white px-4.5 py-3 rounded-2xl border border-sky-200/90 flex items-center gap-3 shadow-xs">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <div className="text-left">
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Bilan Sanitaire Global</div>
            <div className="text-sm font-extrabold text-emerald-900">{waterQuality.overallSanitaryStatus}</div>
          </div>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Bacterial Compliance */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-2 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">Conformité Bactériologique</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-sky-800 font-heading flex items-center gap-2">
            {waterQuality.complianceBacterialPercent}%
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-xs text-slate-500 font-medium block">Absence de germes pathogènes</span>
        </div>

        {/* Chemical Compliance */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-2 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">Conformité Physico-Chimique</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading flex items-center gap-2">
            {waterQuality.complianceChemicalPercent}%
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-xs text-slate-500 font-medium block">Métaux lourds & pesticides</span>
        </div>

        {/* Nitrates Rate */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-2 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">Teneur en Nitrates</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 font-heading">
            {waterQuality.nitratesMgL} mg/L
          </div>
          <span className="text-xs text-slate-500 font-medium block">Seuil réglementaire: 50 mg/L</span>
        </div>

        {/* Water Hardness */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-2 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">Dureté de l'Eau (TH)</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-900 font-heading">
            {waterQuality.hardnessFrenchDegrees} °f
          </div>
          <span className="text-xs text-slate-500 font-medium block">{waterQuality.hardnessType}</span>
        </div>

      </div>

      {/* ARS Sanitarian Audit Summary Box */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-600" />
            <span>Synthèse du Réseau de Distribution ARS</span>
          </h3>
          <span className="text-xs sm:text-sm text-slate-600 font-mono">Contrôle récent: {waterQuality.lastArsControlDate}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
          <div className="bg-sky-50/40 p-5 rounded-2xl border border-sky-100 space-y-2">
            <div className="font-bold text-sky-900 flex items-center gap-2">
              <Building className="w-4.5 h-4.5 text-sky-700" />
              <span>Gestionnaire du Réseau d'Eau</span>
            </div>
            <p className="text-slate-900 font-bold text-base">{waterQuality.networkManager}</p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">Captage et traitement des eaux brutes sous supervision sanitaire de l'ARS.</p>
          </div>

          <div className="bg-emerald-50/40 p-5 rounded-2xl border border-emerald-100 space-y-2">
            <div className="font-bold text-emerald-900 flex items-center gap-2">
              <Info className="w-4.5 h-4.5 text-emerald-700" />
              <span>Verdict d'Aptitude Potabilité</span>
            </div>
            <p className="text-slate-800 leading-relaxed text-xs sm:text-sm">
              L'eau distribuée sur ce secteur respecte rigoureusement l'ensemble des limites de qualité réglementaires fixées par le Code de la Santé Publique.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
