import React from 'react';
import { ConstructionPermitData } from '../types';
import { HardHat, FileCheck2, Hammer, Building, AlertCircle, Clock, CheckCircle2, ArrowUpRight, ExternalLink } from 'lucide-react';

interface DatasetConstructionPermitsProps {
  constructionPermits: ConstructionPermitData;
}

export const DatasetConstructionPermits: React.FC<DatasetConstructionPermitsProps> = ({ constructionPermits }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Accordé':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Chantier démarré':
        return 'bg-orange-50 text-orange-950 border-orange-200';
      case 'En cours d\'instruction':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Achevée':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const totalSurfaceM2 = constructionPermits.recentPermits.reduce((acc, curr) => acc + (curr.surfaceM2Created || 0), 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">Permis de Construire & Sitadel</h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Suivi des demandes de permis de construire (Sitadel - Ministère de la Transition Écologique).</p>
            </div>
          </div>
        </div>

        <a
          href="https://www.statistiques.developpement-durable.gouv.fr/construction-de-logements-sitadel"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs sm:text-sm font-bold border border-amber-200 flex items-center gap-2 transition-colors shadow-xs self-start sm:self-auto"
        >
          <span>Base Sitadel Officielle</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Autorisations 500m</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            {constructionPermits.totalPermits500m} <span className="text-xs font-normal text-slate-500">dossiers</span>
          </div>
          <p className="text-[11px] text-slate-500">Permis & déclarations secteur</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Permis Récents</div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 font-heading">
            {constructionPermits.permitsLast2Years} <span className="text-xs font-normal text-slate-500">projets</span>
          </div>
          <p className="text-[11px] text-slate-500">Moins de 24 mois</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Grands Projets</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            {constructionPermits.majorProjectsCount} <span className="text-xs font-normal text-slate-500">programmes</span>
          </div>
          <p className="text-[11px] text-slate-500">Création de logements neufs</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Surface Plancher Récents</div>
          <div className="text-2xl sm:text-3xl font-black text-amber-800 font-heading">
            +{totalSurfaceM2.toLocaleString('fr-FR')} <span className="text-xs font-normal text-slate-500">m²</span>
          </div>
          <p className="text-[11px] text-slate-500">Surface cumulée créée</p>
        </div>
      </div>

      {/* List / Table of Recent Permits */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
          Derniers Permis de Construire Déposés à Proximité Directe
        </h3>

        <div className="divide-y divide-slate-100 border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-2xs">
          {constructionPermits.recentPermits.map((permit) => (
            <div key={permit.id} className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                    {permit.permitNumber}
                  </span>
                  <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${getStatusBadge(permit.status)}`}>
                    {permit.status}
                  </span>
                </div>

                <div className="text-xs text-slate-500 font-medium flex items-center gap-3">
                  <span>Accordé le : <strong className="text-slate-800 font-bold">{permit.dateGranted}</strong></span>
                  <span>À <strong className="text-slate-800 font-bold">{permit.distanceMeters}m</strong></span>
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-800 font-bold leading-relaxed">
                {permit.destination}
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1 gap-2">
                <span>Demandeur : <strong className="text-slate-700">{permit.applicant}</strong></span>
                {permit.surfaceM2Created > 0 && (
                  <span className="bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md font-bold border border-amber-200/60">
                    +{permit.surfaceM2Created} m² créés
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/80 text-xs text-slate-600 flex items-center gap-3">
        <FileCheck2 className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span>Données Sitadel d'autorisations du droit des sols (ADS) mises à jour régulièrement depuis les registres municipaux et métropolitains.</span>
      </div>

    </div>
  );
};

