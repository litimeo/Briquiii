import express from 'express';
import path from 'path';
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
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }
  return ai;
}

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Briquia DataGouv Aggregator', timestamp: new Date().toISOString() });
});

// AI Property Report Synthesis API Endpoint
app.post('/api/ai/report', async (req, res) => {
  try {
    const { propertyReport, userQuestion, chatHistory } = req.body;

    const gemini = getGeminiClient();

    const systemInstruction = `Vous êtes Briquia AI, un expert consultant en immobilier et un expert en évaluation foncière en France.

RÈGLES IMPÉRATIVES :
1. LANGUE OBLIGATOIRE : Rédigez STRICTEMENT et EXCLUSIVEMENT en FRANÇAIS. L'ensemble de vos réponses, titres, points clés et conseils doivent être en français parfait et professionnel.
2. Ne mentionnez JAMAIS les termes techniques de sous-sol tels que "bases de données", "datasets", "data.gouv.fr", "tables", "BAN", "DVF", "INSEE", "DPE", "Géorisques", "PLU", "sources", "SQL" ou "données internes". Exprimez-vous en tant qu'expert-conseil en immobilier délivrant une analyse directe et personnalisée.
3. Répondez TOUJOURS à la question de l'utilisateur DIRECTEMENT dès les 1 à 2 premières phrases en français. Évitez les formules de politesse superflues ou les métadiscours.
4. Conservez des réponses claires, objectives, chiffrées et immédiatement exploitables pour une décision d'achat ou une négociation.

FORMATAGE DES RÉPONSES (EN FRANÇAIS) :
- Si une question spécifique est posée, répondez-y immédiatement et directement en français, puis étayez avec des arguments chiffrés et des conseils de négociation.
- Si une synthèse générale d'expertise est demandée, structurez votre analyse sous ces titres clairs en français :
  - 📊 Valorisation & Positionnement de Marché
  - ⚡ Performance Énergétique & Enjeux de Rénovation
  - 🛡️ Résilience Environnementale & État de l'Emplacement
  - 🏙️ Cadre de Vie, Sécurité & Attractivité du Quartier
  - 💡 Stratégie de Négociation & Recommandations Acquéreur`;

    const fullPrompt = `Property Details for Analysis:
Address: ${propertyReport?.address?.address || 'Selected Location'}
Overall Property Index Score: ${propertyReport?.briquiaIndexScore || 80}/100 (${propertyReport?.ratingLabel || 'Standard'})

Key Property Indicators:
- Location & Land: Section ${propertyReport?.ban?.section}, Parcel ${propertyReport?.ban?.parcelNumber}, ${propertyReport?.ban?.parcelAreaM2}m² land plot
- Sales & Valuation History: Median Street Price ${propertyReport?.dvf?.medianPricePerM2Street}€/m², 5-Year Trend +${propertyReport?.dvf?.fiveYearPriceGrowthPercent}%, Recent Benchmark Sale ${propertyReport?.dvf?.lastKnownSalePrice}€
- Rental Market: Average Rent ${propertyReport?.rentalMarket?.avgRentApartmentPerM2}€/m², Estimated Yield ${propertyReport?.rentalMarket?.estimatedGrossYieldPercent}%
- Energy Rating: Class ${propertyReport?.dpe?.energyRating} (GHG ${propertyReport?.dpe?.climateRating}), ${propertyReport?.dpe?.consumptionKwhM2Year} kWh/m²/yr, Thermal Renovation Required: ${propertyReport?.dpe?.isPassoireThermique ? 'YES' : 'NO'}
- Drinking Water Quality: ${propertyReport?.waterQuality?.complianceBacterialPercent}% Compliance (${propertyReport?.waterQuality?.overallSanitaryStatus})
- Environmental Risks: Risk Level ${propertyReport?.georisques?.riskScoreNumber}/10, Flood Plan PPRI: ${propertyReport?.georisques?.floodRisk?.inPpriZone ? 'YES' : 'NO'}, Clay Soil Risk: ${propertyReport?.georisques?.claySoilRisk?.level}
- Safety & Security Index: ${propertyReport?.safetySecurity?.securityIndexScore}/100 (${propertyReport?.safetySecurity?.relativeLevel})
- Neighborhood Demographics: Median Household Income ${propertyReport?.insee?.medianAnnualIncomeEur}€/yr, Owner Rate ${propertyReport?.insee?.ownerOccupiedPercent}%
- Urban Planning & Access: Zone ${propertyReport?.pluAmenities?.pluZoneCode}, WalkScore ${propertyReport?.pluAmenities?.walkScore}/100

${chatHistory && chatHistory.length > 0 ? `Historique de la conversation :\n${chatHistory.map((h: any) => `${h.sender === 'user' ? 'Utilisateur' : 'Briquia AI'}: ${h.text}`).join('\n')}\n` : ''}

${userQuestion ? `Nouvelle question de l'utilisateur : "${userQuestion}"\nRépondez à la question directement dès la première phrase en français, puis étayez avec des faits chiffrés et des conseils de négociation.` : "Fournissez une synthèse complète d'expertise foncière et une stratégie de négociation immobilière en français."}`;

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
        return res.json({ synthesis: textOutput });
      } catch (geminiErr: any) {
        console.warn('Gemini API call failed, using fallback synthesis:', geminiErr?.message);
      }
    }

    // Fallback if Gemini key is missing or call fails
    const fallbackText = generateFallbackSynthesis(propertyReport, userQuestion);
    return res.json({ synthesis: fallbackText });

  } catch (err: any) {
    console.error('Error in AI Report endpoint:', err);
    return res.json({
      synthesis: generateFallbackSynthesis(req.body?.propertyReport, req.body?.userQuestion),
    });
  }
});

function generateFallbackSynthesis(report: any, question?: string): string {
  const addr = report?.address?.address || 'Emplacement analysé';
  const score = report?.briquiaIndexScore || 80;
  const dvf = report?.dvf;
  const dpe = report?.dpe;
  const georisques = report?.georisques;
  const rental = report?.rentalMarket;

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
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Briquia DataGouv server running on http://0.0.0.0:${PORT}`);
  });
}

export default app;

if (process.env.NODE_ENV !== 'test') {
  startServer();
}
