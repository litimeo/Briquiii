import React from 'react';
import { GeorisquesData } from '../types';
import { ShieldAlert, Waves, Layers, Activity, Zap, Factory, AlertTriangle, CheckCircle2, ExternalLink } from 'lucide-react';

interface DatasetGeorisquesProps {
  georisques: GeorisquesData;
}

export const DatasetGeorisques: React.FC<DatasetGeorisquesProps> = ({ georisques }) => {
  const getRiskColor = (level: string) => {
    if (level === 'Faible') return 'bg-emerald-100 text-emerald-950 border-emerald-200';
    if (level === 'Modéré' || level === 'Moyen') return 'bg-amber-100 text-amber-950 border-amber-200';
    return 'bg-rose-100 text-rose-950 border-rose-200';
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-rose-50/50 p-6 sm:p-7 rounded-3xl border border-rose-100/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100/80 text-rose-800 border border-rose-200 flex items-center justify-center font-bold shadow-xs flex-shrink-0">
            <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">Risques Naturels & Environnement</h2>
              <span className="bg-rose-100 text-rose-900 text-xs font-bold px-3 py-1 rounded-full border border-rose-200/90">
                Géorisques Officiel
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">Évaluation des risques inondation, sécheresse, retrait-gonflement des argiles et radon.</p>
          </div>
        </div>
      </div>

      {/* Overview Risk Rating Box */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <span className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">Exposition Globale aux Risques</span>
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
            <span className={`text-xl sm:text-2xl font-extrabold px-4 py-2 rounded-2xl border ${getRiskColor(georisques.overallRiskLevel)} font-heading`}>
              Aléa {georisques.overallRiskLevel}
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-800">Vulnérabilité: {georisques.riskScoreNumber}/10</span>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-slate-600 max-w-md text-center sm:text-right leading-relaxed">
          L'état des risques (ERP) informe les tiers sur les risques naturels, miniers, technologiques et sur la pollution des sols.
        </div>
      </div>

      {/* Risk Factors Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Flood Risk */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-900">
              <Waves className="w-4.5 h-4.5 text-blue-600" />
              <span>Risque Inondation (PPRI)</span>
            </div>
            <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border ${getRiskColor(georisques.floodRisk.level)}`}>
              {georisques.floodRisk.level}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{georisques.floodRisk.description}</p>
          <div className="text-xs font-bold text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
            Zone PPRI: <strong className="text-slate-900">{georisques.floodRisk.zoneName}</strong>
          </div>
        </div>

        {/* Clay Soil Risk */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-900">
              <Layers className="w-4.5 h-4.5 text-amber-600" />
              <span>Retrait Argiles</span>
            </div>
            <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border ${getRiskColor(georisques.claySoilRisk.level)}`}>
              Aléa {georisques.claySoilRisk.level}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{georisques.claySoilRisk.description}</p>
          <div className="text-xs font-bold text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
            Sécheresse: <strong className="text-slate-900">Étude G2 préconisée</strong>
          </div>
        </div>

        {/* Seismic Risk */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-rose-900">
              <Activity className="w-4.5 h-4.5 text-rose-600" />
              <span>Sismicité</span>
            </div>
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg border bg-slate-100 text-slate-800 border-slate-200">
              Zone {georisques.seismicRisk.zone}/5
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{georisques.seismicRisk.description}</p>
          <div className="text-xs font-bold text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
            Norme: <strong className="text-slate-900">Eurocode 8 standard</strong>
          </div>
        </div>

        {/* Radon Exposure */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-purple-900">
              <Zap className="w-4.5 h-4.5 text-purple-600" />
              <span>Potentiel Radon</span>
            </div>
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg border bg-slate-100 text-slate-800 border-slate-200">
              Catégorie {georisques.radonRisk.category}/3
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{georisques.radonRisk.description}</p>
        </div>

        {/* Industrial Pollution */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-3.5 shadow-sm md:col-span-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-teal-900">
              <Factory className="w-4.5 h-4.5 text-teal-600" />
              <span>Sites Industriels & Pollutions (BASIAS / SEVESO)</span>
            </div>
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg border bg-slate-100 text-slate-800 border-slate-200">
              Rayon 1000m
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{georisques.industrialPollution.description}</p>
        </div>

      </div>

    </div>
  );
};
