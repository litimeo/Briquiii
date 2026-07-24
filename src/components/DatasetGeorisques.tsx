import React from 'react';
import { GeorisquesData } from '../types';
import { ShieldAlert, Waves, Layers, Activity, Zap, Factory, AlertTriangle, CheckCircle2, ExternalLink } from 'lucide-react';

interface DatasetGeorisquesProps {
  georisques: GeorisquesData;
}

export const DatasetGeorisques: React.FC<DatasetGeorisquesProps> = ({ georisques }) => {
  const getRiskColor = (level: string) => {
    if (level === 'Faible') return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (level === 'Modéré' || level === 'Moyen') return 'bg-amber-50 text-amber-800 border-amber-200';
    return 'bg-rose-50 text-rose-800 border-rose-200';
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center font-bold shadow-xs">
            <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">Section 4: Analyse des Risques Naturels & Environnement</h2>
              <span className="bg-rose-50 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-rose-200">
                Cartographie Réglementaire
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">Évaluation des risques inondation, sécheresse, retrait-gonflement des argiles et radon.</p>
          </div>
        </div>
      </div>

      {/* Overview Risk Rating Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Niveau Majeur d'Exposition aux Risques</span>
          <div className="flex items-center gap-3">
            <span className={`text-2xl font-black px-4 py-1.5 rounded-2xl border ${getRiskColor(georisques.overallRiskLevel)}`}>
              Aléa {georisques.overallRiskLevel}
            </span>
            <span className="text-sm font-bold text-slate-700">Indice de vulnérabilité: {georisques.riskScoreNumber}/10</span>
          </div>
        </div>

        <div className="text-xs text-slate-600 max-w-md text-center sm:text-right">
          L'état des risques informe l'acquéreur ou le locataire des aléas naturels, miniers, technologiques et de la pollution des sols.
        </div>
      </div>

      {/* Risk Factors Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Flood Risk */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
              <Waves className="w-4 h-4" />
              <span>Risque Inondation (PPRI)</span>
            </div>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${getRiskColor(georisques.floodRisk.level)}`}>
              {georisques.floodRisk.level}
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">{georisques.floodRisk.description}</p>
          <div className="text-[11px] font-bold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            Zone PPRI: <strong className="text-slate-900">{georisques.floodRisk.zoneName}</strong>
          </div>
        </div>

        {/* Clay Soil Risk */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
              <Layers className="w-4 h-4" />
              <span>Retrait-Gonflement Argiles</span>
            </div>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${getRiskColor(georisques.claySoilRisk.level)}`}>
              Aléa {georisques.claySoilRisk.level}
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">{georisques.claySoilRisk.description}</p>
          <div className="text-[11px] font-bold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            Fissures sécheresse: <strong className="text-slate-900">Etude de sol G2 recommandée</strong>
          </div>
        </div>

        {/* Seismic Risk */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-700">
              <Activity className="w-4 h-4" />
              <span>Sismicité</span>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md border bg-slate-100 text-slate-700 border-slate-200">
              Zone {georisques.seismicRisk.zone}/5
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">{georisques.seismicRisk.description}</p>
          <div className="text-[11px] font-bold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            Norme parasismique: <strong className="text-slate-900">Eurocode 8 standard</strong>
          </div>
        </div>

        {/* Radon Exposure */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-700">
              <Zap className="w-4 h-4" />
              <span>Potentiel Radon</span>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md border bg-slate-100 text-slate-700 border-slate-200">
              Catégorie {georisques.radonRisk.category}/3
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">{georisques.radonRisk.description}</p>
        </div>

        {/* Industrial Pollution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-700">
              <Factory className="w-4 h-4" />
              <span>Sites Industriels & Pollutions BASIAS / SEVESO</span>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md border bg-slate-100 text-slate-700 border-slate-200">
              Périmètre 1000m
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">{georisques.industrialPollution.description}</p>
        </div>

      </div>

    </div>
  );
};
