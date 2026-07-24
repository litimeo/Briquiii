import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      try {
        ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });
      } catch (e) {
        console.warn('Failed to construct GoogleGenAI instance:', e);
        return null;
      }
    }
  }
  return ai;
}

// Enable CORS for API routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Briquia DataGouv Aggregator', timestamp: new Date().toISOString() });
});

// AI Property Report Synthesis API Handler function
async function handleAiReportRequest(req: express.Request, res: express.Response) {
  try {
    const { propertyReport, userQuestion, chatHistory } = req.body || {};

    const gemini = getGeminiClient();

    const systemInstruction = `Vous êtes Briquia AI, un assistant IA conversationnel intelligent, chaleureux et polyvalent, spécialisé dans le conseil immobilier, l'urbanisme, la négociation et l'analyse foncière en France.

RÈGLES ET COMPORTEMENT :
1. COMPORTEMENT CONVERSATIONNEL : Soyez naturel, fluide, chaleureux et prêt à discuter, brainstormer, expliquer ou répondre à n'importe quelle question (immobilier, stratégie d'achat, finance, rénovation, négociation, culture générale ou salutations simples).
2. ADAPTATION DU TON :
   - Pour des salutations ou questions ouvertes ("Bonjour", "Aide-moi à brainstormer", "Que penses-tu de...") : Répondez avec entrain, saluez l'utilisateur de manière amicale et proposez des pistes concrètes de réflexion ou de discussion.
   - Pour des questions précises sur le bien ou le quartier : Utilisez les données de rapport fournies comme contexte pour donner des réponses ultra-précises, chiffrées et pertinentes.
   - Pour une demande de synthèse générale : Présentez une analyse structurée et claire de l'emplacement.
3. NE MENTIONNEZ PAS le jargon technique de sous-sol (ex: "tables SQL", "bases de données internes", "datasets raw", etc.). Parlez naturellement en expert et compagnon de projet.
4. Répondez toujours clairement dans la langue de l'utilisateur (principalement le français).`;

    const fullPrompt = `Propriété / Emplacement analysé en contexte (si pertinent) :
Adresse : ${propertyReport?.address?.address || 'Non spécifiée'}
Indice Briquia : ${propertyReport?.briquiaIndexScore || 80}/100 (${propertyReport?.ratingLabel || 'Standard'})

Chiffres clés du bien :
- Prix moyen rue (DVF) : ${propertyReport?.dvf?.medianPricePerM2Street} €/m²
- Loyer estimé : ${propertyReport?.rentalMarket?.avgRentApartmentPerM2} €/m² (Rendement ~${propertyReport?.rentalMarket?.estimatedGrossYieldPercent}%)
- DPE : Énergie ${propertyReport?.dpe?.energyRating} / Climat ${propertyReport?.dpe?.climateRating} (Passoire : ${propertyReport?.dpe?.isPassoireThermique ? 'Oui' : 'Non'})
- Risques : Niveau ${propertyReport?.georisques?.riskScoreNumber}/10 (Inondation PPRI: ${propertyReport?.georisques?.floodRisk?.inPpriZone ? 'Oui' : 'Non'})
- Sécurité : Indice ${propertyReport?.safetySecurity?.securityIndexScore}/100 (${propertyReport?.safetySecurity?.relativeLevel})
- Permis de construire : ${propertyReport?.constructionPermits?.totalPermits500m || 12} permis à 500m (${propertyReport?.constructionPermits?.constructionActivityLevel || 'Activité Modérée'})
- Qualité de vie : ${propertyReport?.qualityOfLife?.overallScore || 75}/100 (Commerces ${propertyReport?.qualityOfLife?.categories?.commerces?.score}, Transports ${propertyReport?.qualityOfLife?.categories?.transports?.score}, Santé ${propertyReport?.qualityOfLife?.categories?.sante?.score})

${chatHistory && chatHistory.length > 0 ? `Historique récent de la discussion :\n${chatHistory.map((h: any) => `${h.sender === 'user' ? 'Utilisateur' : 'Briquia AI'}: ${h.text}`).join('\n')}\n` : ''}

Dernier message de l'utilisateur : "${userQuestion || 'Bonjour, fais-moi une présentation de ce bien et de ce secteur.'}"`;

    if (gemini) {
      try {
        const response = await gemini.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: fullPrompt,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const textOutput = response.text || generateFallbackSynthesis(propertyReport, userQuestion);
        return res.status(200).json({ synthesis: textOutput });
      } catch (geminiErr: any) {
        console.warn('Gemini API call failed, using fallback synthesis:', geminiErr?.message);
      }
    }

    // Fallback if Gemini key is missing or call fails
    const fallbackText = generateFallbackSynthesis(propertyReport, userQuestion);
    return res.status(200).json({ synthesis: fallbackText });

  } catch (err: any) {
    console.error('Error in AI Report endpoint:', err);
    return res.status(200).json({
      synthesis: generateFallbackSynthesis(req.body?.propertyReport, req.body?.userQuestion),
    });
  }
}

// AI Property Report Synthesis API Endpoints (supporting multiple Vercel rewrite URLs)
app.post(['/api/ai/report', '/ai/report', '/api/report', '/api'], handleAiReportRequest);

function generateFallbackSynthesis(report: any, question?: string): string {
  const addr = report?.address?.address || 'Emplacement analysé';
  const score = report?.briquiaIndexScore || 80;
  const dvf = report?.dvf;
  const dpe = report?.dpe;
  const georisques = report?.georisques;
  const rental = report?.rentalMarket;

  if (question) {
    const qLower = question.toLowerCase().trim();

    if (qLower.includes('bonjour') || qLower.includes('salut') || qLower.includes('hello') || qLower.includes('coucou') || qLower.includes('qui es-tu') || qLower.includes('comment vas')) {
      return `Bonjour ! 👋 Je suis **Briquia AI**, votre assistant conversationnel et partenaire d'expertise pour l'immobilier, l'urbanisme et l'évaluation foncière.

Comment puis-je vous aider aujourd'hui concernant l'adresse **${addr}** ou tout autre sujet ?
- **Brainstormer** des idées de valorisation ou de stratégie d'achat
- Calculer et optimiser vos leviers de **négociation de prix**
- Analyser le quartier, l'urbanisme et la **qualité de vie**
- Répondre à vos questions libres et discuter de votre projet !`;
    }

    if (qLower.includes('brainstorm') || qLower.includes('idée') || qLower.includes('projet') || qLower.includes('conseil') || qLower.includes('stratégie')) {
      return `💡 **Brainstorming & Pistes d'Action pour ${addr}** :

Voici 4 axes stratégiques sur lesquels nous pouvons travailler ensemble :

1. **Rénovation & Plus-Value Verte** :
   ${dpe?.isPassoireThermique ? `Le logement étant classé passoire énergétique (${dpe?.energyRating}), il y a un fort potentiel d'achat décoté. En chiffrant les travaux d'isolation, vous créez une plus-value nette à la revente.` : `Le DPE est en classe ${dpe?.energyRating || 'D'}, ce qui permet de cibler des améliorations ciblées (pompe à chaleur, domotique) pour maximiser la rentabilité.`}

2. **Ancrage de Négociation DVF** :
   Le prix moyen constaté dans la rue est de **${dvf?.medianPricePerM2Street || 4200} €/m²**. Si le vendeur demande plus, nous pouvons bâtir un dossier argumenté fondé sur les actes notariés récents.

3. **Transformation du Quartier** :
   Il y a **${report?.constructionPermits?.totalPermits500m || 12} permis de construire** enregistrés dans un rayon de 500m, ce qui témoigne d'un dynamisme et d'un renouvellement urbain prometteur.

4. **Rentabilité Locative** :
   Loyer moyen estimé à **${rental?.avgRentApartmentPerM2 || 18} €/m²** pour un rendement brut d'environ **${rental?.estimatedGrossYieldPercent || 5}%**.

Quel sujet souhaitez-vous approfondir ou brainstormer en priorité ?`;
    }

    if (qLower.includes('négoci') || qLower.includes('prix') || qLower.includes('achat') || qLower.includes('argument')) {
      return `💡 **Stratégie & Leviers de Négociation pour ${addr}** :

1. **Passoire Énergétique & Travaux (DPE ${dpe?.energyRating || 'D'})** :
   ${dpe?.isPassoireThermique ? `Le logement étant classé passoire thermique (${dpe?.energyRating}), l'interdiction de mise en location à venir constitue votre levier prioritaire. Exigez un devis de travaux d'isolation (estimé entre 15 000€ et 30 000€) pour négocier une réduction directe équivalente sur le prix de vente.` : `Le bien est en classe DPE ${dpe?.energyRating}, ce qui est satisfaisant. Les arguments de négociation se concentreront sur les finitions et le prix au m².`}

2. **Écart de Prix Notarié DVF** :
   Dans cette rue, le prix médian notarié constaté est de **${dvf?.medianPricePerM2Street || 4200} €/m²**. Comparez le prix affiché par le vendeur à ce niveau de transaction réel. Tout écart supérieur à +5% par rapport au prix DVF moyen est un argument solide pour faire baisser l'offre.

3. **Risques Naturels & Assurance (Indice ${georisques?.riskScoreNumber || 3}/10)** :
   ${georisques?.floodRisk?.inPpriZone ? `Le bien est situé en zone d'aléa inondation PPRI, ce qui engendre des contraintes constructives et des surprimes d'assurance. Mettez ce point en avant dans vos discussions.` : `Le niveau d'aléa naturel est mesuré comme faible (${georisques?.overallRiskLevel || 'Faible'}), assurant une bonne valeur de revente.`}

4. **Rentabilité Locative & Rendement** :
   Le loyer médian estimé est de **${rental?.avgRentApartmentPerM2 || 18} €/m²**, offrant un rendement brut indicatif de **${rental?.estimatedGrossYieldPercent || 5}%**.`;
    }

    if (qLower.includes('dpe') || qLower.includes('renov') || qLower.includes('travaux') || qLower.includes('énerg')) {
      return `⚡ **Analyse Énergétique & Rénovation pour ${addr}** :

- **Diagnostic Officiel** : Classement **DPE ${dpe?.energyRating || 'D'}** (${dpe?.consumptionKwhM2Year || 210} kWh/m²/an).
- **Émissions de GES** : Indice Climat **${dpe?.climateRating || 'C'}** (${dpe?.co2EmissionsKgM2Year || 45} kg CO2/m²/an).
- **Facture Énergétique Estimée** : Entre **${dpe?.estimatedAnnualCostMin || 1200} €** et **${dpe?.estimatedAnnualCostMax || 1600} €** par an.
- **État des Parois** : Murs (${dpe?.insulationQuality?.walls || 'Moyenne'}), Toiture (${dpe?.insulationQuality?.roof || 'Moyenne'}), Fenêtres (${dpe?.insulationQuality?.windows || 'Double Vitrage'}).
- **Statut Réglementaire** : ${dpe?.isPassoireThermique ? `⚠️ Classé en Passoire Thermique. Interdiction de mise en location prévue. Travaux d'isolation thermique prioritaires conseillés avant tout projet locatif.` : `✅ Bien conforme aux standards de décence énergétique.`}`;
    }

    if (qLower.includes('risque') || qLower.includes('inondation') || qLower.includes('argile')) {
      return `🛡️ **Risques Naturels & Qualité Environnementale pour ${addr}** :

- **Indice de Risque Synthétique** : **${georisques?.riskScoreNumber || 3}/10** (${georisques?.overallRiskLevel || 'Faible'}).
- **Risque Inondation (PPRI)** : ${georisques?.floodRisk?.inPpriZone ? '⚠️ Présence d\'un Plan de Prévention des Risques Inondation (PPRI).' : '✅ Emplacement situé hors zone PPRI prioritaire.'}
- **Retrait-Gonflement des Argiles** : Niveau **${georisques?.claySoilRisk?.level || 'Faible'}**.
- **Qualité de l'Eau Potable (ARS)** : **${report?.waterQuality?.complianceBacterialPercent || 100}% de conformité** (${report?.waterQuality?.overallSanitaryStatus || 'Excellente Qualité'}).
- **Tranquillité SSMSI** : Score de sérénité du quartier de **${report?.safetySecurity?.securityIndexScore || 85}/100**.`;
    }

    return `Analyse personnalisée Briquia AI pour **${addr}** (Indice global : ${score}/100) :

• **Valorisation DVF** : Prix médian notarié à **${dvf?.medianPricePerM2Street || 4200} €/m²** dans la rue.
• **Marché Locatif** : Loyer moyen à **${rental?.avgRentApartmentPerM2 || 18} €/m²** pour un rendement brut estimé de **${rental?.estimatedGrossYieldPercent || 5}%**.
• **Performance DPE** : Énergie classe **${dpe?.energyRating || 'D'}**, avec une dépense annuelle estimée de ${dpe?.estimatedAnnualCostMin || 1100}€ à ${dpe?.estimatedAnnualCostMax || 1500}€.
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

🏙️ **Cadre de Vie & Sécurité du Quartier**
- Indice de sérénité publique SSMSI : **${report?.safetySecurity?.securityIndexScore || 85}/100** (${report?.safetySecurity?.relativeLevel || 'Fort Niveau de Sérénité'}).
- Revenu médian annuel des ménages (INSEE) : **${report?.insee?.medianAnnualIncomeEur || 28500} €/an**.
- Accessibilité : **WalkScore ${report?.pluAmenities?.walkScore || 88}/100** (Zone PLU ${report?.pluAmenities?.pluZoneCode || 'U'}).

💡 **Stratégie de Négociation & Recommandations Acquéreur**
1. ${dpe?.isPassoireThermique ? 'Chiffrez précisément le coût d\'isolation (DPE F/G) pour exiger une réfaction de prix équivalente.' : 'Le DPE est favorable, concentrez votre négociation sur l\'écart entre le prix demandé et la valeur médiane DVF.'}
2. Présentez l\'historique DVF des ventes récentes de la rue comme argument d\'ancrage lors de votre première proposition.
3. Exploitates la transparence des indicateurs d\'urbanisme et de sécurité pour conforter la valeur de revente à terme.`;
}

async function startServer() {
  const distPath = path.join(process.cwd(), 'dist');
  const hasDistIndex = fs.existsSync(path.join(distPath, 'index.html'));
  const isProduction = process.env.NODE_ENV === 'production' || hasDistIndex;

  if (isProduction && hasDistIndex) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.warn('Failed to load Vite middleware, falling back to static dist if available:', err);
      if (hasDistIndex) {
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
          res.sendFile(path.join(distPath, 'index.html'));
        });
      }
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Briquia DataGouv server running on http://0.0.0.0:${PORT}`);
  });
}

export default app;

if (process.env.NODE_ENV !== 'test') {
  startServer();
}
