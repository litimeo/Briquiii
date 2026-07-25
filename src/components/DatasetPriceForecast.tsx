import React, { useState } from 'react';
import { PriceProjectionData } from '../types';
import { TrendingUp, LineChart, Sliders, ShieldCheck, Calculator, Sparkles, ArrowUpRight, ArrowDownRight, Layers, Percent, Clock, AlertCircle } from 'lucide-react';

interface DatasetPriceForecastProps {
  projection: PriceProjectionData;
}

export const DatasetPriceForecast: React.FC<DatasetPriceForecastProps> = ({ projection }) => {
  const [surfaceM2, setSurfaceM2] = useState<number>(60);
  const [activeScenario, setActiveScenario] = useState<'prudent' | 'median' | 'optimistic'>('median');
  const [interestRateAdjustment, setInterestRateAdjustment] = useState<number>(0); // -1% to +1%
  const [inflationAdjustment, setInflationAdjustment] = useState<number>(0); // -1% to +1%

  // Calculated dynamic projections based on user slider tweaks
  const userAdjustedRate = (projection.baseAnnualGrowthPercent / 100) + (interestRateAdjustment / 100) + (inflationAdjustment / 100);
  
  const currentBasePrice = projection.currentPricePerM2;
  
  const calcDynPrice = (years: number) => {
    const rateToUse = activeScenario === 'prudent' 
      ? userAdjustedRate - 0.018 
      : activeScenario === 'optimistic' 
      ? userAdjustedRate + 0.018 
      : userAdjustedRate;
    return Math.round(currentBasePrice * Math.pow(1 + rateToUse, years));
  };

  const p1 = calcDynPrice(1);
  const p3 = calcDynPrice(3);
  const p5 = calcDynPrice(5);

  const gain5Years = Math.round((p5 - currentBasePrice) * surfaceM2);
  const growth5YearsPercent = Number((((p5 / currentBasePrice) - 1) * 100).toFixed(1));

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-orange-50/80 via-amber-50/60 to-orange-50/80 p-6 sm:p-7 rounded-3xl border border-orange-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#f56902] text-white flex items-center justify-center font-bold shadow-md flex-shrink-0">
            <LineChart className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">Modèle de Prévision & Projection du Prix au m²</h2>
              <span className="bg-emerald-100 text-emerald-950 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200/90 font-mono">
                Signal Immo Predictive Engine
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              Algorithme d'économétrie prédictive croisant l'historique DVF, les performances DPE, la tension locative OLL, le zonage Sitadel et l'environnement macro-économique.
            </p>
          </div>
        </div>

        <div className="px-4 py-2.5 rounded-xl bg-white text-orange-950 text-xs sm:text-sm font-bold border border-orange-200 flex items-center gap-2 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-[#f56902]" />
          <span>Indice de Confiance Modèle : {projection.confidenceScore}%</span>
        </div>
      </div>

      {/* Primary 1yr, 3yr, 5yr Horizons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Horizon 1 Year */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-3 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
            <span>Projection à 1 An</span>
            <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono">2027</span>
          </div>
          <div className="text-3xl font-black text-slate-900 font-heading">
            {p1.toLocaleString('fr-FR')} €/m²
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">Variation estimée :</span>
            <span className={`font-bold ${p1 >= currentBasePrice ? 'text-emerald-700' : 'text-rose-700'}`}>
              {p1 >= currentBasePrice ? '+' : ''}{(((p1 / currentBasePrice) - 1) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Horizon 3 Years */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-3 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
            <span>Projection à 3 Ans</span>
            <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono">2029</span>
          </div>
          <div className="text-3xl font-black text-slate-900 font-heading">
            {p3.toLocaleString('fr-FR')} €/m²
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">Variation estimée :</span>
            <span className={`font-bold ${p3 >= currentBasePrice ? 'text-emerald-700' : 'text-rose-700'}`}>
              {p3 >= currentBasePrice ? '+' : ''}{(((p3 / currentBasePrice) - 1) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Horizon 5 Years (Highlighted) */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 space-y-3 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-bold text-orange-400 uppercase tracking-wider font-heading">
            <span>Projection à 5 Ans (Incitations)</span>
            <span className="bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded font-mono border border-orange-500/30">2031</span>
          </div>
          <div className="text-3xl font-black text-white font-heading">
            {p5.toLocaleString('fr-FR')} €/m²
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-700 text-xs">
            <span className="text-slate-300 font-medium">Cumul sur 5 Ans :</span>
            <span className="font-extrabold text-orange-400 text-sm">
              {growth5YearsPercent >= 0 ? '+' : ''}{growth5YearsPercent}%
            </span>
          </div>
        </div>

      </div>

      {/* Interactive Simulation & Surface Gain Calculator */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5 text-slate-900 text-base sm:text-lg font-bold font-heading">
            <Calculator className="w-5 h-5 text-[#f56902]" />
            <span>Simulateur d'Ajustement Macro & Plus-Value pour votre Surface</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Scénario :</span>
            <div className="inline-flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveScenario('prudent')}
                className={`px-3 py-1 rounded-lg transition-all ${activeScenario === 'prudent' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Prudent
              </button>
              <button
                onClick={() => setActiveScenario('median')}
                className={`px-3 py-1 rounded-lg transition-all ${activeScenario === 'median' ? 'bg-[#f56902] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Médian
              </button>
              <button
                onClick={() => setActiveScenario('optimistic')}
                className={`px-3 py-1 rounded-lg transition-all ${activeScenario === 'optimistic' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Optimiste
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Sliders Box */}
          <div className="space-y-5 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80">
            {/* Surface slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Surface du Logement :</span>
                <span className="text-[#f56902] font-mono font-extrabold text-sm">{surfaceM2} m²</span>
              </div>
              <input
                type="range"
                min="15"
                max="250"
                step="5"
                value={surfaceM2}
                onChange={(e) => setSurfaceM2(Number(e.target.value))}
                className="w-full accent-[#f56902] cursor-pointer"
              />
            </div>

            {/* Interest Rate Ajustment Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Ajustement Taux d'Intérêt Crédit :</span>
                <span className="text-slate-900 font-mono">{interestRateAdjustment >= 0 ? `+${interestRateAdjustment}%` : `${interestRateAdjustment}%`}</span>
              </div>
              <input
                type="range"
                min="-1.5"
                max="1.5"
                step="0.25"
                value={interestRateAdjustment}
                onChange={(e) => setInterestRateAdjustment(Number(e.target.value))}
                className="w-full accent-[#f56902] cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 block">Simule l'impact d'une hausse ou baisse des taux de prêt sur le prix.</span>
            </div>

            {/* Inflation Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Ajustement Inflation / Indexation :</span>
                <span className="text-slate-900 font-mono">{inflationAdjustment >= 0 ? `+${inflationAdjustment}%` : `${inflationAdjustment}%`}</span>
              </div>
              <input
                type="range"
                min="-1.0"
                max="1.0"
                step="0.25"
                value={inflationAdjustment}
                onChange={(e) => setInflationAdjustment(Number(e.target.value))}
                className="w-full accent-[#f56902] cursor-pointer"
              />
            </div>
          </div>

          {/* Results Box */}
          <div className="bg-orange-50/40 p-5 rounded-2xl border border-orange-100 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-slate-500 tracking-wider font-heading block">
                Estimation Valeur & Plus-Value à 5 Ans ({surfaceM2} m²)
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                {(p5 * surfaceM2).toLocaleString('fr-FR')} €
              </div>
              <span className="text-xs text-slate-600 block">
                Prix d'acquisition de référence actuel : <strong className="text-slate-900">{(currentBasePrice * surfaceM2).toLocaleString('fr-FR')} €</strong>
              </span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-orange-200/80 space-y-1">
              <div className="text-xs font-bold text-slate-500">Plus-Value Foncier Latente à 5 Ans :</div>
              <div className={`text-xl font-extrabold ${gain5Years >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {gain5Years >= 0 ? `+${gain5Years.toLocaleString('fr-FR')} €` : `${gain5Years.toLocaleString('fr-FR')} €`}
              </div>
              <p className="text-[11px] text-slate-500">
                Calcul basé sur le scénario <strong className="text-slate-800 uppercase">{activeScenario}</strong> et une durée de détention conseillée de {projection.recommendedHoldDurationYears} ans.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Econometric Drivers Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
          Pondération des Moteurs d'Évolution Économétrique (Drivers)
        </h3>

        <div className="space-y-3">
          {projection.drivers.map((driver, idx) => (
            <div key={idx} className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-900">{driver.driverName}</span>
                  <span className="text-[10px] bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded">
                    {driver.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{driver.explanation}</p>
              </div>

              <div className="flex items-center gap-1.5 font-mono text-xs font-extrabold flex-shrink-0 self-start sm:self-center">
                <span className="text-slate-500">Impact annuel :</span>
                <span className={driver.impactPercentPerYear >= 0 ? 'text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200' : 'text-rose-700 bg-rose-50 px-2 py-1 rounded border border-rose-200'}>
                  {driver.impactPercentPerYear >= 0 ? `+${driver.impactPercentPerYear}%` : `${driver.impactPercentPerYear}%`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Methodological Explanation Note */}
      <div className="bg-slate-900 text-slate-200 p-6 rounded-3xl space-y-2 text-xs leading-relaxed">
        <div className="flex items-center gap-2 font-bold text-white text-sm">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span>Faisabilité Technique & Rigueur du Modèle Prédictif Signal Immo</span>
        </div>
        <p>
          Ce modèle s'appuie sur une démarche algorithmique d'économétrie composée, similaire à celle employée par les calculateurs financiers et simulateurs de valorisation professionnelle. Il combine de manière transparente le momentum des transactions notariées DVF sur 5 ans, les coefficients d'impact du Diagnostic de Performance Énergétique (DPE), les indices de tension locative de l'Observatoire des Loyers (OLL), les autorisations d'urbanisme Sitadel et les variables macro-économiques d'intérêt.
        </p>
      </div>

    </div>
  );
};
