import React from 'react';
import { QualityOfLifeData } from '../types';
import { ShoppingBag, HeartPulse, GraduationCap, Bus, Trees, Sparkles, MapPin, Footprints, CheckCircle2 } from 'lucide-react';

interface DatasetQualityOfLifeProps {
  qualityOfLife: QualityOfLifeData;
}

export const DatasetQualityOfLife: React.FC<DatasetQualityOfLifeProps> = ({ qualityOfLife }) => {
  const { categories } = qualityOfLife;

  const cards = [
    {
      key: 'commerces',
      data: categories.commerces,
      icon: ShoppingBag,
      badgeColor: 'bg-amber-50 text-amber-900 border-amber-200',
      iconBg: 'bg-amber-100 text-amber-700',
      scoreColor: 'text-amber-600',
      barBg: 'bg-amber-500',
    },
    {
      key: 'sante',
      data: categories.sante,
      icon: HeartPulse,
      badgeColor: 'bg-rose-50 text-rose-900 border-rose-200',
      iconBg: 'bg-rose-100 text-rose-700',
      scoreColor: 'text-rose-600',
      barBg: 'bg-rose-500',
    },
    {
      key: 'education',
      data: categories.education,
      icon: GraduationCap,
      badgeColor: 'bg-blue-50 text-blue-900 border-blue-200',
      iconBg: 'bg-blue-100 text-blue-700',
      scoreColor: 'text-blue-600',
      barBg: 'bg-blue-500',
    },
    {
      key: 'transports',
      data: categories.transports,
      icon: Bus,
      badgeColor: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      iconBg: 'bg-emerald-100 text-emerald-700',
      scoreColor: 'text-emerald-600',
      barBg: 'bg-emerald-500',
    },
    {
      key: 'environnement',
      data: categories.environnement,
      icon: Trees,
      badgeColor: 'bg-teal-50 text-teal-900 border-teal-200',
      iconBg: 'bg-teal-100 text-teal-700',
      scoreColor: 'text-teal-600',
      barBg: 'bg-teal-500',
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#f56902] flex items-center justify-center font-bold">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">Qualité de vie</h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Analyse de la proximité des commodités, services essentiels et cadre de vie local.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-orange-50 border border-orange-200/90 px-4 py-2 rounded-2xl self-start sm:self-auto">
          <Sparkles className="w-4 h-4 text-[#f56902]" />
          <div>
            <div className="text-[10px] font-bold text-orange-800 uppercase tracking-wider">Score Cadre de Vie</div>
            <div className="text-base font-black text-slate-900 font-heading">{qualityOfLife.overallScore} / 100</div>
          </div>
        </div>
      </div>

      {/* Grid of 5 Quality of Life Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-orange-300 transition-all space-y-3.5 flex flex-col justify-between group shadow-2xs hover:shadow-xs"
            >
              {/* Category Icon & Score */}
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl ${item.iconBg} flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`text-2xl sm:text-3xl font-black font-heading ${item.scoreColor}`}>
                  {item.data.score}
                </div>
              </div>

              {/* Title & Summary */}
              <div className="space-y-1.5 flex-1">
                <h3 className="text-base font-extrabold text-slate-900 font-heading">{item.data.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {item.data.summary}
                </p>
              </div>

              {/* Nearest Walk Time Badge */}
              <div className="pt-2 border-t border-slate-200/60">
                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold bg-white px-3 py-1.5 rounded-xl border border-slate-200/80">
                  <MapPin className="w-3.5 h-3.5 text-[#f56902] flex-shrink-0" />
                  <span>Le plus proche à <strong className="text-slate-900 font-black">{item.data.nearestWalkTimeMinutes} min</strong> à pied</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/80 text-xs text-slate-600 flex items-center gap-3">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <span>Données agrégées basées sur la Base Permanente des Équipements (INSEE BPE), OpenStreetMap et le maillage des réseaux de transport urbain.</span>
      </div>

    </div>
  );
};
