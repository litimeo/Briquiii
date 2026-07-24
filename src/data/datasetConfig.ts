import { Building2, TrendingUp, Zap, ShieldAlert, Users, Compass, PlusCircle } from 'lucide-react';

export interface DatasetMeta {
  id: string;
  tabKey: string;
  number: number;
  name: string;
  shortName: string;
  provider: string;
  color: string;
  borderColor: string;
  bgLight: string;
  textColor: string;
  iconName: string;
  description: string;
  isAvailable: boolean;
}

export class DatasetRegistry {
  // Registry of integrated and extensible open datasets
  static readonly DATASETS: DatasetMeta[] = [
    {
      id: 'ban',
      tabKey: 'dataset-ban',
      number: 1,
      name: 'Base Adresse Nationale & Cadastre',
      shortName: 'BAN & Cadastre',
      provider: 'IGN / Data.gouv.fr',
      color: 'blue',
      borderColor: 'border-blue-500/40',
      bgLight: 'bg-blue-500/10',
      textColor: 'text-blue-400',
      iconName: 'Building2',
      description: 'Identifiants parcellaires, emprise au sol, surfaces cadastrales et découpage géodésique.',
      isAvailable: true,
    },
    {
      id: 'dvf',
      tabKey: 'dataset-dvf',
      number: 2,
      name: 'Demandes de Valeurs Foncières (DVF)',
      shortName: 'DVF Prix Notaires',
      provider: 'DGFiP / Notaires de France',
      color: 'emerald',
      borderColor: 'border-emerald-500/40',
      bgLight: 'bg-emerald-500/10',
      textColor: 'text-emerald-400',
      iconName: 'TrendingUp',
      description: 'Actes notariés de vente réels, historique des prix au m² et tendance sur 5 ans.',
      isAvailable: true,
    },
    {
      id: 'dpe',
      tabKey: 'dataset-dpe',
      number: 3,
      name: 'Diagnostic de Performance Énergétique (DPE)',
      shortName: 'DPE ADEME',
      provider: 'ADEME / Ministère de la Transition Écologique',
      color: 'amber',
      borderColor: 'border-amber-500/40',
      bgLight: 'bg-amber-500/10',
      textColor: 'text-amber-400',
      iconName: 'Zap',
      description: 'Registre ADEME des étiquettes énergétiques, bilan GES et calendrier des interdictions de louer.',
      isAvailable: true,
    },
    {
      id: 'georisques',
      tabKey: 'dataset-georisques',
      number: 4,
      name: 'Géorisques (Risques Majeurs & Sol)',
      shortName: 'Géorisques',
      provider: 'BRGM / Ministère de l\'Écologie',
      color: 'rose',
      borderColor: 'border-rose-500/40',
      bgLight: 'bg-rose-500/10',
      textColor: 'text-rose-400',
      iconName: 'ShieldAlert',
      description: 'Zonage PPRI inondations, retrait-gonflement des argiles, séismes, radon et BASIAS/BASOL.',
      isAvailable: true,
    },
    {
      id: 'insee',
      tabKey: 'dataset-insee',
      number: 5,
      name: 'INSEE Statistiques Socio-Démographiques',
      shortName: 'INSEE Démographie',
      provider: 'INSEE',
      color: 'purple',
      borderColor: 'border-purple-500/40',
      bgLight: 'bg-purple-500/10',
      textColor: 'text-purple-400',
      iconName: 'Users',
      description: 'Revenu médian par ménage, taux de pauvreté, répartition propriétaires/locataires et profil quartier.',
      isAvailable: true,
    },
    {
      id: 'plu',
      tabKey: 'dataset-plu',
      number: 6,
      name: 'PLU & Matrice d\'Équipements de Proximité',
      shortName: 'PLU & Transports',
      provider: 'GPU / OpenStreetMap / GTFS',
      color: 'teal',
      borderColor: 'border-teal-500/40',
      bgLight: 'bg-teal-500/10',
      textColor: 'text-teal-400',
      iconName: 'Compass',
      description: 'Zonage d\'urbanisme, hauteur maximale autorisée, WalkScore et matrice des transports.',
      isAvailable: true,
    },
    {
      id: 'rental',
      tabKey: 'dataset-rental',
      number: 7,
      name: 'Carte des Loyers & Rendement Locatif',
      shortName: 'Marché Locatif',
      provider: 'Ministère du Logement / OLL',
      color: 'cyan',
      borderColor: 'border-cyan-500/40',
      bgLight: 'bg-cyan-500/10',
      textColor: 'text-cyan-400',
      iconName: 'Home',
      description: 'Indicateurs de loyers d\'annonce par commune, tension locative et rendement brut estimé.',
      isAvailable: true,
    },
    {
      id: 'water',
      tabKey: 'dataset-water',
      number: 8,
      name: 'Contrôle Sanitaire de l\'Eau Potable',
      shortName: 'Qualité Eau Potable',
      provider: 'ARS / Ministère de la Santé',
      color: 'sky',
      borderColor: 'border-sky-500/40',
      bgLight: 'bg-sky-500/10',
      textColor: 'text-sky-400',
      iconName: 'Droplets',
      description: 'Résultats des analyses bactériologiques et physico-chimiques ARS, teneur en nitrates et dureté.',
      isAvailable: true,
    },
    {
      id: 'safety',
      tabKey: 'dataset-safety',
      number: 9,
      name: 'Statistiques de Délinquance & Sécurité',
      shortName: 'Indice de Sécurité',
      provider: 'SSMSI / Ministère de l\'Intérieur',
      color: 'indigo',
      borderColor: 'border-indigo-500/40',
      bgLight: 'bg-indigo-500/10',
      textColor: 'text-indigo-400',
      iconName: 'ShieldCheck',
      description: 'Actes enregistrés par la Police et la Gendarmerie (cambriolages, dégradations) et indice de sérénité.',
      isAvailable: true,
    },
  ];
}
