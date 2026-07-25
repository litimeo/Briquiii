import React from 'react';
import { SafetySecurityData } from '../types';
import { ShieldCheck, ShieldAlert, Lock, AlertTriangle, Building, CheckCircle2, ExternalLink, Eye, Lightbulb, Bus } from 'lucide-react';

interface DatasetSafetySecurityProps {
  safetySecurity: SafetySecurityData;
}

export const DatasetSafetySecurity: React.FC<DatasetSafetySecurityProps> = ({ safetySecurity }) => {
  const cctvActive = safetySecurity.hasCctvCameras ?? true;
  const cctvCount = safetySecurity.cctvCameraCountApprox ?? 42;
  const streetLighting = safetySecurity.streetLightingQuality ?? 'Éclairage public LED nocturne rénové (95%)';
  const transportSafety = safetySecurity.publicTransportSafetyIndex ?? 82;

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
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">Données officielles des services de sécurité nationale, taux d'atteintes aux biens, vidéosurveillance et indice de sérénité.</p>
          </div>
        </div>

        <div className="px-4 py-2.5 rounded-xl bg-white text-indigo-900 text-xs sm:text-sm font-bold border border-indigo-200 flex items-center gap-2 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>Statistiques SSMSI Officielles</span>
        </div>
      </div>

      {/* Security Index Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">Indice Global de Sérénité du Quartier</span>
          <div className="text-2xl sm:text-3xl font-black text-indigo-950 font-heading">
            {safetySecurity.securityIndexScore} / 100 <span className="text-base font-bold text-indigo-700">({safetySecurity.relativeLevel})</span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-indigo-50/60 px-4 py-3 rounded-2xl border border-indigo-100 text-xs sm:text-sm text-indigo-950 font-medium">
          <Eye className="w-5 h-5 text-indigo-600 flex-shrink-0" />
          <span>Vidéoprotection Municipale : <strong className="font-extrabold">{cctvCount} caméras reliées au CSU</strong></span>
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

      {/* Urban Equipment & Transport Safety */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-xs uppercase tracking-wider font-heading">
            <Lightbulb className="w-4.5 h-4.5 text-amber-500" />
            <span>Éclairage Public & Nocturne</span>
          </div>
          <p className="text-sm font-bold text-slate-900">{streetLighting}</p>
          <p className="text-xs text-slate-500">Facteur clé pour la prévention situationnelle de l'insécurité.</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-xs uppercase tracking-wider font-heading">
            <Bus className="w-4.5 h-4.5 text-blue-600" />
            <span>Sécurité Transports en Commun</span>
          </div>
          <p className="text-sm font-bold text-slate-900">Score de sécurité : {transportSafety} / 100</p>
          <p className="text-xs text-slate-500">Présence d'agents de médiation et vidéosurveillance embarquée.</p>
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

