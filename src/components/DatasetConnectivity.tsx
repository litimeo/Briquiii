import React from 'react';
import { ConnectivityData } from '../types';
import { Wifi, Signal, Zap, CheckCircle2, ShieldCheck, Cpu, Radio, Globe, AlertCircle } from 'lucide-react';

interface DatasetConnectivityProps {
  connectivity: ConnectivityData;
}

export const DatasetConnectivity: React.FC<DatasetConnectivityProps> = ({ connectivity }) => {
  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-cyan-50/60 p-6 sm:p-7 rounded-3xl border border-cyan-100/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-100/80 text-cyan-800 border border-cyan-200 flex items-center justify-center font-bold shadow-xs flex-shrink-0">
            <Wifi className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">Ma Connexion Internet & Couverture Numérique</h2>
              <span className="bg-cyan-100 text-cyan-900 text-xs font-bold px-3 py-1 rounded-full border border-cyan-200/90">
                Données Réseau ARcep
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              Éligibilité Fibre Optique (FttH), débits maximums descendant/montant, couverture mobile 4G/5G et calendrier d'extinction du réseau cuivre.
            </p>
          </div>
        </div>

        <div className="px-4 py-2.5 rounded-xl bg-white text-cyan-900 text-xs sm:text-sm font-bold border border-cyan-200 flex items-center gap-2 shadow-2xs">
          <Signal className="w-4 h-4 text-cyan-600" />
          <span>Fibre Optique FttH : {connectivity.fiberCoveragePercent}% du quartier</span>
        </div>
      </div>

      {/* Primary Connectivity Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Fiber Status */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-2 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">Éligibilité Fibre Optique</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 font-heading flex items-center gap-2">
            <span>Raccordable</span>
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <span className="text-xs text-slate-500 font-medium block">Prise FttH installée ou disponible</span>
        </div>

        {/* Max Download Speed */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-2 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">Débit Max Descendant</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-900 font-heading">
            {connectivity.maxDownloadMbps >= 1000 ? `${(connectivity.maxDownloadMbps / 1000).toFixed(1)} Gbps` : `${connectivity.maxDownloadMbps} Mbps`}
          </div>
          <span className="text-xs text-slate-500 font-medium block">Téléchargement très haut débit</span>
        </div>

        {/* Max Upload Speed */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-2 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">Débit Max Montant</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            {connectivity.maxUploadMbps} Mbps
          </div>
          <span className="text-xs text-slate-500 font-medium block">Télétravail, visio & envoi cloud</span>
        </div>

        {/* 5G Coverage */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-2 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">Couverture Mobile 5G</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-900 font-heading">
            {connectivity.mobile5gRating}
          </div>
          <span className="text-xs text-slate-500 font-medium block">Antennes 3.5 GHz multi-opérateurs</span>
        </div>

      </div>

      {/* Telecom Operators Matrix */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
          Opérateurs Disponibles & Débits par Fournisseur d'Accès (FAD)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {connectivity.operatorsAvailable.map((op, idx) => (
            <div key={idx} className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-base font-black text-slate-900 font-heading">{op.name}</span>
                <span className="bg-emerald-100 text-emerald-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Fibre ✓
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="text-slate-500 font-medium">Débit Max commercialisé :</div>
                <div className="font-extrabold text-cyan-900 font-mono text-sm">{op.maxDownloadSpeed}</div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Réseau 5G :</span>
                <strong className="text-slate-900 font-bold">{op.coverage5G}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADSL Copper Phase-out Warning & Satellite Option */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Copper Sunset */}
        <div className="bg-amber-50/70 border border-amber-200 p-6 rounded-3xl space-y-3 shadow-2xs">
          <div className="flex items-center gap-2.5 text-amber-900 text-sm font-bold font-heading">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>Fermeture Programmée du Réseau Cuivre (ADSL)</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {connectivity.adslStatus}
          </p>
          <div className="text-xs font-extrabold text-amber-900 bg-amber-100/80 p-3 rounded-2xl border border-amber-200/90">
            Migration Fibre obligatoire avant {connectivity.copperPhaseOutYear} pour conserver une connexion fixe.
          </div>
        </div>

        {/* Satellite Option */}
        <div className="bg-white border border-slate-200/90 p-6 rounded-3xl space-y-3 shadow-2xs">
          <div className="flex items-center gap-2.5 text-slate-900 text-sm font-bold font-heading">
            <Globe className="w-5 h-5 text-cyan-600 flex-shrink-0" />
            <span>Option Secours Satellite (Starlink / Eutelsat)</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            La zone géographique est pleinement éligible aux offres Internet Satellite très haut débit Starlink et Eutelsat Konnect en cas de besoin de redondance professionnelle.
          </p>
          <div className="text-xs font-bold text-emerald-800 bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
            ✓ Débit satellite disponible : 100 à 220 Mbps
          </div>
        </div>

      </div>

    </div>
  );
};
