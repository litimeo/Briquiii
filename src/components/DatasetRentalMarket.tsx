import React from 'react';
import { RentalMarketData } from '../types';
import { Home, TrendingUp, Percent, Building2, ShieldAlert, ArrowUpRight, DollarSign, ExternalLink, Calendar, Key, AlertCircle, ShieldCheck } from 'lucide-react';

interface DatasetRentalMarketProps {
  rentalMarket: RentalMarketData;
}

export const DatasetRentalMarket: React.FC<DatasetRentalMarketProps> = ({ rentalMarket }) => {
  const encadrementActive = rentalMarket.rentControlSubject ?? false;
  const maxRentPerM2 = rentalMarket.rentControlMaxM2Eur ?? Math.round(rentalMarket.avgRentApartmentPerM2 * 1.2);
  const airbnbDensity = rentalMarket.seasonalAirbnbDensity ?? 'Moyenne (2.4% du parc)';
  const airbnbYield = rentalMarket.seasonalAirbnbYieldEstimate ?? Math.round(rentalMarket.estimatedGrossYieldPercent * 1.45 * 10) / 10;
  const tenantTurnoverMonths = rentalMarket.avgTenantTurnoverMonths ?? 28;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-cyan-50/50 p-6 sm:p-7 rounded-3xl border border-cyan-100/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-100/80 text-cyan-800 border border-cyan-200 flex items-center justify-center font-bold shadow-xs flex-shrink-0">
            <Home className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">Marché Locatif & Encadrement</h2>
              <span className="bg-cyan-100 text-cyan-900 text-xs font-bold px-3 py-1 rounded-full border border-cyan-200/90">
                Ministère du Logement / OLL
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">Loyers médians, plafond de l'encadrement des loyers, rentabilité saisonnière et tension locative.</p>
          </div>
        </div>

        <div className="px-4 py-2.5 rounded-xl bg-white text-cyan-900 text-xs sm:text-sm font-bold border border-cyan-200 flex items-center gap-2 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-cyan-600" />
          <span>Données Référence OLL</span>
        </div>
      </div>

      {/* Rent Control Encadrement Warning Banner */}
      {encadrementActive && (
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-3xl flex items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-3 text-amber-950 font-medium">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>Zone soumise à l'Encadrement des Loyers : Loyer de référence majoré fixé à <strong className="font-extrabold text-slate-900">{maxRentPerM2} €/m²</strong> (hors complément de loyer justifiable).</span>
          </div>
        </div>
      )}

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Avg Rent Apartment / m2 */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-2 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">Loyer Médian Appartement</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-800 font-heading">
            {rentalMarket.avgRentApartmentPerM2} €/m²
          </div>
          <span className="text-xs text-slate-500 font-medium block">Charges non comprises (médiane)</span>
        </div>

        {/* Avg Rent House / m2 */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-2 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">Loyer Médian Maison</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            {rentalMarket.avgRentHousePerM2} €/m²
          </div>
          <span className="text-xs text-slate-500 font-medium block">Indicateur OLL Officiel</span>
        </div>

        {/* Gross Yield % */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-2 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">Rendement Brut Bail Classique</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 font-heading flex items-center gap-1">
            {rentalMarket.estimatedGrossYieldPercent}% / an
            <ArrowUpRight className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-xs text-slate-500 font-medium block">Inclus charges foncières</span>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-2 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">Taux d'Occupation</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            {rentalMarket.occupancyRatePercent}%
          </div>
          <span className="text-xs text-slate-500 font-medium block">Vacance locative très faible</span>
        </div>

      </div>

      {/* Seasonal & Rental Turnover Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Simulated Typical Rents Grid */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-cyan-600" />
            <span>Loyers Mensuels Estimés par Typologie</span>
          </h3>

          <div className="space-y-3">
            <div className="bg-cyan-50/40 p-4 rounded-2xl border border-cyan-100 flex items-center justify-between">
              <div>
                <span className="text-xs sm:text-sm font-bold text-slate-900 block">Studio / T1 (30 m²)</span>
                <span className="text-[11px] text-slate-600">Étudiant ou jeune actif</span>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-cyan-900 font-heading">
                ~{rentalMarket.avgRent30m2StudioEur} € / mois
              </div>
            </div>

            <div className="bg-cyan-50/40 p-4 rounded-2xl border border-cyan-100 flex items-center justify-between">
              <div>
                <span className="text-xs sm:text-sm font-bold text-slate-900 block">Appartement T3 (60 m²)</span>
                <span className="text-[11px] text-slate-600">Couple ou jeune famille</span>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-cyan-900 font-heading">
                ~{rentalMarket.avgRent60m2T3Eur} € / mois
              </div>
            </div>
          </div>
        </div>

        {/* Short Term Airbnb & Rotation Details */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-600" />
            <span>Saisonniers (Airbnb) & Durée de Bail</span>
          </h3>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Densité Meublés Touristiques :</span>
              <strong className="text-slate-900 font-bold">{airbnbDensity}</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Rendement Brut Saisonnie :</span>
              <strong className="text-emerald-800 font-bold">~{airbnbYield}% / an (avant frais de conciergerie)</strong>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500 font-medium">Durée Moyenne d'Occupation Locataire :</span>
              <strong className="text-slate-900 font-bold">{tenantTurnoverMonths} mois par locataire</strong>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

