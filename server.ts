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
  res.json({ status: 'ok', service: 'Signal Immo DataGouv Aggregator', timestamp: new Date().toISOString() });
});

// AI Property Report Synthesis API Handler function
async function handleAiReportRequest(req: express.Request, res: express.Response) {
  try {
    const { propertyReport, userQuestion, chatHistory } = req.body || {};

    const gemini = getGeminiClient();

    const systemInstruction = `Vous êtes Signal Immo AI, un conseiller et expert en intelligence foncière et en immobilier en France. Vous vous adressez directement à un investisseur ou un acquéreur de manière chaleureuse, professionnelle, fluide et parfaitement naturelle.

RÈGLES DE STYLE ET DE TYPOGRAPHIE (CRUCIALES) :
1. TON FLUIDE ET HUMAIN : Répondez comme un expert humain passionné. Pas de jargon mécanique, pas de ton automatisé.
2. PAS DE LIGNES OU SÉPARATEURS MARKDOWN : N'utilisez JAMAIS de lignes horizontales ("---"), ni de titres rigides numérotés ("### 1.", "### 2.").
3. PAS DE MENUS RIGIDES NI D'OPTIONS SANS ÂME : Ne proposez JAMAIS de listes "Option A", "Option B", "Option C". Concluez toujours naturellement avec une question ouverte et amicale qui invite à la discussion.
4. SOIGNER LA TYPOGRAPHIE ET LA PONCTUATION :
   - Utilisez une ponctuation française impeccable (virgules, majuscules, accents corrects).
   - Utilisez du gras avec parcimonie pour faire ressortir uniquement les chiffres ou concepts clés (ex: **3 558 €/m²**, **DPE F**).
   - Aérez vos paragraphes de manière équilibrée et agréable à lire.
5. EXCELLENCE DU CONTENU : Syntétisez avec clarté les atouts de l'emplacement, les opportunités de négociation (DPE, écart DVF), les données d'urbanisme et de qualité de vie, sans surcharger le texte.`;

    const fullPrompt = `Propriété / Emplacement analysé en contexte (si pertinent) :
Adresse : ${propertyReport?.address?.address || 'Non spécifiée'}
Indice Signal Immo : ${propertyReport?.briquiaIndexScore || 80}/100 (${propertyReport?.ratingLabel || 'Standard'})

Chiffres clés du bien :
- Prix moyen rue (DVF) : ${propertyReport?.dvf?.medianPricePerM2Street} €/m²
- Loyer estimé : ${propertyReport?.rentalMarket?.avgRentApartmentPerM2} €/m² (Rendement ~${propertyReport?.rentalMarket?.estimatedGrossYieldPercent}%)
- DPE : Énergie ${propertyReport?.dpe?.energyRating} / Climat ${propertyReport?.dpe?.climateRating} (Passoire : ${propertyReport?.dpe?.isPassoireThermique ? 'Oui' : 'Non'})
- Risques : Niveau ${propertyReport?.georisques?.riskScoreNumber}/10 (Inondation PPRI: ${propertyReport?.georisques?.floodRisk?.inPpriZone ? 'Oui' : 'Non'})
- Sécurité : Indice ${propertyReport?.safetySecurity?.securityIndexScore}/100 (${propertyReport?.safetySecurity?.relativeLevel})
- Permis de construire : ${propertyReport?.constructionPermits?.totalPermits500m || 12} permis à 500m (${propertyReport?.constructionPermits?.constructionActivityLevel || 'Activité Modérée'})
- Qualité de vie : ${propertyReport?.qualityOfLife?.overallScore || 75}/100 (Commerces ${propertyReport?.qualityOfLife?.categories?.commerces?.score}, Transports ${propertyReport?.qualityOfLife?.categories?.transports?.score}, Santé ${propertyReport?.qualityOfLife?.categories?.sante?.score})

${chatHistory && chatHistory.length > 0 ? `Historique récent de la discussion :\n${chatHistory.map((h: any) => `${h.sender === 'user' ? 'Utilisateur' : 'Signal Immo AI'}: ${h.text}`).join('\n')}\n` : ''}

Dernier message de l'utilisateur : "${userQuestion || 'Bonjour, fais-moi une présentation de ce bien et de ce secteur.'}"`;

    if (gemini) {
      try {
        const response = await gemini.models.generateContent({
          model: 'gemini-3.6-flash',
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
      return `Bonjour ! 👋 Je suis **Signal Immo AI**, votre assistant et partenaire d'expertise immobilière.

Je suis à votre disposition pour analyser le **${addr}** ou échanger librement sur votre projet :
• Évaluer et optimiser votre **stratégie de négociation**
• Chiffrer l'impact des **travaux d'isolation DPE** et du rendement locatif
• Analyser l'urbanisme, les **élus locaux**, la **culture** et la **fibre optique**
• Répondre à toutes vos questions d'achat ou d'investissement.

Comment puis-je vous guider aujourd'hui ?`;
    }

    if (qLower.includes('brainstorm') || qLower.includes('idée') || qLower.includes('projet') || qLower.includes('conseil') || qLower.includes('stratégie')) {
      return `💡 **Pistes Stratégiques pour le ${addr}**

Voici les principaux axes de valeur à explorer pour cet emplacement :

• **Levier Négociation & DPE** : ${dpe?.isPassoireThermique ? `Le classement en passoire thermique (${dpe?.energyRating}) permet d'exiger une réfaction de prix équivalente aux devis d'isolation.` : `Le DPE (${dpe?.energyRating || 'D'}) est favorable ; axez la négociation sur l'écart par rapport au prix notarié.`}
• **Ancrage Prix DVF** : Le prix médian observé dans la rue est de **${dvf?.medianPricePerM2Street || 4200} €/m²**.
• **Dynamique Locale** : **${report?.constructionPermits?.totalPermits500m || 12} permis de construire** à 500m témoignent d'un secteur en pleine valorisation.
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

    if (qLower.includes('risque') || qLower.includes('inondation') || qLower.includes('argile')) {
      return `🛡️ **Risques Naturels & Qualité Environnementale du ${addr}**

• **Indice Synthétique** : **${georisques?.riskScoreNumber || 3}/10** (${georisques?.overallRiskLevel || 'Faible'}).
• **Zone PPRI** : ${georisques?.floodRisk?.inPpriZone ? 'En zone d\'aléa inondation PPRI' : 'Hors zone PPRI prioritaire'}.
• **Argiles & Sols** : Retrait-gonflement des argiles niveau **${georisques?.claySoilRisk?.level || 'Faible'}**.
• **Qualité Eau ARS** : **${report?.waterQuality?.complianceBacterialPercent || 100}% de conformité** (${report?.waterQuality?.overallSanitaryStatus || 'Excellente Qualité'}).

Avez-vous besoin d'autres détails sur la qualité environnementale du quartier ?`;
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
    console.log(`Signal Immo DataGouv server running on http://0.0.0.0:${PORT}`);
  });
}

export default app;

if (process.env.NODE_ENV !== 'test') {
  startServer();
}
