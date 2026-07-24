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
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold shadow-xs">
            <Building2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">Section 1: Cadastre & Identifiants Fonciers</h2>
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                Plan Cadastral Certifié
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">Périmètre parcellaire certifié, géolocalisation et emprise au sol.</p>
          </div>
        </div>

        <a
          href={`https://cadastre.gouv.fr/scpc/rechercherPlan.do?commune=${encodeURIComponent(ban.city)}&codeCommune=${ban.parcelId.substring(0,5)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-blue-700 text-xs font-bold border border-slate-200 flex items-center gap-1.5 transition-colors"
        >
          <span>Consulter le Cadastre Officiel</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Grid Specs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Cadastre Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Identifiants Parcellaire Cadastre</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-700">
              <span className="text-slate-500">Identifiant Parcelle:</span>
              <strong className="text-slate-900 font-mono">{ban.parcelId}</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-700">
              <span className="text-slate-500">Section Cadastrale:</span>
              <strong className="text-slate-900 font-mono">{ban.section}</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-700">
              <span className="text-slate-500">Numéro Parcelle:</span>
              <strong className="text-slate-900 font-mono">N° {ban.parcelNumber}</strong>
            </div>
            <div className="flex justify-between py-1.5 text-slate-700">
              <span className="text-slate-500">Code Commune INSEE:</span>
              <strong className="text-blue-700 font-mono">{ban.parcelId.substring(0,5)}</strong>
            </div>
          </div>
        </div>

        {/* Surfaces Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Surfaces & Emprise au Sol</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Surface Parcelle</span>
              <span className="text-2xl font-black text-slate-900">{ban.parcelAreaM2} m²</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Emprise Bâtie</span>
              <span className="text-2xl font-black text-blue-700">{ban.buildingFootprintM2} m²</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
            Ratio d'emprise au sol bâti: <strong className="text-slate-900">{Math.round((ban.buildingFootprintM2 / ban.parcelAreaM2) * 100)}%</strong> de la surface totale de la parcelle.
          </div>
        </div>

        {/* Administrative Location */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Découpage Administratif</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-700">
              <span className="text-slate-500">Commune:</span>
              <strong className="text-slate-900">{ban.city}</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-700">
              <span className="text-slate-500">Code Postal:</span>
              <strong className="text-slate-900 font-mono">{ban.postcode}</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-700">
              <span className="text-slate-500">Département:</span>
              <strong className="text-slate-900">{ban.department}</strong>
            </div>
            <div className="flex justify-between py-1.5 text-slate-700">
              <span className="text-slate-500">Région:</span>
              <strong className="text-slate-900">{ban.region}</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Cadastral Interactive Visual Polygon Canvas Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Visualisation du Plan Cadastral & Emprise de Parcelle</h3>
            <p className="text-xs text-slate-500">Représentation vectorielle de la parcelle N°{ban.parcelNumber} Section {ban.section}</p>
          </div>
          <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
            SIG Vectoriel
          </span>
        </div>

        <div className="relative h-64 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center p-4">
          
          {/* Simulated Cadastral Mesh */}
          <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />

          {/* Adjacent Parcels */}
          <div className="absolute w-72 h-48 border border-dashed border-slate-300 rounded-xl" />

          {/* Selected Parcel Polygon */}
          <div className="relative z-10 w-52 h-36 bg-blue-50 border-2 border-blue-500 rounded-2xl flex flex-col items-center justify-center text-center p-3 shadow-sm">
            
            {/* Inner Building Footprint */}
            <div className="w-32 h-20 bg-blue-100 border border-blue-300 rounded-xl flex items-center justify-center text-[11px] font-black text-blue-900 shadow-xs">
              Bâtiment ({ban.buildingFootprintM2} m²)
            </div>

            <span className="text-[10px] font-bold text-blue-800 mt-2">Parcelle N° {ban.parcelNumber} ({ban.parcelAreaM2} m²)</span>
          </div>

          <div className="absolute bottom-3 left-3 bg-white/90 text-[10px] font-mono text-slate-600 p-2 rounded-xl border border-slate-200 shadow-xs">
            Lat: {ban.lat.toFixed(5)} • Lon: {ban.lon.toFixed(5)}
          </div>
        </div>
      </div>

    </div>
  );
};
