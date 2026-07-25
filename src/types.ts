export interface AddressSearchResult {
  id: string;
  label: string;
  name: string;
  postcode: string;
  city: string;
  citycode: string;
  context: string;
  street?: string;
  housenumber?: string;
  lat: number;
  lon: number;
}

export interface BANData {
  address: string;
  postcode: string;
  city: string;
  department: string;
  region: string;
  lat: number;
  lon: number;
  parcelId: string;
  section: string;
  parcelNumber: string;
  parcelAreaM2: number;
  buildingFootprintM2: number;
  cadastreSectionName: string;
  gardenAreaM2?: number;
  landCoveragePercent?: number;
  buildableAreaM2?: number;
  epsgProjection?: string;
  cadastreUpdateDate?: string;
}

export interface DVFTransaction {
  id: string;
  date: string;
  price: number;
  surfaceM2: number;
  rooms: number;
  type: 'Appartement' | 'Maison' | 'Local commercial' | 'Terrain';
  pricePerM2: number;
  distanceMeters: number;
}

export interface DVFData {
  lastKnownSalePrice: number | null;
  lastKnownSaleDate: string | null;
  medianPricePerM2Street: number;
  medianPricePerM2City: number;
  fiveYearPriceGrowthPercent: number;
  totalTransactionsInArea: number;
  recentSales: DVFTransaction[];
  historicalPriceTrend: Array<{ year: string; pricePerM2: number }>;
  streetVsCityPriceGapPercent?: number;
  negotiabilityMarginPercent?: number;
  avgPricePerRoom?: number;
  liquidityScore?: number;
}

export interface DPEData {
  energyRating: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  climateRating: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  consumptionKwhM2Year: number;
  co2EmissionsKgM2Year: number;
  estimatedAnnualCostMin: number;
  estimatedAnnualCostMax: number;
  heatingType: string;
  waterHeatingType: string;
  insulationQuality: {
    walls: 'Excellente' | 'Bonne' | 'Moyenne' | 'Médiocre' | 'Non Isolé';
    roof: 'Excellente' | 'Bonne' | 'Moyenne' | 'Médiocre' | 'Non Isolé';
    windows: 'Double/Triple Vitrage' | 'Vitrage Récent' | 'Simple Vitrage';
  };
  isPassoireThermique: boolean;
  rentalBanDate: string | null;
  estimatedMonthlyCostMin?: number;
  estimatedMonthlyCostMax?: number;
  recommendedRenovationBudget?: number;
  maPrimeRenovGrantEstimate?: number;
  co2EquivalentCarKm?: number;
  thermalLossBreakdown?: { roof: number; walls: number; windows: number; ventilation: number };
}

export interface RiskFactor {
  name: string;
  level: 'Faible' | 'Modéré' | 'Élevé' | 'Très Élevé';
  code: string;
  description: string;
  iconName: string;
}

export interface GeorisquesData {
  overallRiskLevel: 'Faible' | 'Modéré' | 'Élevé';
  riskScoreNumber: number; // 0 to 10
  floodRisk: {
    level: 'Faible' | 'Modéré' | 'Élevé';
    inPpriZone: boolean;
    zoneName: string;
    description: string;
  };
  claySoilRisk: {
    level: 'Faible' | 'Moyen' | 'Fort';
    description: string;
  };
  seismicRisk: {
    zone: number; // 1 to 5
    description: string;
  };
  radonRisk: {
    category: number; // 1 to 3
    description: string;
  };
  industrialPollution: {
    sitesWithin1km: number;
    description: string;
  };
  allFactors: RiskFactor[];
  mouvementsTerrain?: { level: 'Faible' | 'Modéré' | 'Élevé'; description: string };
  cavitesSouterraines?: { count: number; description: string };
  basiasPollution?: { count: number; description: string };
  insuranceSurprimePercent?: number;
  ialObligationCompliant?: boolean;
}

export interface InseeData {
  communeName: string;
  communeCode: string;
  populationTotal: number;
  medianAnnualIncomeEur: number;
  povertyRatePercent: number;
  ownerOccupiedPercent: number;
  tenantOccupiedPercent: number;
  unemploymentRatePercent: number;
  executiveWorkersPercent: number;
  safetyScore: number; // 0-100
  employeesPercent?: number;
  workersPercent?: number;
  retireesPercent?: number;
  singlePersonHouseholdsPercent?: number;
  familiesWithChildrenPercent?: number;
  avgHouseholdSize?: number;
}

export interface Amenity {
  category: 'Transport' | 'Éducation' | 'Santé' | 'Commerce' | 'Loisirs';
  name: string;
  distanceMeters: number;
  walkTimeMinutes: number;
}

export interface PluAndAmenitiesData {
  pluZoneCode: string;
  pluZoneName: string;
  maxBuildingHeightMeters: number;
  footprintMaxPercent: number;
  walkScore: number; // 0 - 100
  transitScore: number; // 0 - 100
  noiseLevelDb: number;
  noiseCategory: 'Calme (<55dB)' | 'Modéré (55-65dB)' | 'Bruyant (>65dB)';
  nearbyAmenities: Amenity[];
  maxGreenSpacePercent?: number;
  abfProtectionZone?: boolean;
  abfZoneName?: string;
  airQualityAtmoIndex?: 'Bon (1/6)' | 'Moyen (2/6)' | 'Dégradé (3/6)' | 'Mauvais (4/6)';
}

export interface WaterQualityData {
  complianceBacterialPercent: number;
  complianceChemicalPercent: number;
  nitratesMgL: number;
  nitratesStatus: 'Conforme (< 50 mg/L)' | 'Vigilance' | 'Non Conforme';
  hardnessFrenchDegrees: number; // °f
  hardnessType: 'Eau Douce (<15°f)' | 'Moyennement Dure (15-25°f)' | 'Dure (>25°f)';
  overallSanitaryStatus: 'Excellente Qualité' | 'Bonne Qualité' | 'Vigilance Sanitaire';
  lastArsControlDate: string;
  networkManager: string;
  pesticidesDetected?: boolean;
  heavyMetalsConformity?: boolean;
  waterOrigin?: string;
  limescaleRiskScore?: number;
}

export interface RentalMarketData {
  avgRentApartmentPerM2: number;
  avgRentHousePerM2: number;
  estimatedGrossYieldPercent: number;
  rentalTension: 'Très Élevée' | 'Élevée' | 'Modérée' | 'Faible';
  rentToPriceRatioPercent: number;
  avgRent30m2StudioEur: number;
  avgRent60m2T3Eur: number;
  occupancyRatePercent: number;
  dataYear: string;
  avgRentStudio30m2?: number;
  avgRentT2_45m2?: number;
  avgRentT3_60m2?: number;
  avgRentT4_80m2?: number;
  netYieldPercent?: number;
  rentControlStatus?: string;
  avgDaysToLease?: number;
}

export interface SafetySecurityData {
  securityIndexScore: number; // 0-100
  relativeLevel: 'Fort Niveau de Sérénité' | 'Conforme Moyenne Nationale' | 'Vigilance Modérée';
  burglariesPer1000: number;
  propertyDamagePer1000: number;
  theftsPer1000: number;
  nationalBurglariesAvgPer1000: number;
  nationalDamageAvgPer1000: number;
  policeDistrictName: string;
  vehicleTheftsPer1000?: number;
  assaultsPer1000?: number;
  serenityRankInDept?: string;
  nighttimeSafetyScore?: number;
}

export interface QualityOfLifeItem {
  score: number; // 0-100
  title: string; // Commerces, Santé, Éducation, Transports, Environnement
  summary: string;
  nearestWalkTimeMinutes: number;
}

export interface QualityOfLifeData {
  overallScore: number;
  categories: {
    commerces: QualityOfLifeItem;
    sante: QualityOfLifeItem;
    education: QualityOfLifeItem;
    transports: QualityOfLifeItem;
    environnement: QualityOfLifeItem;
  };
  airQualityIndex?: number;
  greenSpaceM2PerHab?: number;
  atmoRating?: string;
}

export interface ConstructionPermit {
  id: string;
  permitNumber: string;
  type: 'Permis de Construire' | 'Déclaration Préalable' | 'Permis de Démolir' | 'Permis d\'Aménager';
  status: 'Accordé' | 'En cours d\'instruction' | 'Chantier démarré' | 'Achevée';
  dateGranted: string;
  destination: string;
  surfaceM2Created: number;
  distanceMeters: number;
  applicant: string;
}

export interface ConstructionPermitData {
  totalPermits500m: number;
  permitsLast2Years: number;
  majorProjectsCount: number;
  constructionActivityLevel: 'Forte Activité / Secteur en Mutation' | 'Activité Modérée / Renouvellement Urbain' | 'Secteur Stable / Peu de Chantier';
  recentPermits: ConstructionPermit[];
  housingUnitsCreated?: number;
  impactOnNeighborhoodValue?: string;
}

export interface ElectedOfficial {
  name: string;
  role: string;
  politicalTendency: string;
  partyAbbreviation: string;
  mandateYears: string;
  keyProjects: string[];
  description?: string;
}

export interface ElusData {
  mayorName: string;
  mayorParty: string;
  mayorPoliticalTendency: string;
  municipalCouncilSize: number;
  politicalTendencyOverview: string;
  lastElectionTurnoutPercent: number;
  keyMunicipalProgram: string[];
  officials: ElectedOfficial[];
  departmentalRepresentatives: ElectedOfficial[];
  regionalRepresentatives: ElectedOfficial[];
  localTaxPolicyVision: string;
}

export interface CulturalSite {
  id: string;
  name: string;
  category: 'Musée & Galerie' | 'Théâtre & Spectacle' | 'Médiathèque & Bibliothèque' | 'Monument Historique' | 'Cinéma' | 'Conservatoire & École d\'Art';
  distanceMeters: number;
  walkTimeMinutes: number;
  isHistoricalMonument: boolean;
  description: string;
  address?: string;
}

export interface CulturalData {
  totalCulturalSites500m: number;
  totalHistoricalMonuments: number;
  culturalDensityScore: number; // 0-100
  keySites: CulturalSite[];
  annualEventsCount: number;
  nearbyLibrariesCount: number;
  nearbyCinemasCount: number;
  nearbyTheatresCount: number;
}

export interface ConnectivityOperator {
  name: string;
  hasFiber: boolean;
  maxDownloadSpeed: string;
  maxUploadSpeed: string;
  coverage5G: 'Excellente' | 'Bonne' | 'Moyenne';
}

export interface ConnectivityData {
  fiberEligible: boolean;
  fiberCoveragePercent: number;
  maxDownloadMbps: number;
  maxUploadMbps: number;
  operatorsAvailable: ConnectivityOperator[];
  adslStatus: string;
  mobile5gRating: 'Excellente' | 'Très Bonne' | 'Moyenne';
  arcepDataYear: string;
  starlinkSatelliteEligible: boolean;
  copperPhaseOutYear: number;
}

export interface PropertyReport {
  address: BANData;
  briquiaIndexScore: number; // 0 to 100
  ratingLabel: 'A+ Prime' | 'A Excellent' | 'B+ Bon' | 'B Standard' | 'C Attention' | 'D Risqué';
  reportGeneratedAt: string;
  highlights: string[];
  redFlags: string[];
  ban: BANData;
  dvf: DVFData;
  dpe: DPEData;
  georisques: GeorisquesData;
  insee: InseeData;
  pluAmenities: PluAndAmenitiesData;
  waterQuality: WaterQualityData;
  rentalMarket: RentalMarketData;
  safetySecurity: SafetySecurityData;
  qualityOfLife: QualityOfLifeData;
  constructionPermits: ConstructionPermitData;
  elus: ElusData;
  cultural: CulturalData;
  connectivity: ConnectivityData;
}

export type ActiveNavTab = 'search' | 'dataset-ban' | 'dataset-dvf' | 'dataset-dpe' | 'dataset-georisques' | 'dataset-insee' | 'dataset-plu' | 'dataset-water' | 'dataset-rental' | 'dataset-safety' | 'dataset-quality' | 'dataset-permits' | 'dataset-elus' | 'dataset-cultural' | 'dataset-connectivity' | 'compare' | 'ai-synthesis';

