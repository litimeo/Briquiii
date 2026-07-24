import React from 'react';
import { BANData } from '../types';
import { Building2, MapPin, Database, Layers, ExternalLink, ShieldCheck } from 'lucide-react';

interface DatasetBANProps {
  ban: BANData;
}

export const DatasetBAN: React.FC<DatasetBANProps> = ({ ban }) => {
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
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">Périmètre parcellaire certifié, géolocalisation et emprise au sol.</p>
          </div>
        </div>

        <a
          href={`https://cadastre.gouv.fr/scpc/rechercherPlan.do?commune=${encodeURIComponent(ban.city)}&codeCommune=${ban.parcelId.substring(0,5)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4.5 py-3 rounded-xl bg-white hover:bg-slate-50 text-sky-800 text-xs sm:text-sm font-bold border border-sky-200 flex items-center gap-2 transition-colors shadow-xs"
        >
          <span>Consulter le Cadastre Officiel</span>
          <ExternalLink className="w-4 h-4" />
        </a>
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

        {/* Surfaces Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-sky-800 uppercase tracking-wider">
            <Building2 className="w-4.5 h-4.5" />
            <span>Surfaces & Emprise au Sol</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100">
              <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Surface Parcelle</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">{ban.parcelAreaM2} m²</span>
            </div>

            <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100">
              <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Emprise Bâtie</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-sky-800 font-heading">{ban.buildingFootprintM2} m²</span>
            </div>
          </div>

          <div className="text-sm text-slate-700 leading-relaxed bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
            Ratio d'emprise au sol bâti: <strong className="text-slate-900 font-bold">{Math.round((ban.buildingFootprintM2 / ban.parcelAreaM2) * 100)}%</strong> de la surface totale de la parcelle.
          </div>
        </div>

        {/* Administrative Location */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-sky-800 uppercase tracking-wider">
            <MapPin className="w-4.5 h-4.5" />
            <span>Découpage Administratif</span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-100 text-slate-700">
              <span className="text-slate-500 font-medium">Commune:</span>
              <strong className="text-slate-900 font-bold">{ban.city}</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 text-slate-700">
              <span className="text-slate-500 font-medium">Code Postal:</span>
              <strong className="text-slate-900 font-mono font-bold">{ban.postcode}</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 text-slate-700">
              <span className="text-slate-500 font-medium">Département:</span>
              <strong className="text-slate-900 font-bold">{ban.department}</strong>
            </div>
            <div className="flex justify-between py-2 text-slate-700">
              <span className="text-slate-500 font-medium">Région:</span>
              <strong className="text-slate-900 font-bold">{ban.region}</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Cadastral Interactive Visual Polygon Canvas Box */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">Visualisation du Plan Cadastral & Emprise de Parcelle</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">Représentation vectorielle de la parcelle N°{ban.parcelNumber} Section {ban.section}</p>
          </div>
          <span className="bg-emerald-100/80 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
            SIG Vectoriel
          </span>
        </div>

        <div className="relative h-64 bg-slate-50/80 rounded-2xl border border-slate-200/90 overflow-hidden flex items-center justify-center p-4">
          
          {/* Simulated Cadastral Mesh */}
          <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />

          {/* Adjacent Parcels */}
          <div className="absolute w-72 h-48 border border-dashed border-slate-300 rounded-xl" />

          {/* Selected Parcel Polygon */}
          <div className="relative z-10 w-56 h-40 bg-sky-50/90 border-2 border-sky-500 rounded-2xl flex flex-col items-center justify-center text-center p-3 shadow-sm">
            
            {/* Inner Building Footprint */}
            <div className="w-36 h-22 bg-sky-100/90 border border-sky-300 rounded-xl flex items-center justify-center text-xs font-bold text-sky-950 shadow-xs">
              Bâtiment ({ban.buildingFootprintM2} m²)
            </div>

            <span className="text-xs font-bold text-sky-900 mt-2">Parcelle N° {ban.parcelNumber} ({ban.parcelAreaM2} m²)</span>
          </div>

          <div className="absolute bottom-3 left-3 bg-white/95 text-xs font-mono font-medium text-slate-700 p-2.5 rounded-xl border border-slate-200 shadow-xs">
            Lat: {ban.lat.toFixed(5)} • Lon: {ban.lon.toFixed(5)}
          </div>
        </div>
      </div>

    </div>
  );
};
