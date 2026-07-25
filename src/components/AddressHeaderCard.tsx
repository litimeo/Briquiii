import React from 'react';
import { PropertyReport } from '../types';
import { MapPin, AlertTriangle, CheckCircle2, Printer, Sparkles, Building2, TrendingUp, Zap, ShieldAlert, Users, Compass, Search, Home, Droplets, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { RingProgress, Text, Badge, Group, Tooltip, Paper } from '@mantine/core';
import { motion } from 'framer-motion';

interface AddressHeaderCardProps {
  report: PropertyReport;
  onOpenAiSynthesis: () => void;
  onResetAddress?: () => void;
}

export const AddressHeaderCard: React.FC<AddressHeaderCardProps> = ({ report, onOpenAiSynthesis, onResetAddress }) => {
  const score = report.briquiaIndexScore;

  const getScoreMantineColor = (s: number) => {
    if (s >= 80) return 'teal';
    if (s >= 65) return 'blue';
    if (s >= 50) return 'yellow';
    return 'red';
  };

  const scoreMantineColor = getScoreMantineColor(score);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/90 p-6 sm:p-8 md:p-9 shadow-sm relative overflow-hidden space-y-8"
    >
      
      {/* Background Decorative Radial Gradient */}
      <div className="absolute -right-16 -top-16 w-96 h-96 bg-gradient-to-br from-blue-100/50 via-teal-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top Main Header Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        
        {/* Address & Meta Info */}
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <Badge variant="light" color="blue" size="lg" radius="xl" leftSection={<MapPin className="w-3.5 h-3.5" />}>
              Adresse Référencée
            </Badge>
            <Badge variant="outline" color="gray" size="md" radius="xl" className="font-mono">
              Parcelle: {report.ban.parcelId}
            </Badge>
            <span className="text-xs text-slate-500 font-medium">
              Rapport Certifié du {report.reportGeneratedAt}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 font-heading tracking-tight leading-tight">
            {report.address.address}
          </h1>

          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm font-semibold text-slate-600 flex-wrap">
            <span className="text-slate-800">{report.address.postcode} {report.address.city}</span>
            <span className="text-slate-300">•</span>
            <span>{report.address.department}</span>
            <span className="text-slate-300">•</span>
            <span className="text-blue-700 font-mono font-bold bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100">
              GPS: {report.address.lat.toFixed(4)}, {report.address.lon.toFixed(4)}
            </span>
          </div>
        </div>

        {/* Signal Immo Property Index Radial Gauge (Mantine RingProgress) */}
        <Paper radius="2xl" p="md" withBorder className="bg-gradient-to-br from-slate-50/90 to-white flex items-center gap-5 shadow-xs border-slate-200/90 self-stretch sm:self-auto justify-between sm:justify-start">
          <div className="text-right space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block font-heading">Indice Foncier Signal Immo</span>
            <div>
              <Badge color={scoreMantineColor} size="lg" variant="filled" radius="xl" className="font-bold">
                {report.ratingLabel}
              </Badge>
            </div>
            <span className="text-xs text-slate-500 block font-medium mt-1">Synthèse Globale 9 Axes</span>
          </div>

          {/* Mantine RingProgress */}
          <div className="flex-shrink-0">
            <RingProgress
              size={90}
              thickness={9}
              roundCaps
              sections={[{ value: score, color: scoreMantineColor }]}
              label={
                <Text ta="center" fz="xl" fw={900} className="font-heading leading-none">
                  {score}
                  <Text span fz="xs" c="dimmed" display="block" fw={700}>
                    /100
                  </Text>
                </Text>
              }
            />
          </div>
        </Paper>

      </div>

      {/* 9 Core Property Indicators Bento Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2.5 pt-4 border-t border-slate-200/80">
        
        {/* Terrain */}
        <div className="bg-sky-50/70 p-3 rounded-2xl border border-sky-100/90 flex items-center gap-2.5 hover:bg-sky-100/60 transition-colors">
          <div className="w-8 h-8 rounded-xl bg-sky-200/70 text-sky-800 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="overflow-hidden text-left">
            <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Cadastre</span>
            <span className="text-xs sm:text-sm font-extrabold text-slate-900 truncate block">{report.ban.parcelAreaM2} m²</span>
          </div>
        </div>

        {/* Prix / m2 */}
        <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100/90 flex items-center gap-2.5 hover:bg-emerald-100/60 transition-colors">
          <div className="w-8 h-8 rounded-xl bg-emerald-200/70 text-emerald-800 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="overflow-hidden text-left">
            <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Prix Vente</span>
            <span className="text-xs sm:text-sm font-extrabold text-emerald-800 truncate block">{report.dvf.medianPricePerM2Street.toLocaleString('fr-FR')} €/m²</span>
          </div>
        </div>

        {/* Loyers */}
        <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-100/90 flex items-center gap-2.5 hover:bg-blue-100/60 transition-colors">
          <div className="w-8 h-8 rounded-xl bg-blue-200/70 text-blue-800 flex items-center justify-center flex-shrink-0">
            <Home className="w-4 h-4" />
          </div>
          <div className="overflow-hidden text-left">
            <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Loyer Apt</span>
            <span className="text-xs sm:text-sm font-extrabold text-blue-800 truncate block">{report.rentalMarket.avgRentApartmentPerM2} €/m²</span>
          </div>
        </div>

        {/* Énergie DPE */}
        <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-100/90 flex items-center gap-2.5 hover:bg-amber-100/60 transition-colors">
          <div className="w-8 h-8 rounded-xl bg-amber-200/70 text-amber-800 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div className="overflow-hidden text-left">
            <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">DPE</span>
            <span className="text-xs sm:text-sm font-extrabold text-amber-900 truncate block">Classe {report.dpe.energyRating}</span>
          </div>
        </div>

        {/* Eau Potable ARS */}
        <div className="bg-cyan-50/70 p-3 rounded-2xl border border-cyan-100/90 flex items-center gap-2.5 hover:bg-cyan-100/60 transition-colors">
          <div className="w-8 h-8 rounded-xl bg-cyan-200/70 text-cyan-800 flex items-center justify-center flex-shrink-0">
            <Droplets className="w-4 h-4" />
          </div>
          <div className="overflow-hidden text-left">
            <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Eau Potable</span>
            <span className="text-xs sm:text-sm font-extrabold text-cyan-800 truncate block">{report.waterQuality.complianceBacterialPercent}%</span>
          </div>
        </div>

        {/* Risques */}
        <div className="bg-rose-50/70 p-3 rounded-2xl border border-rose-100/90 flex items-center gap-2.5 hover:bg-rose-100/60 transition-colors">
          <div className="w-8 h-8 rounded-xl bg-rose-200/70 text-rose-800 flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="overflow-hidden text-left">
            <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Aléa Risques</span>
            <span className="text-xs sm:text-sm font-extrabold text-rose-800 truncate block">Aléa {report.georisques.overallRiskLevel}</span>
          </div>
        </div>

        {/* Sécurité */}
        <div className="bg-violet-50/70 p-3 rounded-2xl border border-violet-100/90 flex items-center gap-2.5 hover:bg-violet-100/60 transition-colors">
          <div className="w-8 h-8 rounded-xl bg-violet-200/70 text-violet-800 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="overflow-hidden text-left">
            <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Sérénité</span>
            <span className="text-xs sm:text-sm font-extrabold text-violet-800 truncate block">{report.safetySecurity.securityIndexScore}/100</span>
          </div>
        </div>

        {/* Revenus */}
        <div className="bg-indigo-50/70 p-3 rounded-2xl border border-indigo-100/90 flex items-center gap-2.5 hover:bg-indigo-100/60 transition-colors">
          <div className="w-8 h-8 rounded-xl bg-indigo-200/70 text-indigo-800 flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div className="overflow-hidden text-left">
            <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Revenu Foyer</span>
            <span className="text-xs sm:text-sm font-extrabold text-indigo-900 truncate block">{report.insee.medianAnnualIncomeEur.toLocaleString('fr-FR')} €</span>
          </div>
        </div>

        {/* Urbanisme */}
        <div className="bg-teal-50/70 p-3 rounded-2xl border border-teal-100/90 flex items-center gap-2.5 hover:bg-teal-100/60 transition-colors">
          <div className="w-8 h-8 rounded-xl bg-teal-200/70 text-teal-800 flex items-center justify-center flex-shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <div className="overflow-hidden text-left">
            <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">PLU Zone</span>
            <span className="text-xs sm:text-sm font-extrabold text-teal-800 truncate block">{report.pluAmenities.pluZoneCode}</span>
          </div>
        </div>

      </div>

      {/* Key Highlights & Red Flags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        
        {/* Key Highlights */}
        <div className="bg-emerald-50/70 border border-emerald-200/90 p-5 sm:p-6 rounded-3xl space-y-3 shadow-2xs">
          <div className="flex items-center gap-2.5 text-emerald-900 text-xs sm:text-sm font-extrabold uppercase tracking-wider font-heading">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Points Forts Valides</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-800">
            {report.highlights.map((h, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold text-base leading-none mt-0.5">✓</span>
                <span className="leading-relaxed">{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Red Flags / Vigilance */}
        <div className="bg-amber-50/70 border border-amber-200/90 p-5 sm:p-6 rounded-3xl space-y-3 shadow-2xs">
          <div className="flex items-center gap-2.5 text-amber-900 text-xs sm:text-sm font-extrabold uppercase tracking-wider font-heading">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>Points de Vigilance & Alertes Réglementaires</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-800">
            {report.redFlags.length > 0 ? (
              report.redFlags.map((rf, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-amber-600 font-bold text-base leading-none mt-0.5">⚠️</span>
                  <span className="leading-relaxed">{rf}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-500 italic text-xs sm:text-sm">Aucune alerte majeure détectée.</li>
            )}
          </ul>
        </div>

      </div>

      {/* Action Footer Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-4 border-t border-slate-200/80 gap-3 sm:gap-4">
        <button
          onClick={onOpenAiSynthesis}
          className="btn-glow w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 sm:gap-2.5 shadow-lg"
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200 shrink-0" />
          <span>Lancer la Synthèse IA & Leviers de Négociation</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {onResetAddress && (
            <button
              onClick={onResetAddress}
              className="flex-1 sm:flex-initial px-3.5 sm:px-4.5 py-2.5 sm:py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-bold border border-slate-300/80 flex items-center justify-center gap-1.5 sm:gap-2 transition-colors shadow-2xs whitespace-nowrap"
            >
              <Search className="w-4 h-4 text-[#f56902] shrink-0" />
              <span className="hidden min-[380px]:inline">Changer d'adresse</span>
              <span className="min-[380px]:hidden">Changer</span>
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="flex-1 sm:flex-initial px-3.5 sm:px-4.5 py-2.5 sm:py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-bold border border-slate-300/80 flex items-center justify-center gap-1.5 sm:gap-2 transition-colors shadow-2xs whitespace-nowrap"
          >
            <Printer className="w-4 h-4 text-slate-700 shrink-0" />
            <span className="hidden min-[380px]:inline">Imprimer le Rapport</span>
            <span className="min-[380px]:hidden">Imprimer</span>
          </button>
        </div>
      </div>

    </motion.div>
  );
};

