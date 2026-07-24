import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
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
    const { propertyReport, userQuestion } = req.body;

    const gemini = getGeminiClient();

    if (!gemini) {
      return res.status(503).json({
        error: 'Gemini API Key is missing or not configured in environment settings.',
        synthesis: 'To enable AI real estate synthesis & negotiation advice, please configure GEMINI_API_KEY in Settings > Secrets.',
      });
    }

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

${userQuestion ? `Question de l'utilisateur : "${userQuestion}"\nRépondez à la question de l'utilisateur directement dès la première phrase en français, puis étayez avec des faits chiffrés et des conseils de négociation.` : "Fournissez une synthèse complète d'expertise foncière et une stratégie de négociation immobilière en français."}`;

    const response = await gemini.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const textOutput = response.text || 'Aucune synthèse générée.';
    return res.json({ synthesis: textOutput });
  } catch (err: any) {
    console.error('Error in AI Report endpoint:', err);
    return res.status(500).json({
      error: 'Une erreur est survenue lors de la génération de la synthèse d\'expertise Briquia AI.',
      details: err.message,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
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
