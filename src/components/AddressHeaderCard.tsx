import React from 'react';
import { PropertyReport } from '../types';
import { MapPin, AlertTriangle, CheckCircle2, Printer, Sparkles, Building2, TrendingUp, Zap, ShieldAlert, Users, Compass, Search, Home, Droplets, ShieldCheck } from 'lucide-react';

interface AddressHeaderCardProps {
  report: PropertyReport;
  onOpenAiSynthesis: () => void;
  onResetAddress?: () => void;
}

export const AddressHeaderCard: React.FC<AddressHeaderCardProps> = ({ report, onOpenAiSynthesis, onResetAddress }) => {
  const score = report.briquiaIndexScore;

  // SVG Radial Gauge offset math (radius = 36, circumference = 2 * PI * 36 ≈ 226)
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (s: number) => {
    if (s >= 80) return { stroke: '#059669', text: 'text-emerald-700', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    if (s >= 65) return { stroke: '#2563eb', text: 'text-blue-700', badge: 'bg-blue-50 text-blue-800 border-blue-200' };
    if (s >= 50) return { stroke: '#d97706', text: 'text-amber-700', badge: 'bg-amber-50 text-amber-800 border-amber-200' };
    return { stroke: '#e11d48', text: 'text-rose-700', badge: 'bg-rose-50 text-rose-800 border-rose-200' };
  };

  const scoreTheme = getScoreColor(score);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden space-y-6">
      
      {/* Background Subtle Gradient Accent */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-50/80 rounded-full blur-3xl pointer-events-none" />

      {/* Top Main Header Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        
        {/* Address & Meta Info */}
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Adresse Référencée</span>
            </span>
            <span className="bg-slate-100 text-slate-700 text-xs font-mono font-bold px-3 py-1 rounded-full border border-slate-200">
              Parcelle: {report.ban.parcelId}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Rapport Certifié du {report.reportGeneratedAt}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 font-serif tracking-tight leading-tight">
            {report.address.address}
          </h1>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-600 flex-wrap">
            <span>{report.address.postcode} {report.address.city}</span>
            <span className="text-slate-300">•</span>
            <span>{report.address.department}</span>
            <span className="text-slate-300">•</span>
            <span className="text-blue-700 font-mono font-medium">
              Coordonnées GPS: {report.address.lat.toFixed(4)}, {report.address.lon.toFixed(4)}
            </span>
          </div>
        </div>

        {/* Briquia Property Index Radial Gauge */}
        <div className="flex items-center gap-5 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 self-stretch sm:self-auto justify-between sm:justify-start shadow-xs">
          <div className="text-right space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Indice Foncier Briquia</span>
            <div className={`text-xs font-black px-2.5 py-0.5 rounded-full border inline-block ${scoreTheme.badge}`}>
              {report.ratingLabel}
            </div>
            <span className="text-[10px] text-slate-500 block">Synthèse Globale 9 Axes</span>
          </div>

          {/* Radial Gauge SVG */}
          <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
            <svg className="w-20 h-20 -rotate-90 transform" viewBox="0 0 80 80">
              {/* Background circle */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                className="text-slate-200"
                strokeWidth="7"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Progress circle */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                stroke={scoreTheme.stroke}
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={`text-xl font-black font-serif leading-none ${scoreTheme.text}`}>{score}</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase">/100</span>
            </div>
          </div>
        </div>

      </div>

      {/* 9 Core Property Indicators Bento Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2 pt-2 border-t border-slate-200">
        
        {/* Terrain */}
        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <div className="overflow-hidden text-left">
            <span className="block text-[8px] text-slate-500 font-bold uppercase">Cadastre</span>
            <span className="text-[10px] font-extrabold text-slate-900 truncate block">{report.ban.parcelAreaM2} m²</span>
          </div>
        </div>

        {/* Prix / m2 */}
        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <div className="overflow-hidden text-left">
            <span className="block text-[8px] text-slate-500 font-bold uppercase">Prix Vente</span>
            <span className="text-[10px] font-extrabold text-emerald-700 truncate block">{report.dvf.medianPricePerM2Street.toLocaleString('fr-FR')} €/m²</span>
          </div>
        </div>

        {/* Loyers */}
        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 flex items-center gap-2">
          <Home className="w-4 h-4 text-cyan-600 flex-shrink-0" />
          <div className="overflow-hidden text-left">
            <span className="block text-[8px] text-slate-500 font-bold uppercase">Loyer Apt</span>
            <span className="text-[10px] font-extrabold text-cyan-700 truncate block">{report.rentalMarket.avgRentApartmentPerM2} €/m²</span>
          </div>
        </div>

        {/* Énergie DPE */}
        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <div className="overflow-hidden text-left">
            <span className="block text-[8px] text-slate-500 font-bold uppercase">Énergie DPE</span>
            <span className="text-[10px] font-extrabold text-amber-700 truncate block">Classe {report.dpe.energyRating}</span>
          </div>
        </div>

        {/* Eau Potable ARS */}
        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 flex items-center gap-2">
          <Droplets className="w-4 h-4 text-sky-600 flex-shrink-0" />
          <div className="overflow-hidden text-left">
            <span className="block text-[8px] text-slate-500 font-bold uppercase">Eau Potable</span>
            <span className="text-[10px] font-extrabold text-sky-700 truncate block">{report.waterQuality.complianceBacterialPercent}% ARS</span>
          </div>
        </div>

        {/* Risques */}
        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <div className="overflow-hidden text-left">
            <span className="block text-[8px] text-slate-500 font-bold uppercase">Aléa Risques</span>
            <span className="text-[10px] font-extrabold text-rose-700 truncate block">Aléa {report.georisques.overallRiskLevel}</span>
          </div>
        </div>

        {/* Sécurité */}
        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          <div className="overflow-hidden text-left">
            <span className="block text-[8px] text-slate-500 font-bold uppercase">Sérénité</span>
            <span className="text-[10px] font-extrabold text-indigo-700 truncate block">{report.safetySecurity.securityIndexScore}/100</span>
          </div>
        </div>

        {/* Revenus */}
        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-600 flex-shrink-0" />
          <div className="overflow-hidden text-left">
            <span className="block text-[8px] text-slate-500 font-bold uppercase">Revenu Foyer</span>
            <span className="text-[10px] font-extrabold text-slate-900 truncate block">{report.insee.medianAnnualIncomeEur.toLocaleString('fr-FR')} €/an</span>
          </div>
        </div>

        {/* Urbanisme */}
        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 flex items-center gap-2">
          <Compass className="w-4 h-4 text-teal-600 flex-shrink-0" />
          <div className="overflow-hidden text-left">
            <span className="block text-[8px] text-slate-500 font-bold uppercase">PLU Zone</span>
            <span className="text-[10px] font-extrabold text-teal-700 truncate block">{report.pluAmenities.pluZoneCode}</span>
          </div>
        </div>

      </div>

      {/* Key Highlights & Red Flags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        
        {/* Key Highlights */}
        <div className="bg-emerald-50/70 border border-emerald-200 p-4.5 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Points Forts Valides</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-800">
            {report.highlights.map((h, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Red Flags / Vigilance */}
        <div className="bg-amber-50/70 border border-amber-200 p-4.5 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Points de Vigilance & Alertes Réglementaires</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-800">
            {report.redFlags.length > 0 ? (
              report.redFlags.map((rf, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">⚠️</span>
                  <span>{rf}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-500 italic">Aucune alerte majeure détectée.</li>
            )}
          </ul>
        </div>

      </div>

      {/* Action Footer Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-200 gap-3 flex-wrap">
        <button
          onClick={onOpenAiSynthesis}
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Lancer la Synthèse IA & Leviers de Négociation</span>
        </button>

        <div className="flex items-center gap-2">
          {onResetAddress && (
            <button
              onClick={onResetAddress}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-blue-600" />
              <span>Changer d'adresse</span>
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer le Rapport</span>
          </button>
        </div>
      </div>

    </div>
  );
};
