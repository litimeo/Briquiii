import React from 'react';
import { CulturalData } from '../types';
import { Palette, Landmark, Film, BookOpen, Music, Ticket, Footprints, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';

interface DatasetCulturalProps {
  cultural: CulturalData;
}

export const DatasetCultural: React.FC<DatasetCulturalProps> = ({ cultural }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Musée & Galerie': return <Landmark className="w-5 h-5 text-amber-600" />;
      case 'Théâtre & Spectacle': return <Ticket className="w-5 h-5 text-purple-600" />;
      case 'Médiathèque & Bibliothèque': return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'Cinéma': return <Film className="w-5 h-5 text-rose-600" />;
      case 'Conservatoire & École d\'Art': return <Music className="w-5 h-5 text-teal-600" />;
      default: return <Palette className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-amber-50/60 p-6 sm:p-7 rounded-3xl border border-amber-100/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-800 border border-amber-200 flex items-center justify-center font-bold shadow-xs flex-shrink-0">
            <Palette className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">Lieux & Équipements Culturels (BASILIC)</h2>
              <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-200/90">
                Base BASILIC / Ministère de la Culture
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              Musées, théâtres, cinémas, monuments historiques et événements culturels accessibles à proximité du bien.
            </p>
          </div>
        </div>

        <div className="px-4 py-2.5 rounded-xl bg-white text-amber-900 text-xs sm:text-sm font-bold border border-amber-200 flex items-center gap-2 shadow-2xs">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Indice d'Offre Culturelle : {cultural.culturalDensityScore} / 100</span>
        </div>
      </div>

      {/* Cultural Key Numbers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Sites in 500m */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-2 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">Équipements à 500m</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-900 font-heading">
            {cultural.totalCulturalSites500m} Lieux
          </div>
          <span className="text-xs text-slate-500 font-medium block">Inscrits à la base nationale</span>
        </div>

        {/* Historical Monuments */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-2 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">Monuments Historiques</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            {cultural.totalHistoricalMonuments} Protégés
          </div>
          <span className="text-xs text-slate-500 font-medium block">Patrimoine classé / inscrit</span>
        </div>

        {/* Annual Events */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-2 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">Événements & Festivals</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-900 font-heading">
            ~{cultural.annualEventsCount} / an
          </div>
          <span className="text-xs text-slate-500 font-medium block">Manifestations culturelles locales</span>
        </div>

        {/* Equipment Diversity */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-2 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">Diversité des Équipements</span>
          <div className="text-xs font-extrabold text-slate-900 space-y-1 pt-1">
            <div className="flex justify-between"><span>Bibliothèques:</span> <strong className="text-amber-800">{cultural.nearbyLibrariesCount}</strong></div>
            <div className="flex justify-between"><span>Cinémas Art/Essai:</span> <strong className="text-amber-800">{cultural.nearbyCinemasCount}</strong></div>
            <div className="flex justify-between"><span>Théâtres & Scènes:</span> <strong className="text-amber-800">{cultural.nearbyTheatresCount}</strong></div>
          </div>
        </div>

      </div>

      {/* Cultural Sites Detail List */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
          Lieux Culturels & Activités à Proximité Immédiate
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cultural.keySites.map((site) => (
            <div key={site.id} className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-3 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 flex items-center justify-center shadow-2xs flex-shrink-0">
                    {getCategoryIcon(site.category)}
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900">{site.name}</h4>
                    <span className="text-xs text-amber-800 font-bold">{site.category}</span>
                  </div>
                </div>

                {site.isHistoricalMonument && (
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-amber-200 whitespace-nowrap">
                    Monument Historique
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{site.description}</p>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-slate-700">
                {site.address && (
                  <span className="flex items-center gap-1.5 text-slate-500 font-medium truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{site.address}</span>
                  </span>
                )}

                <div className="flex items-center gap-2 flex-shrink-0 text-amber-900 font-bold">
                  <Footprints className="w-3.5 h-3.5 text-amber-600" />
                  <span>{site.distanceMeters}m (~{site.walkTimeMinutes} min)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
