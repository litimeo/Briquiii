import React from 'react';
import { ElusData } from '../types';
import { Landmark, Vote, UserCheck, ShieldCheck, FileText, Sparkles, Building, Award, CheckCircle2 } from 'lucide-react';

interface DatasetElusProps {
  elus: ElusData;
}

export const DatasetElus: React.FC<DatasetElusProps> = ({ elus }) => {
  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-indigo-50/60 p-6 sm:p-7 rounded-3xl border border-indigo-100/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100/80 text-indigo-800 border border-indigo-200 flex items-center justify-center font-bold shadow-xs flex-shrink-0">
            <Landmark className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">Élus Locaux & Cadre Politique (RNE)</h2>
              <span className="bg-indigo-100 text-indigo-900 text-xs font-bold px-3 py-1 rounded-full border border-indigo-200/90">
                Répertoire National des Élus (RNE)
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              Composition de la municipalité, tendance politique, programme d'action municipale et orientation budgétaire locale.
            </p>
          </div>
        </div>

        <div className="px-4 py-2.5 rounded-xl bg-white text-indigo-900 text-xs sm:text-sm font-bold border border-indigo-200 flex items-center gap-2 shadow-2xs">
          <Vote className="w-4 h-4 text-indigo-600" />
          <span>Participation Municipale : {elus.lastElectionTurnoutPercent}%</span>
        </div>
      </div>

      {/* Main Mayor & Council Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Mayor Profile Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-sm md:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">
              Maire & Exécutif Municipal
            </span>
            <span className="bg-indigo-100/80 text-indigo-900 text-xs font-bold px-3 py-1 rounded-full border border-indigo-200 font-mono">
              Mandat 2020 - 2026
            </span>
          </div>

          <div className="flex items-start gap-4 flex-col sm:flex-row">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-xl shadow-md flex-shrink-0">
              {elus.mayorName.split(' ').pop()?.[0] || 'M'}
            </div>
            <div className="space-y-1.5 flex-1">
              <h3 className="text-xl font-extrabold text-slate-900 font-heading">{elus.mayorName}</h3>
              <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm font-bold">
                <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-lg border border-slate-200">
                  {elus.mayorParty}
                </span>
                <span className="text-indigo-800 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                  {elus.politicalTendencyOverview}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {elus.localTaxPolicyVision}
              </p>
            </div>
          </div>
        </div>

        {/* Council Stats */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">
            Assemblée Municipale
          </span>
          <div className="space-y-2">
            <div className="text-3xl font-black text-slate-900 font-heading">
              {elus.municipalCouncilSize} Élus
            </div>
            <span className="text-xs text-slate-500 font-medium block">
              Conseillers municipaux siégeant au conseil de la commune.
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 font-medium">
            💡 <strong className="text-slate-900 font-bold">Info Investisseur & Habitant :</strong> La sensibilité politique municipale influence la réglementation PLU, la taxe foncière et l'encadrement des loyers.
          </div>
        </div>

      </div>

      {/* Program & Key Municipal Projects */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 text-indigo-900 text-base sm:text-lg font-bold font-heading">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <span>Orientations & Programme d'Action de la Municipalité</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {elus.keyMunicipalProgram.map((item, idx) => (
            <div key={idx} className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Officials Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
          Adjoints au Maire & Responsables de Délégation (Cadre RNE)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {elus.officials.map((official, idx) => (
            <div key={idx} className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-2.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-extrabold text-indigo-900 uppercase font-heading bg-indigo-100/70 px-2.5 py-0.5 rounded-md">
                  {official.partyAbbreviation}
                </span>
                <span className="text-xs text-slate-500 font-mono font-medium">{official.mandateYears}</span>
              </div>

              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900">{official.name}</h4>
                <p className="text-xs font-bold text-indigo-800">{official.role}</p>
              </div>

              {official.description && (
                <p className="text-xs text-slate-600 leading-relaxed">{official.description}</p>
              )}

              <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-slate-500">Projets phares :</span>
                {official.keyProjects.map((p, pIdx) => (
                  <span key={pIdx} className="text-[11px] font-medium bg-white text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Departmental & Regional Representatives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-3 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block font-heading">
            Représentation au Conseil Départemental
          </span>
          {elus.departmentalRepresentatives.map((rep, idx) => (
            <div key={idx} className="space-y-1 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="text-sm font-bold text-slate-900">{rep.name}</div>
              <div className="text-xs text-indigo-800 font-semibold">{rep.role}</div>
              <div className="text-xs text-slate-500 mt-1">Compétences : Collèges, voirie départementale, aide sociale.</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-3 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block font-heading">
            Représentation au Conseil Régional
          </span>
          {elus.regionalRepresentatives.map((rep, idx) => (
            <div key={idx} className="space-y-1 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="text-sm font-bold text-slate-900">{rep.name}</div>
              <div className="text-xs text-indigo-800 font-semibold">{rep.role}</div>
              <div className="text-xs text-slate-500 mt-1">Compétences : Transports TER, lycées, développement économique.</div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
