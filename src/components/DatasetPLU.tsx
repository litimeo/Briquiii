import React from 'react';
import { PluAndAmenitiesData } from '../types';
import { Compass, Footprints, Bus, GraduationCap, ShoppingBag, Stethoscope, Trees, Volume2, Building2, ExternalLink } from 'lucide-react';

interface DatasetPLUProps {
  plu: PluAndAmenitiesData;
}

export const DatasetPLU: React.FC<DatasetPLUProps> = ({ plu }) => {
  const getAmenityIcon = (cat: string) => {
    switch (cat) {
      case 'Transport': return <Bus className="w-4 h-4 text-blue-600" />;
      case 'Éducation': return <GraduationCap className="w-4 h-4 text-amber-600" />;
      case 'Commerce': return <ShoppingBag className="w-4 h-4 text-emerald-600" />;
      case 'Santé': return <Stethoscope className="w-4 h-4 text-rose-600" />;
      default: return <Trees className="w-4 h-4 text-teal-600" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold shadow-xs">
            <Compass className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">Section 6: Urbanisme, Zonage & Accessibilité</h2>
              <span className="bg-teal-50 text-teal-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-teal-200">
                Plan Local d'Urbanisme
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">Règles de constructibilité, zonage PLU et équipements de proximité.</p>
          </div>
        </div>
      </div>

      {/* PLU Rules & WalkScore Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* PLU Zoning Rules */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Zonage PLU Réglementaire</span>
          <div className="text-2xl font-black text-teal-700 font-serif">
            {plu.pluZoneCode}
          </div>
          <p className="text-xs text-slate-700 font-medium">{plu.pluZoneName}</p>
          <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
            <div>Hauteur Max Autorisée: <strong className="text-slate-900">{plu.maxBuildingHeightMeters} mètres</strong></div>
            <div>Emprise au sol max: <strong className="text-slate-900">{plu.footprintMaxPercent}%</strong></div>
          </div>
        </div>

        {/* WalkScore */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider">
            <Footprints className="w-4 h-4" />
            <span>Marchabilité & WalkScore</span>
          </div>
          <div className="text-3xl font-black text-slate-900 font-serif">
            {plu.walkScore} / 100
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {plu.walkScore >= 80 ? 'Accès à pied optimal à l\'ensemble des commerces et services quotidiens.' : 'Quartier nécessitant un moyen de transport ou vélo.'}
          </p>
        </div>

        {/* Noise Level */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
            <Volume2 className="w-4 h-4" />
            <span>Nuisances Sonores (Lden)</span>
          </div>
          <div className="text-2xl font-black text-amber-800 font-serif">
            {plu.noiseCategory}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Cartographie du bruit stratégique selon la directive européenne 2002/49/CE.
          </p>
        </div>

      </div>

      {/* Proximity Amenities Matrix */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Équipements & Services à Proximité Immédiate</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {plu.nearbyAmenities.map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                  {getAmenityIcon(item.category)}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{item.name}</div>
                  <span className="text-[10px] text-slate-500 font-medium">{item.category}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-black text-teal-700 block">{item.distanceMeters}m</span>
                <span className="text-[10px] text-slate-500 font-mono">~{item.walkTimeMinutes} min à pied</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
