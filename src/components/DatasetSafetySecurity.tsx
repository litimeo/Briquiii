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
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold shadow-xs">
            <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">Statistiques de Délinquance & Sécurité</h2>
              <span className="bg-indigo-50 text-indigo-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-200">
                SSMSI / Police & Gendarmerie
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">Données officielles des services de sécurité nationale, taux d'atteintes aux biens et indice de sérénité.</p>
          </div>
        </div>

        <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Indice de Sérénité Quartier</div>
            <div className="text-base font-black text-indigo-800 font-serif">{safetySecurity.securityIndexScore} / 100 ({safetySecurity.relativeLevel})</div>
          </div>
        </div>
      </div>

      {/* Main Crime Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Burglaries */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Cambriolages Logements</span>
            <Lock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-serif">
            {safetySecurity.burglariesPer1000} <span className="text-xs text-slate-500 font-sans">/ 1 000 hab.</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Moyenne nationale: {safetySecurity.nationalBurglariesAvgPer1000} / 1 000</span>
          </div>
        </div>

        {/* Property Damage */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Destructions & Dégradations</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-serif">
            {safetySecurity.propertyDamagePer1000} <span className="text-xs text-slate-500 font-sans">/ 1 000 hab.</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Moyenne nationale: {safetySecurity.nationalDamageAvgPer1000} / 1 000</span>
          </div>
        </div>

        {/* Thefts without violence */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Vols Sans Violence</span>
            <ShieldAlert className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-serif">
            {safetySecurity.theftsPer1000} <span className="text-xs text-slate-500 font-sans">/ 1 000 hab.</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Atteintes aux véhicules et objets volés
          </div>
        </div>

      </div>

      {/* Police Jurisdiction Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-indigo-800 font-bold text-xs uppercase tracking-wider">
          <Building className="w-4 h-4 text-indigo-600" />
          <span>Circonscription de Sécurité Publique</span>
        </div>
        <p className="text-sm font-bold text-slate-900">{safetySecurity.policeDistrictName}</p>
        <p className="text-xs text-slate-600 leading-relaxed">
          Les statistiques communales sont consolidées par le Service Statistique Ministériel de la Sécurité Intérieure (SSMSI) à partir des procès-verbaux de la Police et Gendarmerie Nationales.
        </p>
      </div>

    </div>
  );
};
