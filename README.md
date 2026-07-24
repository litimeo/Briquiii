# Briquia - Plateforme d'Expertise Foncier & Immobilier

Briquia est une application web d'expertise immobilière croisant en direct **9 bases de données publiques et officielles françaises** (data.gouv.fr, Cadastre, DVF, DPE ADEME, Géorisques, INSEE, PLU, Qualité de l'Eau ARS, Sécurité SSMSI) combinées à un assistant IA d'évaluation foncière (Gemini API).

---

## 📁 Structure du Projet

```text
├── api/
│   └── index.ts                 # Handler Serverless Vercel (Express proxy)
├── src/
│   ├── components/              # Composants UI d'affichage des 9 datasets
│   │   ├── AddressHeaderCard.tsx
│   │   ├── AiSynthesisTab.tsx
│   │   ├── CompareAddressesModal.tsx
│   │   ├── DatasetBAN.tsx
│   │   ├── DatasetDPE.tsx
│   │   ├── DatasetDVF.tsx
│   │   ├── DatasetGeorisques.tsx
│   │   ├── DatasetINSEE.tsx
│   │   ├── DatasetPLU.tsx
│   │   ├── DatasetRentalMarket.tsx
│   │   ├── DatasetSafetySecurity.tsx
│   │   └── DatasetWaterQuality.tsx
│   ├── services/
│   │   └── apiAdresse.ts        # Moteur d'agrégation & calcul des scores Briquia
│   ├── App.tsx                  # Composant principal avec navigation & recherche
│   ├── main.tsx                 # Point d'entrée React
│   ├── types.ts                 # Typages TypeScript des rapports et datasets
│   └── index.css                # Styles Tailwind CSS
├── server.ts                    # Serveur Backend Express & Synthèse Gemini AI
├── vercel.json                  # Configuration du déploiement Vercel
├── vite.config.ts               # Configuration Vite
├── package.json                 # Dépendances du projet
└── README.md
```

---

## 🚀 Lancement en Local

### 1. Installation des dépendances
```bash
npm install
```

### 2. Variables d'environnement
Créez un fichier `.env` à la racine si vous souhaitez activer l'assistant IA Briquia :
```env
GEMINI_API_KEY=votre_cle_api_gemini
```

### 3. Démarrer le serveur de développement
```bash
npm run dev
```
L'application s'ouvre sur `http://localhost:3000`.

---

## ⚡ Déploiement sur Vercel

Le projet est préconfiguré pour un déploiement instantané sur Vercel via `vercel.json` et `/api/index.ts` :

1. Enregistrez le dépôt sur **GitHub**.
2. Connectez le dépôt à votre compte **Vercel**.
3. Dans la configuration Vercel, ajoutez la variable d'environnement :
   - `GEMINI_API_KEY` (votre clé d'API Google Gemini)
4. Cliquez sur **Deploy**.

---

## 📊 Datasets & Sources Officielles Utilisées

1. **BAN (Base Adresse Nationale)** : Géolocalisation, cadastre et parcelle.
2. **DVF (Demandes de Valeurs Foncières)** : Historique des ventes réelles, prix au m² et évolution sur 5 ans.
3. **DPE (Diagnostic de Performance Énergétique ADEME)** : Classe énergie/GES et coût annuel estimé.
4. **Géorisques (BRGM / Ministère Écologie)** : Inondations, sismicité, retrait-gonflement des argiles, radon et risques industriels.
5. **INSEE (Données Socio-Économiques)** : Revenu médian des ménages, taux de propriétaires/locataires.
6. **PLU & Services (Urbanisme & Commodités)** : Zonage d'urbanisme, WalkScore et proximité des transports/écoles/commerces.
7. **ARS (Qualité Sanitaire de l'Eau)** : Conformité bactériologique/chimique et dureté de l'eau potable.
8. **SSMSI (Sécurité & Tranquillité)** : Indice de sécurité du quartier et statistiques de délinquance.
9. **Marché Locatif (Rendement & Loyers)** : Loyers moyens observés et rendement brut estimé.
