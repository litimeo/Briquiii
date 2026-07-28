import React from 'react';
import { LocalTaxData } from '../types';
import { Receipt, Landmark, TrendingUp, AlertCircle, Info, Calculator, Percent, Building } from 'lucide-react';

interface DatasetLocalTaxationProps {
  taxation: LocalTaxData;
}

export const DatasetLocalTaxation: React.FC<DatasetLocalTaxationProps> = ({ taxation }) => {
  const isHighFiscalPressure = taxation.tfpbRatePercent > 40;
  const isLowFiscalPressure = taxation.tfpbRatePercent < 28;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-600 shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900">Taxe Foncière & Fiscalité Locale</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                Source DGFiP - REI {taxation.annualReiDataYear}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Taux officiels de la commune de <strong className="text-slate-800">{taxation.communeName}</strong> ({taxation.departmentCode}) et estimation indicative pour le bien
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
              isLowFiscalPressure
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : isHighFiscalPressure
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-indigo-50 text-indigo-800 border-indigo-200'
            }`}
          >
            {taxation.fiscalPressureIndex}
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TFPB Rate */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Taux Taxe Foncière (TFPB)</span>
            <Percent className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
            {taxation.tfpbRatePercent.toFixed(1)} %
          </div>
          <div className="text-xs text-slate-500 space-y-1 pt-1 border-t border-slate-200/60">
            <div className="flex justify-between">
              <span>Moyenne Dépt. :</span>
              <strong className="text-slate-700 font-mono">{taxation.deptAvgTfpbPercent} %</strong>
            </div>
            <div className="flex justify-between">
              <span>Moyenne Nationale :</span>
              <strong className="text-slate-700 font-mono">{taxation.nationalAvgTfpbPercent} %</strong>
            </div>
          </div>
        </div>

        {/* Estimated Annual Tax */}
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-indigo-800">
            <span>Estimation Taxe Foncière</span>
            <Calculator className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-950 font-mono">
            ~{taxation.estimatedAnnualTaxeFonciereEur.toLocaleString('fr-FR')} € / an
          </div>
          <p className="text-xs text-indigo-700 font-medium pt-1 border-t border-indigo-100">
            Soit environ <strong className="font-mono">{taxation.estimatedTaxeFoncierePerM2Eur} € / m² / an</strong>
          </p>
        </div>

        {/* TEOM Garbage Tax */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Taxe Ordures Ménagères (TEOM)</span>
            <Building className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
            {taxation.teomRatePercent.toFixed(1)} %
          </div>
          <p className="text-xs text-slate-500 pt-1 border-t border-slate-200/60">
            Taux additionnel d'enlèvement des déchets ménagers
          </p>
        </div>

        {/* 5-Year Rate Evolution */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Évolution Taux sur 5 Ans</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div
            className={`text-2xl sm:text-3xl font-extrabold font-mono ${
              taxation.fiveYearTaxRateEvolutionPercent > 3
                ? 'text-amber-600'
                : taxation.fiveYearTaxRateEvolutionPercent < 0
                ? 'text-emerald-600'
                : 'text-slate-900'
            }`}
          >
            {taxation.fiveYearTaxRateEvolutionPercent > 0 ? '+' : ''}
            {taxation.fiveYearTaxRateEvolutionPercent.toFixed(1)} %
          </div>
          <p className="text-xs text-slate-500 pt-1 border-t border-slate-200/60">
            Variation des délibérations communales
          </p>
        </div>
      </div>

      {/* EPCI Intercommunal Context */}
      <div className="bg-slate-50/70 border border-slate-200/70 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs sm:text-sm">
        <div className="flex items-start gap-3">
          <Landmark className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-slate-900">Structure Intercommunale (EPCI) : {taxation.epciName}</div>
            <div className="text-slate-500 mt-0.5">
              Part intercommunale TFPB : <strong className="text-slate-800 font-mono">{taxation.epciTfpbRatePercent}%</strong> | Bases nettes imposables totales : <strong className="text-slate-800 font-mono">{taxation.totalTaxableBaseEurM} M€</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Legal & Open Data Explanatory Callout */}
      <div className="bg-blue-50/60 border border-blue-200/70 rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-xs sm:text-sm text-blue-900">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <h4 className="font-bold text-blue-950">
            Note d'information : Secret Fiscal & Données Publiques Open Data DGFiP
          </h4>
          <p className="text-blue-800/90 leading-relaxed text-xs sm:text-sm">
            Conformément à l'article L103 du Livre des procédures fiscales, les avis d'imposition individuels et nominatifs (taxe foncière exacte d'un propriétaire spécifique) relèvent du <strong>secret fiscal</strong> et ne sont jamais publiés en Open Data par l'État.
          </p>
          <p className="text-blue-800/90 leading-relaxed text-xs sm:text-sm">
            Les données présentées ci-dessus proviennent des fichiers officiels de la DGFiP : le <strong>Fichier REI (Recensement des Éléments d'Imposition des Collectivités Locales)</strong> et la <strong>Table des Taux de Fiscalité Directe Locale</strong> (publiés annuellement sur <em>data.gouv.fr</em>). L'estimation en euros est calculée à partir de la valeur locative cadastrale moyenne observée sur le secteur.
          </p>
        </div>
      </div>
    </div>
  );
};
