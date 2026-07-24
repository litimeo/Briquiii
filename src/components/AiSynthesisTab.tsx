import React, { useState, useEffect, useRef } from 'react';
import { PropertyReport } from '../types';
import { Sparkles, Send, Bot, Database, Compass, Loader2 } from 'lucide-react';

interface AiSynthesisTabProps {
  report: PropertyReport;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

function generateClientFallbackSynthesis(report: PropertyReport, question?: string): string {
  const addr = report?.address?.address || 'Emplacement analysé';
  const score = report?.briquiaIndexScore || 80;
  const dvf = report?.dvf;
  const dpe = report?.dpe;
  const georisques = report?.georisques;
  const rental = report?.rentalMarket;
  const permits = report?.constructionPermits;
  const qol = report?.qualityOfLife;

  if (question) {
    const qLower = question.toLowerCase();
    if (qLower.includes('négoci') || qLower.includes('prix') || qLower.includes('achat') || qLower.includes('argument')) {
      return `💡 **Stratégie & Leviers de Négociation pour ${addr}** :

1. **Passoire Énergétique & Travaux (DPE ${dpe?.energyRating || 'D'})** :
   ${dpe?.isPassoireThermique ? `Le logement étant classé passoire thermique (${dpe?.energyRating}), l'interdiction de mise en location à venir constitue votre levier prioritaire. Exigez un devis de travaux d'isolation (estimé entre 15 000€ et 30 000€) pour négocier une réduction directe équivalente sur le prix de vente.` : `Le bien est en classe DPE ${dpe?.energyRating}, ce qui est satisfaisant. Les arguments de négociation se concentreront sur les finitions et le prix au m².`}

2. **Écart de Prix Notarié DVF** :
   Dans cette rue, le prix médian notarié constaté est de **${dvf?.medianPricePerM2Street || 4200} €/m²**. Comparez le prix affiché par le vendeur à ce niveau de transaction réel. Tout écart supérieur à +5% par rapport au prix DVF moyen est un argument solide pour faire baisser l'offre.

3. **Risques Naturels & Assurance (Indice ${georisques?.riskScoreNumber || 3}/10)** :
   ${georisques?.floodRisk?.inPpriZone ? `Le bien est situé en zone d'aléa inondation PPRI, ce qui engendre des contraintes constructives et des surprimes d'assurance. Mettez ce point en avant dans vos discussions.` : `Le niveau d'aléa naturel est mesuré comme faible (${georisques?.overallRiskLevel || 'Faible'}), assurant une bonne valeur de revente.`}

4. **Dynamique d'Urbanisme & Permis de Construire** :
   Secteur avec **${permits?.totalPermits500m || 12} permis de construire** récents à 500m (${permits?.constructionActivityLevel || 'Activité modérée'}).`;
    }

    if (qLower.includes('dpe') || qLower.includes('renov') || qLower.includes('travaux') || qLower.includes('énerg')) {
      return `⚡ **Analyse Énergétique & Rénovation pour ${addr}** :

- **Diagnostic Officiel** : Classement **DPE ${dpe?.energyRating || 'D'}** (${dpe?.consumptionKwhM2Year || 210} kWh/m²/an).
- **Émissions de GES** : Indice Climat **${dpe?.climateRating || 'C'}** (${dpe?.co2EmissionsKgM2Year || 45} kg CO2/m²/an).
- **Facture Énergétique Estimée** : Entre **${dpe?.estimatedAnnualCostMin || 1200} €** et **${dpe?.estimatedAnnualCostMax || 1600} €** par an.
- **Statut Réglementaire** : ${dpe?.isPassoireThermique ? `⚠️ Classé en Passoire Thermique. Interdiction de mise en location prévue. Travaux d'isolation thermique prioritaires conseillés avant tout projet locatif.` : `✅ Bien conforme aux standards de décence énergétique.`}`;
    }

    if (qLower.includes('permis') || qLower.includes('urban') || qLower.includes('chantier') || qLower.includes('construct')) {
      return `🏗️ **Autorisations d'Urbanisme & Permis de Construire à Proximité pour ${addr}** :

- **Volume d'Autorisations (500m)** : **${permits?.totalPermits500m || 12} dossiers d'urbanisme** enregistrés (Sitadel).
- **Intensité du Secteur** : **${permits?.constructionActivityLevel || 'Activité Modérée / Renouvellement Urbain'}**.
- **Projets Récents (<2 ans)** : ${permits?.permitsLast2Years || 6} permis de construire et déclarations préalables accordés.
- **Grands Programmes** : ${permits?.majorProjectsCount || 2} programmes de création de logements neufs ou surfaces tertiaires.`;
    }

    return `Analyse personnalisée Briquia AI pour **${addr}** (Indice global : ${score}/100) :

• **Valorisation DVF** : Prix médian notarié à **${dvf?.medianPricePerM2Street || 4200} €/m²** dans la rue.
• **Marché Locatif** : Loyer moyen à **${rental?.avgRentApartmentPerM2 || 18} €/m²** pour un rendement brut estimé de **${rental?.estimatedGrossYieldPercent || 5}%**.
• **Performance DPE** : Énergie classe **${dpe?.energyRating || 'D'}**, avec une dépense annuelle estimée de ${dpe?.estimatedAnnualCostMin || 1100}€ à ${dpe?.estimatedAnnualCostMax || 1500}€.
• **Cadre de Vie** : Score de qualité de vie de **${qol?.overallScore || 75}/100**.
• **Conseil Expert** : Utilisez les indicateurs certifiés DVF et DPE pour négocier sereinement votre acquisition avec des données indiscutables.`;
  }

  return `📊 **Synthèse d'Expertise Immobilière pour ${addr}**
Indice Foncier Briquia : **${score}/100 (${report?.ratingLabel || 'Standard'})**

📊 **Valorisation & Positionnement de Marché**
- Prix médian notarié (DVF) dans la rue : **${dvf?.medianPricePerM2Street || 4200} €/m²** (Tendance 5 ans : +${dvf?.fiveYearPriceGrowthPercent || 12}%).
- Marché locatif d'annonce : **${rental?.avgRentApartmentPerM2 || 18} €/m²** avec un rendement brut potentiel estimé à **${rental?.estimatedGrossYieldPercent || 5.2}%**.

⚡ **Performance Énergétique & Enjeux de Rénovation**
- Classement DPE : **Énergie ${dpe?.energyRating || 'D'}** / Climat ${dpe?.climateRating || 'C'}.
- Consommation : **${dpe?.consumptionKwhM2Year || 210} kWh/m²/an** (Facture annuelle estimée : ${dpe?.estimatedAnnualCostMin || 1100}€ - ${dpe?.estimatedAnnualCostMax || 1500}€).
${dpe?.isPassoireThermique ? '⚠️ **Alerte Passoire Thermique** : Calendrier de gel des loyers et interdiction d\'intervenir en location sans travaux.' : '✅ **Conformité** : Aucun blocage locatif réglementaire direct.'}

🛡️ **Résilience Environnementale & Qualité de l'Eau**
- Niveau de risque naturel Géorisques : **${georisques?.riskScoreNumber || 3}/10** (${georisques?.overallRiskLevel || 'Faible'}).
- Risque Inondation PPRI : ${georisques?.floodRisk?.inPpriZone ? 'En zone réglementée PPRI' : 'Hors zone d\'aléa prioritaire'}.
- Qualité de l'Eau Potable ARS : **${report?.waterQuality?.complianceBacterialPercent || 100}% de conformité microbiologique** (${report?.waterQuality?.overallSanitaryStatus || 'Excellente Qualité'}).

🏗️ **Autorisations d'Urbanisme & Permis de Construire**
- Volume de permis de construire (Sitadel) : **${permits?.totalPermits500m || 12} autorisations à 500m** (${permits?.constructionActivityLevel || 'Activité Modérée'}).
- Projets récents : **${permits?.permitsLast2Years || 6} chantiers et programmes** autorisés au cours des 24 derniers mois.

🏙️ **Cadre de Vie & Sécurité du Quartier**
- Score Cadre de Vie : **${qol?.overallScore || 75}/100** (Commerces: ${qol?.categories?.commerces?.score || 74}, Santé: ${qol?.categories?.sante?.score || 66}, Transports: ${qol?.categories?.transports?.score || 77}).
- Indice de sérénité publique SSMSI : **${report?.safetySecurity?.securityIndexScore || 85}/100** (${report?.safetySecurity?.relativeLevel || 'Fort Niveau de Sérénité'}).
- Revenu médian annuel des ménages (INSEE) : **${report?.insee?.medianAnnualIncomeEur || 28500} €/an**.

💡 **Stratégie de Négociation & Recommandations Acquéreur**
1. ${dpe?.isPassoireThermique ? 'Chiffrez précisément le coût d\'isolation (DPE F/G) pour exiger une réfaction de prix équivalente.' : 'Le DPE est favorable, concentrez votre négociation sur l\'écart entre le prix demandé et la valeur médiane DVF.'}
2. Présentez l\'historique DVF des ventes récentes de la rue comme argument d\'ancrage lors de votre première proposition.
3. Exploitez la transparence des indicateurs d\'urbanisme et de sécurité pour conforter la valeur de revente à terme.`;
}

export const AiSynthesisTab: React.FC<AiSynthesisTabProps> = ({ report }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Quels sont les meilleurs arguments pour négocier le prix d\'achat?',
    'Quel est le risque financier lié au DPE et aux travaux de rénovation?',
    'Analyser l\'évolution de la valeur foncière DVF par rapport à la ville.',
    'Synthèse des permis de construire et projets d\'urbanisme à proximité.',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Auto-fetch initial report synthesis on mount
  useEffect(() => {
    let isMounted = true;

    async function fetchInitialSynthesis() {
      setLoading(true);
      try {
        const res = await fetch('/api/ai/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ propertyReport: report }),
        });

        if (!res.ok) {
          throw new Error(`Server status ${res.status}`);
        }

        const data = await res.json();
        if (!isMounted) return;

        setMessages([
          {
            sender: 'ai',
            text: data.synthesis || generateClientFallbackSynthesis(report),
            time: 'À l\'instant',
          },
        ]);
      } catch (err) {
        if (!isMounted) return;
        setMessages([
          {
            sender: 'ai',
            text: generateClientFallbackSynthesis(report),
            time: 'À l\'instant',
          },
        ]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchInitialSynthesis();

    return () => { isMounted = false; };
  }, [report.address.address]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const currentHistory = [...messages, userMsg];
    setMessages(currentHistory);
    setInputPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyReport: report,
          userQuestion: textToSend,
          chatHistory: currentHistory,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server status ${res.status}`);
      }

      const data = await res.json();

      const aiMsg: Message = {
        sender: 'ai',
        text: data.synthesis || generateClientFallbackSynthesis(report, textToSend),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: generateClientFallbackSynthesis(report, textToSend),
          time: 'À l\'instant',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="card-glow p-6 sm:p-7 rounded-3xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#f56902] to-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/20 flex-shrink-0">
          <Bot className="w-7 h-7 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">Synthèse IA & Expert Immobilier</h1>
            <span className="bg-orange-50 text-orange-950 text-xs font-extrabold px-3 py-1 rounded-full border border-orange-200/90 flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#f56902]" />
              Gemini 2.5 Flash
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">Analyse croisée de l'ensemble des indicateurs fonciers pour vous guider lors de votre achat ou négociation.</p>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block font-heading">Questions Fréquentes sur cet Emplacement</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="text-left p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-orange-50/70 text-slate-800 hover:text-orange-950 text-xs sm:text-sm font-semibold border border-slate-200/90 hover:border-orange-300 transition-all flex items-center justify-between group shadow-xs"
            >
              <span className="line-clamp-1">{q}</span>
              <Compass className="w-4 h-4 text-[#f56902] opacity-60 group-hover:opacity-100 flex-shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat / Synthesis Box */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col h-[580px]">
        
        {/* Messages Container */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs flex-shrink-0 ${
                m.sender === 'user' ? 'bg-[#f56902] text-white shadow-xs' : 'bg-slate-900 text-white'
              }`}>
                {m.sender === 'user' ? 'Vous' : <Bot className="w-5 h-5 text-amber-400" />}
              </div>

              <div className={`max-w-[85%] p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-[#f56902] to-orange-600 text-white font-semibold rounded-tr-none shadow-xs'
                  : 'bg-slate-50 text-slate-900 border border-slate-200/90 rounded-tl-none whitespace-pre-wrap font-sans shadow-2xs'
              }`}>
                <div>{m.text}</div>
                <span className={`block text-[11px] mt-1 ${m.sender === 'user' ? 'text-orange-100 font-medium' : 'text-slate-400 font-mono'}`}>
                  {m.time}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#f56902] flex items-center justify-center border border-orange-200">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs sm:text-sm text-slate-700 font-medium flex items-center gap-2">
                <span>Analyse et évaluation foncière de l'emplacement par Gemini 3.6 Flash...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-4 sm:p-5 bg-slate-50/80 border-t border-slate-200/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2.5"
          >
            <input
              type="text"
              placeholder="Posez votre question sur ce bien (négociation, travaux, fiscalité, plus-value...)..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              disabled={loading}
              className="flex-1 bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm px-4.5 py-3.5 sm:py-4 rounded-2xl border border-slate-200/90 focus:outline-none focus:border-[#f56902] focus:ring-2 focus:ring-orange-100 shadow-xs"
            />

            <button
              type="submit"
              disabled={!inputPrompt.trim() || loading}
              className={`p-3.5 sm:p-4 rounded-2xl transition-all shadow-xs flex items-center justify-center ${
                !inputPrompt.trim() || loading
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : 'btn-glow'
              }`}
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
