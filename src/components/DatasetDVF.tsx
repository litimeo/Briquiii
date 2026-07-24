import React from 'react';
import { DVFData } from '../types';
import { TrendingUp, Euro, Calendar, ArrowUpRight, ArrowDownRight, Tag, ExternalLink, Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface DatasetDVFProps {
  dvf: DVFData;
}

export const DatasetDVF: React.FC<DatasetDVFProps> = ({ dvf }) => {
  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-emerald-50/50 p-6 sm:p-7 rounded-3xl border border-emerald-100/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold shadow-xs flex-shrink-0">
            <TrendingUp className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">Transactions & Prix au m²</h2>
              <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200/90">
                Actes Notariés DVF
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">Historique certifié des ventes immobilières notariées enregistrées.</p>
          </div>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Median Price / m2 Street */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-2 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">Prix Médian Rue</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 font-heading">
            {dvf.medianPricePerM2Street.toLocaleString('fr-FR')} €/m²
          </div>
          <span className="text-xs text-slate-500 font-medium block">Actes notariés récents</span>
        </div>

        {/* Median Price / m2 City */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-2 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">Prix Médian Ville</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            {dvf.medianPricePerM2City.toLocaleString('fr-FR')} €/m²
          </div>
          <div className="text-xs font-bold text-emerald-800 flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            <span>+{( ( (dvf.medianPricePerM2Street - dvf.medianPricePerM2City) / dvf.medianPricePerM2City ) * 100 ).toFixed(1)}% / moyenne ville</span>
          </div>
        </div>

        {/* 5-Year Growth Rate */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-2 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">Évolution 5 Ans</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 font-heading">
            +{dvf.fiveYearPriceGrowthPercent}% / an
          </div>
          <span className="text-xs text-slate-500 font-medium block">Croissance valeur foncière</span>
        </div>

        {/* Last Known Transaction */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-2 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">Dernière Vente</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            {dvf.lastKnownSalePrice ? `${dvf.lastKnownSalePrice.toLocaleString('fr-FR')} €` : 'N/A'}
          </div>
          <span className="text-xs text-slate-500 font-medium block">
            Signé le {dvf.lastKnownSaleDate || 'Date non spécifiée'}
          </span>
        </div>

      </div>

      {/* Recharts Price Trend Chart */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">Évolution Historique du Prix au m² (DVF)</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">Tendance des transactions foncières notariées dans le périmètre direct.</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-100/80 text-emerald-900 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200">
            <Activity className="w-4 h-4 text-emerald-700" />
            <span>Tendance Haussière</span>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dvf.historicalPriceTrend}>
              <defs>
                <linearGradient id="dvfGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} tickFormatter={(v) => `${v}€`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '16px', fontSize: '13px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                formatter={(val: any) => [`${val.toLocaleString()} €/m²`, 'Prix Moyen m²']}
              />
              <Area type="monotone" dataKey="pricePerM2" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#dvfGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Sales Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">Ventes Notariées Récentes dans le Voisinage</h3>
          <span className="text-xs sm:text-sm text-slate-600 font-semibold">{dvf.recentSales.length} Transactions Répertoriées</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 uppercase text-xs font-bold tracking-wider bg-slate-50/80">
                <th className="py-3 px-3.5">Date Mutation</th>
                <th className="py-3 px-3.5">Type Bien</th>
                <th className="py-3 px-3.5">Surface</th>
                <th className="py-3 px-3.5">Pièces</th>
                <th className="py-3 px-3.5">Prix de Vente</th>
                <th className="py-3 px-3.5">Prix au m²</th>
                <th className="py-3 px-3.5">Distance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {dvf.recentSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-3.5 text-slate-600 font-mono font-medium">{sale.date}</td>
                  <td className="py-3.5 px-3.5 font-bold text-slate-900">{sale.type}</td>
                  <td className="py-3.5 px-3.5 text-slate-700">{sale.surfaceM2} m²</td>
                  <td className="py-3.5 px-3.5 text-slate-600">{sale.rooms} p.</td>
                  <td className="py-3.5 px-3.5 font-extrabold text-slate-900">{sale.price.toLocaleString('fr-FR')} €</td>
                  <td className="py-3.5 px-3.5 font-extrabold text-emerald-800">{sale.pricePerM2.toLocaleString('fr-FR')} €/m²</td>
                  <td className="py-3.5 px-3.5 text-slate-600 font-medium">
                    {sale.distanceMeters === 0 ? <span className="bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-md text-xs font-bold border border-emerald-200">Même Parcelle</span> : `${sale.distanceMeters}m`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
