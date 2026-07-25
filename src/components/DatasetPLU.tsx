import React from 'react';
import { PluAndAmenitiesData } from '../types';
import { Compass, Footprints, Bus, GraduationCap, ShoppingBag, Stethoscope, Trees, Volume2, Building2, ExternalLink, Landmark, Wind, Sparkles } from 'lucide-react';

interface DatasetPLUProps {
  plu: PluAndAmenitiesData;
}

export const DatasetPLU: React.FC<DatasetPLUProps> = ({ plu }) => {
  const getAmenityIcon = (cat: string) => {
    switch (cat) {
      case 'Transport': return <Bus className="w-4.5 h-4.5 text-blue-600" />;
      case 'Éducation': return <GraduationCap className="w-4.5 h-4.5 text-amber-600" />;
      case 'Commerce': return <ShoppingBag className="w-4.5 h-4.5 text-emerald-600" />;
      case 'Santé': return <Stethoscope className="w-4.5 h-4.5 text-rose-600" />;
      default: return <Trees className="w-4.5 h-4.5 text-teal-600" />;
    }
  };

  const abfZone = plu.abfProtectionZone ?? false;
  const abfName = plu.abfZoneName ?? (abfZone ? 'Périmètre de 500m autour d\'un Monument Historique Protégé' : 'Hors périmètre ABF');
  const atmoIndex = plu.airQualityAtmoIndex ?? 'Bon (1/6)';
  const greenSpacePct = plu.maxGreenSpacePercent ?? 20;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-teal-50/50 p-6 sm:p-7 rounded-3xl border border-teal-100/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100/80 text-teal-800 border border-teal-200 flex items-center justify-center font-bold shadow-xs flex-shrink-0">
            <Compass className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">Urbanisme, Zonage PLU & Accessibilité</h2>
              <span className="bg-teal-100 text-teal-900 text-xs font-bold px-3 py-1 rounded-full border border-teal-200/90">
                Géoportail de l'Urbanisme
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">Règles de constructibilité, zonage PLU, protection ABF et équipements de proximité.</p>
          </div>
        </div>

        <a
          href="https://www.geoportail-urbanisme.gouv.fr/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-teal-900 text-xs sm:text-sm font-bold border border-teal-200 flex items-center gap-2 transition-colors shadow-xs"
        >
          <span>Géoportail Urbanisme</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* PLU Rules & WalkScore Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* PLU Zoning Rules */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-3.5 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">Zonage PLU Réglementaire</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-800 font-heading">
            {plu.pluZoneCode}
          </div>
          <p className="text-xs sm:text-sm text-slate-700 font-bold">{plu.pluZoneName}</p>
          <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1.5">
            <div>Hauteur Max: <strong className="text-slate-900 font-bold">{plu.maxBuildingHeightMeters} mètres</strong></div>
            <div>Emprise au sol max: <strong className="text-slate-900 font-bold">{plu.footprintMaxPercent}%</strong></div>
            <div>Espaces Verts Min: <strong className="text-teal-900 font-bold">{greenSpacePct}% de la parcelle</strong></div>
          </div>
        </div>

        {/* WalkScore */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-3.5 shadow-sm">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-teal-800 uppercase tracking-wider font-heading">
            <Footprints className="w-4.5 h-4.5 text-teal-600" />
            <span>Marchabilité & WalkScore</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            {plu.walkScore} / 100
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {plu.walkScore >= 80 ? 'Accès à pied optimal aux commerces et services quotidiens.' : 'Quartier nécessitant un moyen de transport.'}
          </p>
        </div>

        {/* Noise Level & Air Quality */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-3.5 shadow-sm">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-900 uppercase tracking-wider font-heading">
            <Volume2 className="w-4.5 h-4.5 text-amber-600" />
            <span>Environnement & Bruit</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-900 font-heading">
            {plu.noiseCategory}
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Niveau sonore moyen Lden ({plu.noiseLevelDb} dB) • Qualité de l'Air ATMO: <strong className="text-emerald-800 font-bold">{atmoIndex}</strong>
          </p>
        </div>

      </div>

      {/* ABF Heritage Protection Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Landmark className="w-6 h-6 text-amber-700 flex-shrink-0" />
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider font-heading">
              Protection Architecte des Bâtiments de France (ABF)
            </h4>
            <p className="text-xs text-slate-600">
              {abfName}
            </p>
          </div>
        </div>

        <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${abfZone ? 'bg-amber-100 text-amber-900 border-amber-200' : 'bg-slate-100 text-slate-800 border-slate-200'}`}>
          {abfZone ? 'Avis ABF Requis' : 'Zone Standard'}
        </span>
      </div>

      {/* Proximity Amenities Matrix */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wider font-heading">Équipements & Services à Proximité Immédiate</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {plu.nearbyAmenities.map((item, idx) => (
            <div key={idx} className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 flex items-center justify-center shadow-2xs flex-shrink-0">
                  {getAmenityIcon(item.category)}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900">{item.name}</div>
                  <span className="text-xs text-slate-500 font-medium">{item.category}</span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-xs sm:text-sm font-extrabold text-teal-800 block">{item.distanceMeters}m</span>
                <span className="text-xs text-slate-500 font-mono">~{item.walkTimeMinutes} min</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

