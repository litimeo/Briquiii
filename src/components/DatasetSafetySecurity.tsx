import React from 'react';
import { SafetySecurityData } from '../types';
import { ShieldCheck, ShieldAlert, Lock, AlertTriangle, Building, CheckCircle2 } from 'lucide-react';

interface DatasetSafetySecurityProps {
  safetySecurity: SafetySecurityData;
}

export const DatasetSafetySecurity: React.FC<DatasetSafetySecurityProps> = ({ safetySecurity }) => {
  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-indigo-50/50 p-6 sm:p-7 rounded-3xl border border-indigo-100/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100/80 text-indigo-800 border border-indigo-200 flex items-center justify-center font-bold shadow-xs flex-shrink-0">
            <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">Statistiques de Délinquance & Sécurité</h2>
              <span className="bg-indigo-100 text-indigo-900 text-xs font-bold px-3 py-1 rounded-full border border-indigo-200/90">
                SSMSI / Police & Gendarmerie
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">Données officielles des services de sécurité nationale, taux d'atteintes aux biens et indice de sérénité.</p>
          </div>
        </div>

        <div className="bg-white px-4.5 py-3 rounded-2xl border border-indigo-200/90 flex items-center gap-3 shadow-xs">
          <div className="text-right">
            <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Indice de Sérénité</div>
            <div className="text-base font-extrabold text-indigo-900 font-heading">{safetySecurity.securityIndexScore} / 100 ({safetySecurity.relativeLevel})</div>
          </div>
        </div>
      </div>

      {/* Main Crime Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Burglaries */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Cambriolages Logements</span>
            <Lock className="w-4.5 h-4.5 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            {safetySecurity.burglariesPer1000} <span className="text-xs text-slate-500 font-sans font-normal">/ 1 000 hab.</span>
          </div>
          <div className="text-xs text-emerald-800 font-bold flex items-center gap-1.5 pt-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Moyenne nationale: {safetySecurity.nationalBurglariesAvgPer1000} / 1 000</span>
          </div>
        </div>

        {/* Property Damage */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Dégradations & Fissures</span>
            <AlertTriangle className="w-4.5 h-4.5 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            {safetySecurity.propertyDamagePer1000} <span className="text-xs text-slate-500 font-sans font-normal">/ 1 000 hab.</span>
          </div>
          <div className="text-xs text-emerald-800 font-bold flex items-center gap-1.5 pt-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Moyenne nationale: {safetySecurity.nationalDamageAvgPer1000} / 1 000</span>
          </div>
        </div>

        {/* Thefts without violence */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-2.5 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Vols Sans Violence</span>
            <ShieldAlert className="w-4.5 h-4.5 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            {safetySecurity.theftsPer1000} <span className="text-xs text-slate-500 font-sans font-normal">/ 1 000 hab.</span>
          </div>
          <div className="text-xs text-slate-600 font-medium pt-1">
            Atteintes aux véhicules et objets volés
          </div>
        </div>

      </div>

      {/* Police Jurisdiction Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-xs sm:text-sm uppercase tracking-wider font-heading">
          <Building className="w-4.5 h-4.5 text-indigo-600" />
          <span>Circonscription de Sécurité Publique</span>
        </div>
        <p className="text-base sm:text-lg font-bold text-slate-900">{safetySecurity.policeDistrictName}</p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Les statistiques communales sont consolidées par le Service Statistique Ministériel de la Sécurité Intérieure (SSMSI) à partir des procès-verbaux de la Police et Gendarmerie Nationales.
        </p>
      </div>

    </div>
  );
};
