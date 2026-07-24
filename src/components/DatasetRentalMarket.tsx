import React from 'react';
import { RentalMarketData } from '../types';
import { Home, TrendingUp, Percent, Building2, ShieldAlert, ArrowUpRight, DollarSign } from 'lucide-react';

interface DatasetRentalMarketProps {
  rentalMarket: RentalMarketData;
}

export const DatasetRentalMarket: React.FC<DatasetRentalMarketProps> = ({ rentalMarket }) => {
  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 border border-cyan-200 flex items-center justify-center font-bold shadow-xs">
            <Home className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">Carte des Loyers & Marché Locatif</h2>
              <span className="bg-cyan-50 text-cyan-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-cyan-200">
                OLL / Ministère du Logement
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">Loyer d'annonce moyen au m², estimation du rendement brut locatif et tension du marché.</p>
          </div>
        </div>

        <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-cyan-600" />
          <div className="text-left">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Tension Locative Secteur</div>
            <div className="text-xs font-black text-cyan-800">{rentalMarket.rentalTension}</div>
          </div>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Avg Rent Apartment / m2 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-1 shadow-sm">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Loyer Médian Appartement</span>
          <div className="text-2xl font-black text-cyan-700 font-serif">
            {rentalMarket.avgRentApartmentPerM2} €/m²
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Charges non comprises (médiane commune)</span>
        </div>

        {/* Avg Rent House / m2 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-1 shadow-sm">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Loyer Médian Maison</span>
          <div className="text-2xl font-black text-slate-900 font-serif">
            {rentalMarket.avgRentHousePerM2} €/m²
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Indicateur officiel du Ministère du Logement</span>
        </div>

        {/* Gross Yield % */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-1 shadow-sm">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Rendement Brut Estimé</span>
          <div className="text-2xl font-black text-emerald-700 font-serif flex items-center gap-1">
            {rentalMarket.estimatedGrossYieldPercent}% / an
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Rapport loyer annuel / prix d'achat au m²</span>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-1 shadow-sm">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Taux d'Occupation Estimé</span>
          <div className="text-2xl font-black text-slate-900 font-serif">
            {rentalMarket.occupancyRatePercent}%
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Vacance locative très faible sur la zone</span>
        </div>

      </div>

      {/* Simulated Typical Rents Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-cyan-600" />
          <span>Exemples de Loyers Mensuels Estimés par Typologie</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Studio / T1 (30 m²)</span>
              <span className="text-[11px] text-slate-500">Pour étudiant ou jeune actif</span>
            </div>
            <div className="text-xl font-black text-cyan-800 font-serif">
              ~{rentalMarket.avgRent30m2StudioEur} € / mois
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Appartement T3 (60 m²)</span>
              <span className="text-[11px] text-slate-500">Pour couple ou jeune famille</span>
            </div>
            <div className="text-xl font-black text-cyan-800 font-serif">
              ~{rentalMarket.avgRent60m2T3Eur} € / mois
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
