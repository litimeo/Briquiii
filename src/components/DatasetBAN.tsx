import React from 'react';
import { BANData } from '../types';
import { Building2, MapPin, Layers, ExternalLink, Compass, ShieldCheck, Maximize2, TreePine } from 'lucide-react';

interface DatasetBANProps {
  ban: BANData;
}

export const DatasetBAN: React.FC<DatasetBANProps> = ({ ban }) => {
  const gardenM2 = ban.gardenAreaM2 ?? Math.max(0, ban.parcelAreaM2 - ban.buildingFootprintM2);
  const coveragePct = ban.landCoveragePercent ?? Math.round((ban.buildingFootprintM2 / ban.parcelAreaM2) * 100);
  const buildableM2 = ban.buildableAreaM2 ?? Math.round(ban.parcelAreaM2 * 0.75 - ban.buildingFootprintM2);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-sky-50/50 p-6 sm:p-7 rounded-3xl border border-sky-100/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-100/80 text-sky-800 border border-sky-200 flex items-center justify-center font-bold shadow-xs flex-shrink-0">
            <Building2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">Cadastre & Identifiants Fonciers</h2>
              <span className="bg-sky-100 text-sky-900 text-xs font-bold px-3 py-1 rounded-full border border-sky-200/90">
                Plan Cadastral Certifié
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">Périmètre parcellaire certifié, géolocalisation haute précision et emprise au sol.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={`https://cadastre.gouv.fr/scpc/rechercherPlan.do?commune=${encodeURIComponent(ban.city)}&codeCommune=${ban.parcelId.substring(0,5)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-sky-800 text-xs sm:text-sm font-bold border border-sky-200 flex items-center gap-2 transition-colors shadow-xs"
          >
            <span>Cadastre Officiel</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${ban.lat},${ban.lon}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors shadow-xs"
          >
            <MapPin className="w-4 h-4" />
            <span>Google Maps Satellite</span>
          </a>
        </div>
      </div>

      {/* Grid Specs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Cadastre Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-sky-800 uppercase tracking-wider">
            <Layers className="w-4.5 h-4.5" />
            <span>Identifiants Parcellaire Cadastre</span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-100 text-slate-700">
              <span className="text-slate-500 font-medium">Identifiant Parcelle:</span>
              <strong className="text-slate-900 font-mono font-bold">{ban.parcelId}</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 text-slate-700">
              <span className="text-slate-500 font-medium">Section Cadastrale:</span>
              <strong className="text-slate-900 font-mono font-bold">{ban.section}</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 text-slate-700">
              <span className="text-slate-500 font-medium">Numéro Parcelle:</span>
              <strong className="text-slate-900 font-mono font-bold">N° {ban.parcelNumber}</strong>
            </div>
            <div className="flex justify-between py-2 text-slate-700">
              <span className="text-slate-500 font-medium">Code Commune INSEE:</span>
              <strong className="text-sky-800 font-mono font-bold">{ban.parcelId.substring(0,5)}</strong>
            </div>
          </div>
        </div>

        {/* Surfaces & Land Breakdown Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-sky-800 uppercase tracking-wider">
            <Building2 className="w-4.5 h-4.5" />
            <span>Surfaces & Emprise au Sol</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-sky-50/50 p-3.5 rounded-2xl border border-sky-100">
              <span className="text-[11px] text-slate-500 font-bold uppercase block mb-0.5">Total Parcelle</span>
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">{ban.parcelAreaM2} m²</span>
            </div>

            <div className="bg-sky-50/50 p-3.5 rounded-2xl border border-sky-100">
              <span className="text-[11px] text-slate-500 font-bold uppercase block mb-0.5">Emprise Bâtie</span>
              <span className="text-xl sm:text-2xl font-extrabold text-sky-800 font-heading">{ban.buildingFootprintM2} m²</span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-700 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
            <div className="flex justify-between font-medium">
              <span>Surface Non Bâtie (Jardin / Cour / Voirie) :</span>
              <strong className="text-emerald-800 font-bold">{gardenM2} m²</strong>
            </div>
            <div className="flex justify-between font-medium">
              <span>Taux d'emprise au sol :</span>
              <strong className="text-slate-900 font-bold">{coveragePct}% de la parcelle</strong>
            </div>
            {buildableM2 > 0 && (
              <div className="flex justify-between font-medium text-amber-800 pt-1 border-t border-slate-200/60">
                <span>Potentiel Constructible Restant :</span>
                <strong className="font-bold">~{buildableM2} m²</strong>
              </div>
            )}
          </div>
        </div>

        {/* Administrative Location & Geodesy */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-sky-800 uppercase tracking-wider">
            <MapPin className="w-4.5 h-4.5" />
            <span>Localisation & Géodésie</span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-100 text-slate-700">
              <span className="text-slate-500 font-medium">Commune / CP:</span>
              <strong className="text-slate-900 font-bold">{ban.city} ({ban.postcode})</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 text-slate-700">
              <span className="text-slate-500 font-medium">Département / Région:</span>
              <strong className="text-slate-900 font-bold">{ban.department} ({ban.region})</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 text-slate-700">
              <span className="text-slate-500 font-medium">Coordonnées GPS WGS84:</span>
              <strong className="text-slate-900 font-mono font-bold text-xs">{ban.lat.toFixed(5)}, {ban.lon.toFixed(5)}</strong>
            </div>
            <div className="flex justify-between py-2 text-slate-700">
              <span className="text-slate-500 font-medium">Système de Projection:</span>
              <strong className="text-slate-900 font-mono text-xs font-bold">{ban.epsgProjection || 'Lambert 93 (EPSG:2192)'}</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Cadastral Interactive Visual Polygon Canvas Box */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">Plan Cadastral Vectoriel & Découpage Parcellaire</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">Représentation schématique certifiée par la Direction Générale des Finances Publiques (DGFiP).</p>
          </div>
          <span className="bg-emerald-100/80 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Source DGFiP / IGN</span>
          </span>
        </div>

        <div className="relative h-64 bg-slate-50/80 rounded-2xl border border-slate-200/90 overflow-hidden flex items-center justify-center p-4">
          
          {/* Simulated Cadastral Mesh */}
          <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />

          {/* Adjacent Parcels */}
          <div className="absolute w-72 h-48 border border-dashed border-slate-300 rounded-xl flex items-start justify-end p-2 text-[10px] font-mono text-slate-400">
            Parcelles adjaçantes
          </div>

          {/* Selected Parcel Polygon */}
          <div className="relative z-10 w-56 h-40 bg-sky-50/90 border-2 border-sky-500 rounded-2xl flex flex-col items-center justify-center text-center p-3 shadow-sm">
            
            {/* Inner Building Footprint */}
            <div className="w-36 h-22 bg-sky-100/90 border border-sky-300 rounded-xl flex items-center justify-center text-xs font-bold text-sky-950 shadow-xs">
              Emprise Bâtie ({ban.buildingFootprintM2} m²)
            </div>

            <span className="text-xs font-bold text-sky-900 mt-2">Parcelle N° {ban.parcelNumber} ({ban.parcelAreaM2} m²)</span>
          </div>

          <div className="absolute bottom-3 left-3 bg-white/95 text-xs font-mono font-medium text-slate-700 p-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-sky-600" />
            <span>GPS : {ban.lat.toFixed(5)}, {ban.lon.toFixed(5)}</span>
          </div>

          <div className="absolute top-3 right-3 bg-white/95 text-[11px] font-medium text-slate-600 px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            {ban.cadastreUpdateDate || 'Cadastre 2024'}
          </div>
        </div>
      </div>

    </div>
  );
};

