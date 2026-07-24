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
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center font-bold shadow-xs">
            <Droplets className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">Qualité de l'Eau Potable & Contrôle Sanitaire</h2>
              <span className="bg-sky-50 text-sky-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-sky-200">
                ARS / Ministère Santé
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">Analyses sanitaires officielles, conformité microbiologique, nitrates et dureté de l'eau distribuée.</p>
          </div>
        </div>

        <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <div className="text-left">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Bilan Sanitaire Global</div>
            <div className="text-xs font-black text-emerald-800">{waterQuality.overallSanitaryStatus}</div>
          </div>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Bacterial Compliance */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-1 shadow-sm">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Conformité Bactériologique</span>
          <div className="text-2xl font-black text-sky-700 font-serif flex items-center gap-2">
            {waterQuality.complianceBacterialPercent}%
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Absence de germes ou entérocoques</span>
        </div>

        {/* Chemical Compliance */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-1 shadow-sm">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Conformité Physico-Chimique</span>
          <div className="text-2xl font-black text-slate-900 font-serif flex items-center gap-2">
            {waterQuality.complianceChemicalPercent}%
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Contrôle métaux lourd & pesticides</span>
        </div>

        {/* Nitrates Rate */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-1 shadow-sm">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Teneur en Nitrates</span>
          <div className="text-2xl font-black text-emerald-700 font-serif">
            {waterQuality.nitratesMgL} mg/L
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Seuil maximal réglementaire: 50 mg/L</span>
        </div>

        {/* Water Hardness */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-1 shadow-sm">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Dureté de l'Eau (TH)</span>
          <div className="text-2xl font-black text-amber-800 font-serif">
            {waterQuality.hardnessFrenchDegrees} °f
          </div>
          <span className="text-[11px] text-slate-500 font-medium">{waterQuality.hardnessType}</span>
        </div>

      </div>

      {/* ARS Sanitarian Audit Summary Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-600" />
            <span>Synthèse du Réseau de Distribution ARS</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">Dernier contrôle: {waterQuality.lastArsControlDate}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="font-bold text-sky-800 flex items-center gap-2">
              <Building className="w-4 h-4 text-sky-600" />
              <span>Gestionnaire du Réseau d'Eau</span>
            </div>
            <p className="text-slate-800 font-medium">{waterQuality.networkManager}</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">Captage et traitement des eaux brutes sous supervision sanitaire de l'Agence Régionale de Santé.</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="font-bold text-emerald-800 flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-600" />
              <span>Verdict d'Aptitude Potabilité</span>
            </div>
            <p className="text-slate-800 font-medium leading-relaxed">
              L'eau distribuée sur ce secteur respecte rigoureusement l'ensemble des limites de qualité réglementaires fixées par le Code de la Santé Publique.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
