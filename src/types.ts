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
}

export type ActiveNavTab = 'search' | 'dataset-ban' | 'dataset-dvf' | 'dataset-dpe' | 'dataset-georisques' | 'dataset-insee' | 'dataset-plu' | 'dataset-water' | 'dataset-rental' | 'dataset-safety' | 'compare' | 'ai-synthesis';
