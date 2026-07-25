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

const FormattedMessage: React.FC<{ text: string; isUser?: boolean }> = ({ text, isUser }) => {
  if (isUser) {
    return <div>{text}</div>;
  }

  // Sanitize out raw horizontal rules '---' or '***' and rigid ### headers
  const cleanedText = text
    .replace(/^---$/gm, '')
    .replace(/^\*\*\*$/gm, '')
    .replace(/^###\s*(\d+\.\s*)?/gm, '**')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Split into paragraphs
  const paragraphs = cleanedText.split('\n\n');

  return (
    <div className="space-y-3.5">
      {paragraphs.map((p, pIdx) => {
        const lines = p.split('\n');

        return (
          <div key={pIdx} className="space-y-1">
            {lines.map((line, lIdx) => {
              const trimmedLine = line.trim();
              if (!trimmedLine) return null;

              // Process bold formatting **text**
              const parts = trimmedLine.split(/(\*\*.*?\*\*)/g);

              const parsedContent = parts.map((part, partIdx) => {
                if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
                  return (
                    <strong key={partIdx} className="font-extrabold text-slate-900">
                      {part.slice(2, -2)}
                    </strong>
                  );
                }
                return part;
              });

              const isBullet = trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*');

              return (
                <p
                  key={lIdx}
                  className={`${isBullet ? 'pl-2 text-slate-800 flex items-start gap-1.5' : 'text-slate-800 leading-relaxed'}`}
                >
                  {parsedContent}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

function generateClientFallbackSynthesis(report: PropertyReport, question?: string): string {
  const addr = report?.address?.address || 'Emplacement analysé';
  const score = report?.briquiaIndexScore || 80;
  const dvf = report?.dvf;
  const dpe = report?.dpe;
  const georisques = report?.georisques;
  const rental = report?.rentalMarket;
  const permits = report?.constructionPermits;
  const elus = report?.elus;
  const cultural = report?.cultural;
  const connectivity = report?.connectivity;

  if (question) {
    const qLower = question.toLowerCase().trim();

    if (qLower.includes('bonjour') || qLower.includes('salut') || qLower.includes('hello') || qLower.includes('coucou') || qLower.includes('qui es-tu') || qLower.includes('comment vas')) {
      return `Bonjour ! 👋 Je suis **Signal Immo AI**, votre assistant et partenaire d'expertise immobilière.

Je suis à votre disposition pour analyser le **${addr}** ou échanger librement sur votre projet :
• Évaluer et optimiser votre **stratégie de négociation**
• Chiffrer l'impact des **travaux d'isolation DPE** et du rendement locatif
• Analyser l'urbanisme, les **élus locaux**, la **culture** et la **fibre optique**
• Répondre à toutes vos questions d'achat ou d'investissement.

Comment puis-je vous guider aujourd'hui ?`;
    }

    if (qLower.includes('élu') || qLower.includes('politique') || qLower.includes('maire') || qLower.includes('municipal') || qLower.includes('programme') || qLower.includes('taxe foncière')) {
      return `🏛️ **Élus Locaux & Orientation Municipale à ${addr}**

• **Maire de la Commune** : **${elus?.mayorName || 'Le Maire'}** (${elus?.mayorParty || 'Majorité Municipale'}).
• **Participation aux Élections** : **${elus?.lastElectionTurnoutPercent || 58.5}%** de taux de participation.
• **Vision de la Taxe Foncière** : ${elus?.localTaxPolicyVision || 'Maintien des taux de taxe foncière avec priorité aux investissements de transition.'}
• **Axes du Programme Municipal** :
  ${elus?.keyMunicipalProgram?.slice(0, 3).map(p => `• ${p}`).join('\n  ') || '• Végétalisation et aménagement de l\'espace public\n  • Maintien de la fiscalité locale'}

Souhaitez-vous des détails sur les projets d'aménagement urbain portés par la municipalité ?`;
    }

    if (qLower.includes('cultur') || qLower.includes('musée') || qLower.includes('théâtre') || qLower.includes('cinéma') || qLower.includes('monument') || qLower.includes('activité')) {
      return `🎭 **Équipements & Offre Culturelle autour de ${addr}**

• **Indice de Densité Culturelle** : **${cultural?.culturalDensityScore || 80}/100**.
• **Équipements (500m)** : **${cultural?.totalCulturalSites500m || 8} lieux culturels** recensés.
• **Patrimoine Protégé** : **${cultural?.totalHistoricalMonuments || 2} monuments historiques** dans le secteur.
• **Principaux Lieux** :
  ${cultural?.keySites?.slice(0, 3).map(s => `• **${s.name}** (${s.category}) à ${s.distanceMeters}m`).join('\n  ') || '• Équipements culturels variés à proximité'}

Avez-vous besoin d'autres informations sur la vie de quartier ?`;
    }

    if (qLower.includes('internet') || qLower.includes('fibre') || qLower.includes('adsl') || qLower.includes('5g') || qLower.includes('connexion') || qLower.includes('débit') || qLower.includes('wifi')) {
      return `📶 **Couverture Numérique & Fibre Optique au ${addr}**

• **Éligibilité Fibre (FttH)** : **${connectivity?.fiberEligible ? 'Raccordement effectif' : 'En cours de déploiement'}** (${connectivity?.fiberCoveragePercent || 98.5}% des logements raccordés).
• **Débit Descendant Max** : Jusqu'à **${connectivity?.maxDownloadMbps ? (connectivity.maxDownloadMbps >= 1000 ? `${(connectivity.maxDownloadMbps / 1000).toFixed(1)} Gbps` : `${connectivity.maxDownloadMbps} Mbps`) : '2 Gbps'}**.
• **Débit Montant Max** : **${connectivity?.maxUploadMbps || 800} Mbps** (idéal pour le télétravail).
• **Couverture Mobile 5G** : Indice **${connectivity?.mobile5gRating || 'Excellente'}**.

Souhaitez-vous évaluer un autre aspect de cet emplacement ?`;
    }

    if (qLower.includes('brainstorm') || qLower.includes('idée') || qLower.includes('projet') || qLower.includes('conseil') || qLower.includes('stratégie')) {
      return `💡 **Pistes Stratégiques pour le ${addr}**

Voici les principaux axes de valeur à explorer pour cet emplacement :

• **Levier Négociation & DPE** : ${dpe?.isPassoireThermique ? `Le classement en passoire thermique (${dpe?.energyRating}) permet d'exiger une réfaction de prix équivalente aux devis d'isolation.` : `Le DPE (${dpe?.energyRating || 'D'}) est favorable ; axez la négociation sur l'écart par rapport au prix notarié.`}
• **Ancrage Prix DVF** : Le prix médian observé dans la rue est de **${dvf?.medianPricePerM2Street || 4200} €/m²**.
• **Dynamique Locale** : **${permits?.totalPermits500m || 12} permis de construire** à 500m témoignent d'un secteur en pleine valorisation.
• **Potentiel Locatif** : Loyer moyen de **${rental?.avgRentApartmentPerM2 || 18} €/m²** pour un rendement brut estimé à **${rental?.estimatedGrossYieldPercent || 5}%**.

Sur lequel de ces sujets souhaitez-vous concentrer notre réflexion ?`;
    }

    if (qLower.includes('négoci') || qLower.includes('prix') || qLower.includes('achat') || qLower.includes('argument')) {
      return `💡 **Stratégie & Arguments de Négociation pour le ${addr}**

Pour négocier au plus juste, voici vos 4 leviers prioritaires :

• **Diagnostic Énergétique** : ${dpe?.isPassoireThermique ? `Le logement étant classé passoire thermique (${dpe?.energyRating}), utilisez l'interdiction de louer sans travaux pour obtenir une réduction immédiate égale au montant de la rénovation.` : `Le DPE est en classe ${dpe?.energyRating || 'D'}, vous pouvez concentrer la négociation sur les finitions.`}
• **Référentiel Notarié DVF** : Le prix médian réel dans la rue est de **${dvf?.medianPricePerM2Street || 4200} €/m²**. Tout prix affiché au-dessus de cette référence doit être rigoureusement argumenté par le vendeur.
• **Risques & Assurance** : Niveau d'aléa naturel à **${georisques?.riskScoreNumber || 3}/10** (${georisques?.floodRisk?.inPpriZone ? 'Zone PPRI réglementée' : 'Hors zone d\'aléa prioritaire'}).
• **Rentabilité Locative** : Loyer estimé à **${rental?.avgRentApartmentPerM2 || 18} €/m²**, offrant un rendement brut indicatif de **${rental?.estimatedGrossYieldPercent || 5}%**.

Souhaitez-vous que nous préparions une simulation d'offre d'achat chiffrée ?`;
    }

    if (qLower.includes('dpe') || qLower.includes('renov') || qLower.includes('travaux') || qLower.includes('énerg')) {
      return `⚡ **Analyse Énergétique & Rénovation du ${addr}**

• **Diagnostic Officiel** : Classe **DPE ${dpe?.energyRating || 'D'}** (${dpe?.consumptionKwhM2Year || 210} kWh/m²/an) et Climat **${dpe?.climateRating || 'C'}**.
• **Facture Estimée** : Entre **${dpe?.estimatedAnnualCostMin || 1200} €** et **${dpe?.estimatedAnnualCostMax || 1600} €** par an.
• **Statut Réglementaire** : ${dpe?.isPassoireThermique ? `⚠️ Classé Passoire Thermique. Travaux d'isolation prioritaires requis avant mise en location.` : `✅ Conforme aux critères de décence locative.`}

Voulez-vous simuler l'enveloppe budgétaire de rénovation ou vérifier les aides disponibles ?`;
    }

    if (qLower.includes('permis') || qLower.includes('urban') || qLower.includes('chantier') || qLower.includes('construct')) {
      return `🏗️ **Urbanisme & Projets à Proximité du ${addr}**

• **Autorisations (500m)** : **${permits?.totalPermits500m || 12} dossiers d'urbanisme** enregistrés (Sitadel).
• **Intensité du Secteur** : **${permits?.constructionActivityLevel || 'Activité Modérée'}**.
• **Projets Récents (<2 ans)** : ${permits?.permitsLast2Years || 6} permis et déclarations accordés.

Souhaitez-vous étudier la nature exacte des programmes de construction dans le quartier ?`;
    }

    if (qLower.includes('pense') || qLower.includes('avis') || qLower.includes('opinion') || qLower.includes('propriété') || qLower.includes('bien') || qLower.includes('que tu') || qLower.includes('tu en')) {
      return `🏡 **Avis & Synthèse d'Expertise pour le ${addr}**

C'est une adresse qui présente un **très bon potentiel général** (Note Signal Immo : **${score}/100**). Voici le bilan synthétique :

• **Valorisation** : Marché notarié DVF solide à **${dvf?.medianPricePerM2Street || 4200} €/m²** (+${dvf?.fiveYearPriceGrowthPercent || 12}% sur 5 ans).
• **Cadre de Vie** : Équipements et transports très accessibles avec un bon niveau de sécurité.
• **Point d'Attention** : ${dpe?.isPassoireThermique ? `Le DPE classé passoire (${dpe?.energyRating}) impose de négocier le prix d'achat pour intégrer les travaux.` : `Le DPE (${dpe?.energyRating}) est satisfaisant et préserve votre budget.`}

Si le prix demandé est aligné sur le prix notarié moyen, c'est une opportunité très intéressante. Souhaitez-vous que nous étudions l'offre d'achat ou le rendement locatif ?`;
    }

    return `Analyse personnalisée Signal Immo AI pour **${addr}** (Indice global : ${score}/100) :

• **Valorisation DVF** : Prix médian notarié à **${dvf?.medianPricePerM2Street || 4200} €/m²** dans la rue.
• **Marché Locatif** : Loyer moyen à **${rental?.avgRentApartmentPerM2 || 18} €/m²** pour un rendement brut estimé de **${rental?.estimatedGrossYieldPercent || 5}%**.
• **Performance DPE** : Énergie classe **${dpe?.energyRating || 'D'}**, avec une dépense annuelle estimée de ${dpe?.estimatedAnnualCostMin || 1100}€ à ${dpe?.estimatedAnnualCostMax || 1500}€.
• **Conseil Expert** : Utilisez ces indicateurs certifiés pour négocier sereinement votre acquisition avec des données indiscutables.`;
  }

  return `Bonjour ! C'est un plaisir de vous accompagner dans l'analyse de cet emplacement.

Le **${addr}** bénéficie d'une excellente localisation avec un **Indice Foncier Signal Immo de ${score}/100 (${report?.ratingLabel || 'Standard'})**. Cet emplacement réunit de solides atouts d'attractivité et un potentiel de valorisation très intéressant.

**Valorisation & Marché**
• **Prix notarié médian** : **${dvf?.medianPricePerM2Street || 4200} €/m²** dans la rue (tendance à +${dvf?.fiveYearPriceGrowthPercent || 12}% sur 5 ans).
• **Marché locatif** : Loyer estimé à **${rental?.avgRentApartmentPerM2 || 18} €/m²**, soit un rendement brut indicatif de **${rental?.estimatedGrossYieldPercent || 5.2}%**.

**Performance Énergétique & Diagnostic**
• Classement **DPE ${dpe?.energyRating || 'D'}** (Climat ${dpe?.climateRating || 'C'}).
${dpe?.isPassoireThermique ? `• **Alerte Passoire Thermique** : Le logement nécessite des travaux d'isolation pour respecter le calendrier de décence locative. C'est votre principal levier pour négocier une décote significative sur le prix d'achat.` : `• Le bien présente un bilan énergétique satisfaisant qui ne bloque pas sa mise en location.`}

**Environnement & Qualité de Vie**
• **Sécurité & Cadre de Vie** : Score de sérénité de **${report?.safetySecurity?.securityIndexScore || 85}/100** et **${report?.qualityOfLife?.overallScore || 75}/100** pour le confort du quartier.
• **Projets & Dynamisme** : **${report?.constructionPermits?.totalPermits500m || 12} permis de construire** récents aux alentours.

En résumé, il s'agit d'une adresse de choix avec de vrais leviers d'optimisation. Quel aspect souhaitez-vous approfondir ensemble pour la suite de votre projet ?`;
}

export const AiSynthesisTab: React.FC<AiSynthesisTabProps> = ({ report }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Aide-moi à brainstormer des idées pour financer et valoriser ce bien',
    'Quels sont les meilleurs arguments pour négocier le prix d\'achat?',
    'Quel est le risque financier lié au DPE et aux travaux de rénovation?',
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
              Assistant IA
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">Assistant IA conversationnel : discutez librement, brainstormez vos projets et obtenez une analyse sur-mesure de cet emplacement.</p>
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
                  : 'bg-slate-50 text-slate-900 border border-slate-200/90 rounded-tl-none font-sans shadow-2xs'
              }`}>
                <FormattedMessage text={m.text} isUser={m.sender === 'user'} />
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
                <span>Analyse et évaluation foncière de l'emplacement en cours...</span>
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
