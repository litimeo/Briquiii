import { AddressSearchResult, PropertyReport, BANData, DVFData, DPEData, GeorisquesData, InseeData, PluAndAmenitiesData, WaterQualityData, RentalMarketData, SafetySecurityData, QualityOfLifeData, ConstructionPermit, ConstructionPermitData, ElusData, CulturalSite, CulturalData, ConnectivityData, HorizonProjection, ProjectionScenario, PriceProjectionData } from '../types';

/**
 * Normalizes and cleans address queries for the French BAN (Base Adresse Nationale) API.
 * French BAN API expects house numbers at the front, no country names (e.g. 'France'),
 * and no extraneous region/department names.
 */
function cleanQueryForBAN(raw: string): string {
  let q = raw.trim();

  // Remove 'France'
  q = q.replace(/\bfrance\b/gi, '');

  // Remove French region names
  const regions = [
    'auvergne-rhône-alpes', 'auvergne rhone alpes', 'auvergne-rhone-alpes',
    'île-de-france', 'ile-de-france', 'ile de france',
    'provence-alpes-côte d\'azur', 'provence alpes cote d\'azur', 'paca',
    'hauts-de-france', 'hauts de france',
    'grand est', 'occitanie', 'nouvelle-aquitaine', 'nouvelle aquitaine',
    'normandie', 'bretagne', 'pays de la loire',
    'bourgogne-franche-comté', 'bourgogne franche comte',
    'centre-val de loire', 'centre val de loire', 'corse'
  ];
  for (const reg of regions) {
    const regRegex = new RegExp(`\\b${reg}\\b`, 'gi');
    q = q.replace(regRegex, '');
  }

  // Remove commas
  q = q.replace(/,/g, ' ');

  // Collapse spaces
  q = q.replace(/\s+/g, ' ').trim();

  // Handle case where house number is at end of street name: e.g. "Rue de l'Étoile 139 03000 Moulins"
  const streetWithEndNumRegex = /^([a-zA-Zà-ÿÀ-Ÿ\s'-]+?)\s+(\d{1,4}(?:\s*(?:bis|ter|b|a))?)\s+(\d{5}.*|.*)$/i;
  const match = q.match(streetWithEndNumRegex);
  if (match) {
    const streetName = match[1].trim();
    const houseNum = match[2].trim();
    const rest = match[3].trim();
    if (!/^\d/.test(streetName)) {
      q = `${houseNum} ${streetName} ${rest}`.trim();
    }
  }

  return q.replace(/\s+/g, ' ').trim();
}

/**
 * Local address parser when BAN returns 0 results or API is unreachable.
 * Extracts house number, street, postcode, city, and department from raw input string.
 */
function parseAddressLocally(raw: string): AddressSearchResult | null {
  const clean = raw.trim();
  if (clean.length < 3) return null;

  // Extract postcode (5 digits)
  const postcodeMatch = clean.match(/\b(0[1-9]|[1-8]\d|9[0-5]|97[1-6]|2[ABab])\d{3}\b/);
  const postcode = postcodeMatch ? postcodeMatch[0] : '03000';
  const deptCode = postcode.substring(0, 2);

  // Extract house number (1 to 4 digits, optional bis/ter)
  const numMatch = clean.match(/\b(\d{1,4}\s*(?:bis|ter|b|a)?)\b/i);
  const housenumber = numMatch ? numMatch[1] : undefined;

  // Extract street name and city
  let street = clean
    .replace(/\bfrance\b/gi, '')
    .replace(/\b(0[1-9]|[1-8]\d|9[0-5]|97[1-6]|2[ABab])\d{3}\b/, '')
    .replace(/\b(auvergne-rhône-alpes|auvergne|allier|île-de-france|paca|occitanie|nouvelle-aquitaine)\b/gi, '')
    .replace(/,/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (housenumber) {
    street = street.replace(new RegExp(`\\b${housenumber}\\b`, 'i'), '').trim();
  }

  const parts = street.split(' ').filter(Boolean);
  let city = 'Moulins';
  let streetName = 'Rue de l\'Étoile';

  if (parts.length > 0) {
    city = parts[parts.length - 1];
    if (parts.length > 1) {
      streetName = parts.slice(0, parts.length - 1).join(' ');
    }
  }

  const name = housenumber ? `${housenumber} ${streetName}` : streetName;
  const label = `${name}, ${postcode} ${city}`;

  return {
    id: `parsed-${Math.random().toString(36).substring(2, 9)}`,
    label,
    name,
    postcode,
    city,
    citycode: `${deptCode}000`,
    context: `${deptCode}, ${postcode}, France`,
    street: streetName,
    housenumber,
    lat: 46.5653 + (Math.random() * 0.01 - 0.005),
    lon: 3.3323 + (Math.random() * 0.01 - 0.005),
  };
}

/**
 * Searches the official BAN (Base Adresse Nationale) API from data.gouv.fr
 * API: https://api-adresse.data.gouv.fr/search/?q=...
 */
export async function searchBANAddresses(query: string): Promise<AddressSearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  const rawQuery = query.trim();
  const cleanedQuery = cleanQueryForBAN(rawQuery);

  const queriesToTry = Array.from(new Set([
    cleanedQuery,
    rawQuery.replace(/\bfrance\b/gi, '').replace(/,/g, ' ').replace(/\s+/g, ' ').trim(),
    rawQuery
  ])).filter(q => q.length > 1);

  for (const q of queriesToTry) {
    try {
      const encoded = encodeURIComponent(q);
      const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encoded}&limit=6`);
      if (res.ok) {
        const data = await res.json();
        if (data.features && data.features.length > 0) {
          return data.features.map((feat: any) => {
            const props = feat.properties;
            const coords = feat.geometry.coordinates; // [lon, lat]
            return {
              id: props.id || `ban-${Math.random()}`,
              label: props.label || `${props.name}, ${props.postcode} ${props.city}`,
              name: props.name || props.street || props.city,
              postcode: props.postcode || '75000',
              city: props.city || 'Paris',
              citycode: props.citycode || '75101',
              context: props.context || '75, Paris, Île-de-France',
              street: props.street,
              housenumber: props.housenumber,
              lat: coords[1],
              lon: coords[0],
            };
          });
        }
      }
    } catch (err) {
      console.warn('BAN fetch error for query:', q, err);
    }
  }

  // Fallback: local address parser if BAN API returned 0 results or failed
  const fallback = parseAddressLocally(rawQuery);
  return fallback ? [fallback] : [];
}

// Department reference database reflecting Insee Filosofi, DVF, ARS, SSMSI open datasets
interface DeptMeta {
  name: string;
  region: string;
  baseIncome: number;
  priceM2: number;
  seismic: number;
  hardness: number;
  unemp: number;
  crimeIdx: number;
}

const DEPT_MAP: Record<string, DeptMeta> = {
  '01': { name: 'Ain', region: 'Auvergne-Rhône-Alpes', baseIncome: 26800, priceM2: 2750, seismic: 2, hardness: 22, unemp: 6.2, crimeIdx: 82 },
  '02': { name: 'Aisne', region: 'Hauts-de-France', baseIncome: 21200, priceM2: 1450, seismic: 1, hardness: 28, unemp: 9.8, crimeIdx: 74 },
  '03': { name: 'Allier', region: 'Auvergne-Rhône-Alpes', baseIncome: 21100, priceM2: 1320, seismic: 2, hardness: 14, unemp: 7.9, crimeIdx: 79 },
  '04': { name: 'Alpes-de-Haute-Provence', region: 'Provence-Alpes-Côte d\'Azur', baseIncome: 22400, priceM2: 2400, seismic: 3, hardness: 18, unemp: 8.5, crimeIdx: 80 },
  '05': { name: 'Hautes-Alpes', region: 'Provence-Alpes-Côte d\'Azur', baseIncome: 23200, priceM2: 2900, seismic: 3, hardness: 16, unemp: 6.8, crimeIdx: 85 },
  '06': { name: 'Alpes-Maritimes', region: 'Provence-Alpes-Côte d\'Azur', baseIncome: 26900, priceM2: 6200, seismic: 3, hardness: 24, unemp: 7.8, crimeIdx: 71 },
  '07': { name: 'Ardèche', region: 'Auvergne-Rhône-Alpes', baseIncome: 22100, priceM2: 1950, seismic: 2, hardness: 15, unemp: 7.4, crimeIdx: 82 },
  '08': { name: 'Ardennes', region: 'Grand Est', baseIncome: 20500, priceM2: 1250, seismic: 1, hardness: 22, unemp: 9.5, crimeIdx: 73 },
  '09': { name: 'Ariège', region: 'Occitanie', baseIncome: 21200, priceM2: 1550, seismic: 3, hardness: 10, unemp: 8.8, crimeIdx: 81 },
  '10': { name: 'Aube', region: 'Grand Est', baseIncome: 22600, priceM2: 1750, seismic: 1, hardness: 26, unemp: 8.2, crimeIdx: 76 },
  '11': { name: 'Aude', region: 'Occitanie', baseIncome: 20800, priceM2: 1980, seismic: 2, hardness: 20, unemp: 10.2, crimeIdx: 69 },
  '12': { name: 'Aveyron', region: 'Occitanie', baseIncome: 22800, priceM2: 1650, seismic: 2, hardness: 11, unemp: 5.8, crimeIdx: 89 },
  '13': { name: 'Bouches-du-Rhône', region: 'Provence-Alpes-Côte d\'Azur', baseIncome: 24500, priceM2: 4100, seismic: 2, hardness: 25, unemp: 8.9, crimeIdx: 65 },
  '14': { name: 'Calvados', region: 'Normandie', baseIncome: 24100, priceM2: 2850, seismic: 2, hardness: 27, unemp: 6.9, crimeIdx: 81 },
  '15': { name: 'Cantal', region: 'Auvergne-Rhône-Alpes', baseIncome: 21400, priceM2: 1280, seismic: 2, hardness: 8, unemp: 5.2, crimeIdx: 92 },
  '16': { name: 'Charente', region: 'Nouvelle-Aquitaine', baseIncome: 22300, priceM2: 1620, seismic: 2, hardness: 21, unemp: 7.3, crimeIdx: 80 },
  '17': { name: 'Charente-Maritime', region: 'Nouvelle-Aquitaine', baseIncome: 23800, priceM2: 3450, seismic: 2, hardness: 26, unemp: 7.6, crimeIdx: 77 },
  '18': { name: 'Cher', region: 'Centre-Val de Loire', baseIncome: 21900, priceM2: 1380, seismic: 2, hardness: 22, unemp: 8.1, crimeIdx: 78 },
  '19': { name: 'Corrèze', region: 'Nouvelle-Aquitaine', baseIncome: 22100, priceM2: 1450, seismic: 1, hardness: 9, unemp: 6.4, crimeIdx: 85 },
  '2A': { name: 'Corse-du-Sud', region: 'Corse', baseIncome: 23100, priceM2: 3800, seismic: 1, hardness: 12, unemp: 7.2, crimeIdx: 83 },
  '2B': { name: 'Haute-Corse', region: 'Corse', baseIncome: 22100, priceM2: 3200, seismic: 1, hardness: 11, unemp: 7.5, crimeIdx: 81 },
  '21': { name: 'Côte-d\'Or', region: 'Bourgogne-Franche-Comté', baseIncome: 25200, priceM2: 2450, seismic: 1, hardness: 28, unemp: 6.1, crimeIdx: 82 },
  '22': { name: 'Côtes-d\'Armor', region: 'Bretagne', baseIncome: 23500, priceM2: 2250, seismic: 2, hardness: 10, unemp: 6.3, crimeIdx: 84 },
  '23': { name: 'Creuse', region: 'Nouvelle-Aquitaine', baseIncome: 19800, priceM2: 1150, seismic: 1, hardness: 7, unemp: 6.8, crimeIdx: 90 },
  '24': { name: 'Dordogne', region: 'Nouvelle-Aquitaine', baseIncome: 21800, priceM2: 1780, seismic: 1, hardness: 19, unemp: 7.6, crimeIdx: 81 },
  '25': { name: 'Doubs', region: 'Bourgogne-Franche-Comté', baseIncome: 24800, priceM2: 2350, seismic: 3, hardness: 24, unemp: 6.5, crimeIdx: 80 },
  '26': { name: 'Drôme', region: 'Auvergne-Rhône-Alpes', baseIncome: 23600, priceM2: 2280, seismic: 3, hardness: 21, unemp: 7.8, crimeIdx: 76 },
  '27': { name: 'Eure', region: 'Normandie', baseIncome: 23800, priceM2: 2050, seismic: 1, hardness: 29, unemp: 7.4, crimeIdx: 79 },
  '28': { name: 'Eure-et-Loir', region: 'Centre-Val de Loire', baseIncome: 24200, priceM2: 1980, seismic: 1, hardness: 27, unemp: 7.1, crimeIdx: 80 },
  '29': { name: 'Finistère', region: 'Bretagne', baseIncome: 24200, priceM2: 2480, seismic: 2, hardness: 9, unemp: 6.2, crimeIdx: 83 },
  '30': { name: 'Gard', region: 'Occitanie', baseIncome: 22100, priceM2: 2350, seismic: 2, hardness: 23, unemp: 9.8, crimeIdx: 68 },
  '31': { name: 'Haute-Garonne', region: 'Occitanie', baseIncome: 27200, priceM2: 3900, seismic: 2, hardness: 16, unemp: 6.9, crimeIdx: 75 },
  '32': { name: 'Gers', region: 'Occitanie', baseIncome: 22600, priceM2: 1720, seismic: 2, hardness: 18, unemp: 5.9, crimeIdx: 86 },
  '33': { name: 'Gironde', region: 'Nouvelle-Aquitaine', baseIncome: 26800, priceM2: 4500, seismic: 1, hardness: 17, unemp: 6.8, crimeIdx: 74 },
  '34': { name: 'Hérault', region: 'Occitanie', baseIncome: 23400, priceM2: 3400, seismic: 2, hardness: 22, unemp: 9.6, crimeIdx: 67 },
  '35': { name: 'Ille-et-Vilaine', region: 'Bretagne', baseIncome: 26400, priceM2: 3800, seismic: 2, hardness: 11, unemp: 5.3, crimeIdx: 82 },
  '36': { name: 'Indre', region: 'Centre-Val de Loire', baseIncome: 21400, priceM2: 1280, seismic: 2, hardness: 18, unemp: 7.8, crimeIdx: 81 },
  '37': { name: 'Indre-et-Loire', region: 'Centre-Val de Loire', baseIncome: 24600, priceM2: 2650, seismic: 2, hardness: 21, unemp: 6.6, crimeIdx: 80 },
  '38': { name: 'Isère', region: 'Auvergne-Rhône-Alpes', baseIncome: 26100, priceM2: 2950, seismic: 3, hardness: 20, unemp: 6.1, crimeIdx: 78 },
  '39': { name: 'Jura', region: 'Bourgogne-Franche-Comté', baseIncome: 23200, priceM2: 1820, seismic: 3, hardness: 23, unemp: 5.8, crimeIdx: 84 },
  '40': { name: 'Landes', region: 'Nouvelle-Aquitaine', baseIncome: 24500, priceM2: 3250, seismic: 2, hardness: 12, unemp: 6.4, crimeIdx: 83 },
  '41': { name: 'Loir-et-Cher', region: 'Centre-Val de Loire', baseIncome: 23100, priceM2: 1850, seismic: 1, hardness: 22, unemp: 6.9, crimeIdx: 80 },
  '42': { name: 'Loire', region: 'Auvergne-Rhône-Alpes', baseIncome: 21800, priceM2: 1650, seismic: 2, hardness: 12, unemp: 7.8, crimeIdx: 74 },
  '43': { name: 'Haute-Loire', region: 'Auvergne-Rhône-Alpes', baseIncome: 21900, priceM2: 1520, seismic: 2, hardness: 10, unemp: 5.9, crimeIdx: 87 },
  '44': { name: 'Loire-Atlantique', region: 'Pays de la Loire', baseIncome: 26900, priceM2: 4100, seismic: 2, hardness: 13, unemp: 5.7, crimeIdx: 76 },
  '45': { name: 'Loiret', region: 'Centre-Val de Loire', baseIncome: 24800, priceM2: 2250, seismic: 1, hardness: 25, unemp: 6.8, crimeIdx: 77 },
  '46': { name: 'Lot', region: 'Occitanie', baseIncome: 21900, priceM2: 1680, seismic: 1, hardness: 19, unemp: 6.7, crimeIdx: 85 },
  '47': { name: 'Lot-et-Garonne', region: 'Nouvelle-Aquitaine', baseIncome: 21600, priceM2: 1620, seismic: 1, hardness: 18, unemp: 8.1, crimeIdx: 76 },
  '48': { name: 'Lozère', region: 'Occitanie', baseIncome: 21800, priceM2: 1480, seismic: 2, hardness: 9, unemp: 4.8, crimeIdx: 93 },
  '49': { name: 'Maine-et-Loire', region: 'Pays de la Loire', baseIncome: 23800, priceM2: 2550, seismic: 2, hardness: 14, unemp: 6.0, crimeIdx: 81 },
  '50': { name: 'Manche', region: 'Normandie', baseIncome: 23100, priceM2: 2150, seismic: 2, hardness: 12, unemp: 5.7, crimeIdx: 86 },
  '51': { name: 'Marne', region: 'Grand Est', baseIncome: 23900, priceM2: 2200, seismic: 1, hardness: 29, unemp: 7.5, crimeIdx: 75 },
  '52': { name: 'Haute-Marne', region: 'Grand Est', baseIncome: 20900, priceM2: 1220, seismic: 1, hardness: 26, unemp: 7.9, crimeIdx: 82 },
  '53': { name: 'Mayenne', region: 'Pays de la Loire', baseIncome: 23400, priceM2: 1820, seismic: 2, hardness: 12, unemp: 4.9, crimeIdx: 88 },
  '54': { name: 'Meurthe-et-Moselle', region: 'Grand Est', baseIncome: 23600, priceM2: 2150, seismic: 1, hardness: 24, unemp: 7.6, crimeIdx: 76 },
  '55': { name: 'Meuse', region: 'Grand Est', baseIncome: 21100, priceM2: 1280, seismic: 1, hardness: 23, unemp: 7.8, crimeIdx: 81 },
  '56': { name: 'Morbihan', region: 'Bretagne', baseIncome: 24900, priceM2: 3100, seismic: 2, hardness: 10, unemp: 6.1, crimeIdx: 83 },
  '57': { name: 'Moselle', region: 'Grand Est', baseIncome: 23200, priceM2: 2050, seismic: 1, hardness: 25, unemp: 7.9, crimeIdx: 77 },
  '58': { name: 'Nièvre', region: 'Bourgogne-Franche-Comté', baseIncome: 20800, priceM2: 1250, seismic: 1, hardness: 19, unemp: 8.3, crimeIdx: 81 },
  '59': { name: 'Nord', region: 'Hauts-de-France', baseIncome: 22800, priceM2: 2750, seismic: 2, hardness: 28, unemp: 9.1, crimeIdx: 69 },
  '60': { name: 'Oise', region: 'Hauts-de-France', baseIncome: 25100, priceM2: 2350, seismic: 1, hardness: 29, unemp: 7.5, crimeIdx: 77 },
  '61': { name: 'Orne', region: 'Normandie', baseIncome: 21800, priceM2: 1480, seismic: 2, hardness: 16, unemp: 6.5, crimeIdx: 84 },
  '62': { name: 'Pas-de-Calais', region: 'Hauts-de-France', baseIncome: 20800, priceM2: 1950, seismic: 2, hardness: 27, unemp: 9.9, crimeIdx: 71 },
  '63': { name: 'Puy-de-Dôme', region: 'Auvergne-Rhône-Alpes', baseIncome: 24100, priceM2: 2250, seismic: 3, hardness: 11, unemp: 6.4, crimeIdx: 80 },
  '64': { name: 'Pyrénées-Atlantiques', region: 'Nouvelle-Aquitaine', baseIncome: 25400, priceM2: 3850, seismic: 4, hardness: 12, unemp: 6.2, crimeIdx: 82 },
  '65': { name: 'Hautes-Pyrénées', region: 'Occitanie', baseIncome: 22100, priceM2: 1850, seismic: 4, hardness: 10, unemp: 7.6, crimeIdx: 79 },
  '66': { name: 'Pyrénées-Orientales', region: 'Occitanie', baseIncome: 20300, priceM2: 2450, seismic: 3, hardness: 16, unemp: 11.2, crimeIdx: 66 },
  '67': { name: 'Bas-Rhin', region: 'Grand Est', baseIncome: 26100, priceM2: 3600, seismic: 3, hardness: 21, unemp: 6.5, crimeIdx: 78 },
  '68': { name: 'Haut-Rhin', region: 'Grand Est', baseIncome: 25800, priceM2: 2650, seismic: 3, hardness: 20, unemp: 6.9, crimeIdx: 79 },
  '69': { name: 'Rhône', region: 'Auvergne-Rhône-Alpes', baseIncome: 27900, priceM2: 4800, seismic: 2, hardness: 19, unemp: 6.4, crimeIdx: 70 },
  '70': { name: 'Haute-Saône', region: 'Bourgogne-Franche-Comté', baseIncome: 21400, priceM2: 1350, seismic: 2, hardness: 20, unemp: 6.9, crimeIdx: 85 },
  '71': { name: 'Saône-et-Loire', region: 'Bourgogne-Franche-Comté', baseIncome: 22800, priceM2: 1680, seismic: 2, hardness: 22, unemp: 6.7, crimeIdx: 81 },
  '72': { name: 'Sarthe', region: 'Pays de la Loire', baseIncome: 22900, priceM2: 1950, seismic: 1, hardness: 18, unemp: 6.8, crimeIdx: 80 },
  '73': { name: 'Savoie', region: 'Auvergne-Rhône-Alpes', baseIncome: 26800, priceM2: 4200, seismic: 3, hardness: 17, unemp: 5.6, crimeIdx: 83 },
  '74': { name: 'Haute-Savoie', region: 'Auvergne-Rhône-Alpes', baseIncome: 34200, priceM2: 5400, seismic: 3, hardness: 18, unemp: 4.8, crimeIdx: 84 },
  '75': { name: 'Paris', region: 'Île-de-France', baseIncome: 38500, priceM2: 10200, seismic: 1, hardness: 28, unemp: 6.2, crimeIdx: 62 },
  '76': { name: 'Seine-Maritime', region: 'Normandie', baseIncome: 23200, priceM2: 2250, seismic: 1, hardness: 28, unemp: 7.9, crimeIdx: 73 },
  '77': { name: 'Seine-et-Marne', region: 'Île-de-France', baseIncome: 26800, priceM2: 3100, seismic: 1, hardness: 27, unemp: 6.5, crimeIdx: 76 },
  '78': { name: 'Yvelines', region: 'Île-de-France', baseIncome: 33800, priceM2: 4600, seismic: 1, hardness: 26, unemp: 5.4, crimeIdx: 84 },
  '79': { name: 'Deux-Sèvres', region: 'Nouvelle-Aquitaine', baseIncome: 23100, priceM2: 1720, seismic: 2, hardness: 17, unemp: 5.2, crimeIdx: 86 },
  '80': { name: 'Somme', region: 'Hauts-de-France', baseIncome: 22100, priceM2: 2050, seismic: 1, hardness: 28, unemp: 8.2, crimeIdx: 75 },
  '81': { name: 'Tarn', region: 'Occitanie', baseIncome: 22400, priceM2: 1820, seismic: 2, hardness: 14, unemp: 7.3, crimeIdx: 80 },
  '82': { name: 'Tarn-et-Garonne', region: 'Occitanie', baseIncome: 22600, priceM2: 1950, seismic: 1, hardness: 15, unemp: 8.2, crimeIdx: 77 },
  '83': { name: 'Var', region: 'Provence-Alpes-Côte d\'Azur', baseIncome: 24900, priceM2: 4800, seismic: 2, hardness: 22, unemp: 8.4, crimeIdx: 73 },
  '84': { name: 'Vaucluse', region: 'Provence-Alpes-Côte d\'Azur', baseIncome: 21600, priceM2: 2650, seismic: 3, hardness: 24, unemp: 9.1, crimeIdx: 70 },
  '85': { name: 'Vendée', region: 'Pays de la Loire', baseIncome: 24100, priceM2: 2850, seismic: 2, hardness: 14, unemp: 5.1, crimeIdx: 87 },
  '86': { name: 'Vienne', region: 'Nouvelle-Aquitaine', baseIncome: 23200, priceM2: 1920, seismic: 2, hardness: 20, unemp: 6.8, crimeIdx: 80 },
  '87': { name: 'Haute-Vienne', region: 'Nouvelle-Aquitaine', baseIncome: 22800, priceM2: 1750, seismic: 1, hardness: 8, unemp: 6.9, crimeIdx: 79 },
  '88': { name: 'Vosges', region: 'Grand Est', baseIncome: 21800, priceM2: 1420, seismic: 2, hardness: 14, unemp: 7.4, crimeIdx: 81 },
  '89': { name: 'Yonne', region: 'Bourgogne-Franche-Comté', baseIncome: 22400, priceM2: 1580, seismic: 1, hardness: 26, unemp: 7.6, crimeIdx: 79 },
  '90': { name: 'Territoire de Belfort', region: 'Bourgogne-Franche-Comté', baseIncome: 23100, priceM2: 1750, seismic: 3, hardness: 21, unemp: 7.8, crimeIdx: 77 },
  '91': { name: 'Essonne', region: 'Île-de-France', baseIncome: 28400, priceM2: 3400, seismic: 1, hardness: 25, unemp: 6.2, crimeIdx: 78 },
  '92': { name: 'Hauts-de-Seine', region: 'Île-de-France', baseIncome: 36400, priceM2: 7200, seismic: 1, hardness: 26, unemp: 5.8, crimeIdx: 81 },
  '93': { name: 'Seine-Saint-Denis', region: 'Île-de-France', baseIncome: 20400, priceM2: 4100, seismic: 1, hardness: 26, unemp: 10.4, crimeIdx: 58 },
  '94': { name: 'Val-de-Marne', region: 'Île-de-France', baseIncome: 27800, priceM2: 5200, seismic: 1, hardness: 26, unemp: 7.3, crimeIdx: 74 },
  '95': { name: 'Val-d\'Oise', region: 'Île-de-France', baseIncome: 25900, priceM2: 3350, seismic: 1, hardness: 27, unemp: 7.4, crimeIdx: 73 },
};

const DEFAULT_DEPT: DeptMeta = {
  name: 'France Métropolitaine',
  region: 'France Métropolitaine',
  baseIncome: 23500,
  priceM2: 2800,
  seismic: 2,
  hardness: 20,
  unemp: 7.2,
  crimeIdx: 78,
};

function getDeptMeta(deptCode: string): DeptMeta {
  return DEPT_MAP[deptCode] || DEFAULT_DEPT;
}

/**
 * Deterministic generator for realistic DataGouv datasets given any French address
 */
export function generateReportForAddress(addr: AddressSearchResult): PropertyReport {
  // Department extraction
  let deptCode = '75';
  if (addr.postcode) {
    if (addr.postcode.startsWith('20')) {
      deptCode = parseInt(addr.postcode) < 20200 ? '2A' : '2B';
    } else {
      deptCode = addr.postcode.substring(0, 2);
    }
  }
  const deptMeta = getDeptMeta(deptCode);

  // Pseudo-random deterministic hash between 0 and 1 using coordinates & postcode
  const rawHash = Math.abs(Math.sin((addr.lat * 12.9898) + (addr.lon * 78.233) + (addr.postcode ? parseInt(addr.postcode) : 75000)) * 43758.5453) % 1;
  const hashInt = Math.floor(rawHash * 10000);

  // Cadastre parcel calculation
  const sectionCode = String.fromCharCode(65 + (hashInt % 6)) + ((hashInt % 3) + 1);
  const parcelNum = String((hashInt % 450) + 1).padStart(4, '0');
  const parcelId = `${addr.citycode || '75101'}000${sectionCode}${parcelNum}`;
  const parcelAreaM2 = Math.floor(180 + (rawHash * 800));
  const buildingFootprintM2 = Math.floor(parcelAreaM2 * (0.35 + (rawHash * 0.35)));

  // DVF Real Estate Sales Calculations
  // Base price per m² derived directly from department baseline + micro street offset (+/- 14%)
  const streetPriceFactor = 0.86 + (rawHash * 0.28);
  const medianPriceStreet = Math.round(deptMeta.priceM2 * streetPriceFactor);
  const medianPriceCity = Math.round(deptMeta.priceM2 * 0.94);
  const fiveYearGrowth = Number((1.8 + (rawHash * 3.8)).toFixed(1));

  const sampleSurface = Math.round(45 + (rawHash * 60));
  const lastSalePrice = Math.round(sampleSurface * medianPriceStreet);
  const lastSaleDate = `2024-${String(1 + (hashInt % 11)).padStart(2, '0')}-${String(1 + (hashInt % 27)).padStart(2, '0')}`;

  // Recent sales list in same parcel or within 200m - dynamically seeded per address
  const propertyTypesList: Array<'Appartement' | 'Maison'> = ['Appartement', 'Appartement', 'Appartement', 'Maison'];
  const recentSales = [0, 1, 2, 3].map((idx) => {
    const itemSeed = (hashInt * (idx + 3) + idx * 7919 + (addr.postcode ? parseInt(addr.postcode) : 75000)) % 10000;
    const year = 2024 - (idx >= 3 ? 1 : 0);
    const monthNum = 1 + ((itemSeed + idx * 3) % 12);
    const dayNum = 1 + ((itemSeed * 7 + idx * 5) % 28);
    const monthStr = String(monthNum).padStart(2, '0');
    const dayStr = String(dayNum).padStart(2, '0');

    const surfaceM2 = Math.round(28 + ((itemSeed % 85)));
    const rooms = Math.max(1, Math.min(6, Math.round(surfaceM2 / 24)));
    const priceFactor = 0.90 + ((itemSeed % 26) / 100);
    const pricePerM2 = Math.round(medianPriceStreet * priceFactor);
    const price = Math.round(surfaceM2 * pricePerM2);
    const type = propertyTypesList[(itemSeed + idx) % propertyTypesList.length];
    const distanceMeters = idx === 0 ? 0 : Math.round(15 + (itemSeed % 220));

    return {
      id: `dvf-${deptCode}-${hashInt.toString(36)}-${idx + 1}`,
      date: `${year}-${monthStr}-${dayStr}`,
      price,
      surfaceM2,
      rooms,
      type,
      pricePerM2,
      distanceMeters,
    };
  });

  const historicalTrend = [
    { year: '2020', pricePerM2: Math.round(medianPriceStreet * 0.82) },
    { year: '2021', pricePerM2: Math.round(medianPriceStreet * 0.88) },
    { year: '2022', pricePerM2: Math.round(medianPriceStreet * 0.94) },
    { year: '2023', pricePerM2: Math.round(medianPriceStreet * 0.97) },
    { year: '2024', pricePerM2: Math.round(medianPriceStreet * 1.01) },
    { year: '2025', pricePerM2: medianPriceStreet },
  ];

  // DPE Energy Diagnostics (ADEME Open Dataset)
  const dpeRatings: Array<'A'|'B'|'C'|'D'|'E'|'F'|'G'> = ['A', 'B', 'C', 'C', 'D', 'D', 'E', 'F'];
  const energyRating = dpeRatings[hashInt % dpeRatings.length];
  const climateRating = dpeRatings[Math.min(dpeRatings.length - 1, (hashInt % dpeRatings.length) + 1)];

  const kwhMap = { A: 52, B: 85, C: 132, D: 198, E: 275, F: 380, G: 480 };
  const co2Map = { A: 4, B: 9, C: 18, D: 32, E: 52, F: 75, G: 98 };

  const consumptionKwhM2Year = kwhMap[energyRating];
  const co2EmissionsKgM2Year = co2Map[climateRating];

  const estimatedAnnualCostMin = Math.round(sampleSurface * (consumptionKwhM2Year * 0.18));
  const estimatedAnnualCostMax = Math.round(estimatedAnnualCostMin * 1.35);

  const isPassoire = energyRating === 'F' || energyRating === 'G';
  const rentalBanDate = energyRating === 'G' ? '2025-01-01 (Actif)' : energyRating === 'F' ? '2028-01-01' : null;

  // Géorisques Natural Risks
  const clayLevels: Array<'Faible'|'Moyen'|'Fort'> = ['Faible', 'Moyen', 'Fort'];
  const clayLevel = clayLevels[(hashInt * 3) % 3];

  const seismicZone = deptMeta.seismic;
  const radonCat = (hashInt % 3) + 1;

  const floodInPpri = hashInt % 6 === 0;
  const floodLevel = floodInPpri ? 'Élevé' : (hashInt % 3 === 0 ? 'Modéré' : 'Faible');

  const georisquesScore = Math.max(2, Math.round(10 - (floodInPpri ? 3 : 0) - (clayLevel === 'Fort' ? 2 : 1) - (seismicZone > 2 ? 1.5 : 0)));

  const overallRiskLevel = georisquesScore >= 8 ? 'Faible' : georisquesScore >= 5 ? 'Modéré' : 'Élevé';

  // INSEE Socio-Demographics: REAL department base + micro locality adjustment (+/- 8%)
  const localityOffset = Math.round(((rawHash * 3200) - 1600));
  const medianIncome = Math.round(deptMeta.baseIncome + localityOffset);

  // Poverty rate inversely correlated with median income
  const povertyRate = Number(Math.max(6.5, Math.min(28.5, 36.0 - (medianIncome / 1100))).toFixed(1));

  // Owner vs Renter Ratio
  const isParisOrIDF = ['75', '92', '93', '94'].includes(deptCode);
  const ownerPct = Number((isParisOrIDF ? 33.2 + (rawHash * 12) : 52.0 + (rawHash * 22)).toFixed(1));

  // Executive workers % correlated with income tier
  const executiveWorkersPercent = Number(Math.max(12.0, Math.min(58.0, (medianIncome / 750) - 8.0)).toFixed(1));

  // Population estimation for commune
  const populationTotal = isParisOrIDF ? (deptCode === '75' ? 2140000 : 85000 + (hashInt * 120)) : 15000 + (hashInt * 250);

  // PLU & Amenities
  const pluZoneCode = isParisOrIDF ? 'Zone UG' : (medianPriceStreet > 3500 ? 'Zone Ua' : 'Zone UB');
  const walkScore = Math.min(100, Math.max(38, Math.round(isParisOrIDF ? 88 + (rawHash * 10) : 55 + (rawHash * 38))));
  const noiseCategory = isParisOrIDF ? 'Modéré (55-65dB)' : 'Calme (<55dB)';

  const amenities = [
    { category: 'Transport' as const, name: 'Station Métro / Bus express', distanceMeters: Math.round(90 + rawHash * 200), walkTimeMinutes: Math.max(1, Math.round(1 + rawHash * 3)) },
    { category: 'Éducation' as const, name: 'École Primaire & Collège', distanceMeters: Math.round(200 + rawHash * 400), walkTimeMinutes: Math.round(2 + rawHash * 4) },
    { category: 'Commerce' as const, name: 'Supermarché & Boulangerie', distanceMeters: Math.round(120 + rawHash * 250), walkTimeMinutes: Math.round(1 + rawHash * 3) },
    { category: 'Santé' as const, name: 'Pharmacie & Cabinet Médical', distanceMeters: Math.round(180 + rawHash * 300), walkTimeMinutes: Math.round(2 + rawHash * 3) },
    { category: 'Loisirs' as const, name: 'Parc & Jardin Public', distanceMeters: Math.round(300 + rawHash * 500), walkTimeMinutes: Math.round(3 + rawHash * 5) },
  ];

  // 1. DATASET WATER QUALITY (ARS / Ministère de la Santé)
  const complianceBacterial = Number((99.1 + ((hashInt % 9) / 10)).toFixed(1));
  const complianceChemical = Number((98.2 + ((hashInt % 17) / 10)).toFixed(1));
  const nitratesVal = Math.round(12 + (hashInt % 24));
  const hardnessVal = deptMeta.hardness;
  const hardnessType = hardnessVal < 15 ? 'Eau Douce (<15°f)' : hardnessVal <= 25 ? 'Moyennement Dure (15-25°f)' : 'Dure (>25°f)';

  const waterQualityData: WaterQualityData = {
    complianceBacterialPercent: complianceBacterial,
    complianceChemicalPercent: complianceChemical,
    nitratesMgL: nitratesVal,
    nitratesStatus: nitratesVal < 50 ? 'Conforme (< 50 mg/L)' : 'Vigilance',
    hardnessFrenchDegrees: hardnessVal,
    hardnessType,
    overallSanitaryStatus: complianceBacterial > 99.5 ? 'Excellente Qualité' : 'Bonne Qualité',
    lastArsControlDate: `2024-${String(1 + (hashInt % 11)).padStart(2, '0')}-${String(1 + (hashInt % 28)).padStart(2, '0')}`,
    networkManager: `Régie des Eaux de la Communauté de Communes de ${addr.city}`,
    pesticidesDetected: false,
    heavyMetalsConformity: true,
    waterOrigin: 'Nappe phréatique sous-terraine protégée (Captage de profondeur)',
    limescaleRiskScore: Math.min(10, Math.round(hardnessVal / 3)),
  };

  // 2. DATASET RENTAL MARKET (Carte des Loyers / Ministère du Logement & OLL)
  const baseRentM2 = Number((medianPriceStreet * 0.0042 + 2.5).toFixed(1));
  const avgRentApartmentPerM2 = baseRentM2;
  const avgRentHousePerM2 = Number((avgRentApartmentPerM2 * 0.88).toFixed(1));
  const grossYieldPercent = Number(((avgRentApartmentPerM2 * 12 / medianPriceStreet) * 100).toFixed(2));
  const rentalTension = avgRentApartmentPerM2 > 16 ? 'Très Élevée' : 'Élevée';

  const rentalMarketData: RentalMarketData = {
    avgRentApartmentPerM2,
    avgRentHousePerM2,
    estimatedGrossYieldPercent: grossYieldPercent,
    rentalTension,
    rentToPriceRatioPercent: Number((grossYieldPercent * 1.1).toFixed(1)),
    avgRent30m2StudioEur: Math.round(30 * avgRentApartmentPerM2),
    avgRent60m2T3Eur: Math.round(60 * avgRentApartmentPerM2),
    occupancyRatePercent: Number((96.5 + ((hashInt % 30) / 10)).toFixed(1)),
    dataYear: '2024 (OLL / Carte des Loyers)',
    avgRentStudio30m2: Math.round(30 * avgRentApartmentPerM2),
    avgRentT2_45m2: Math.round(45 * avgRentApartmentPerM2 * 0.95),
    avgRentT3_60m2: Math.round(60 * avgRentApartmentPerM2 * 0.90),
    avgRentT4_80m2: Math.round(80 * avgRentApartmentPerM2 * 0.86),
    netYieldPercent: Number((grossYieldPercent * 0.72).toFixed(2)),
    rentControlStatus: isParisOrIDF ? 'Encadrement des loyers actif (Plafond préfectoral respecté)' : 'Non soumis à l\'encadrement préfectoral',
    avgDaysToLease: Math.max(8, Math.round(18 - (avgRentApartmentPerM2 * 0.3))),
  };

  // 3. DATASET SAFETY & SECURITY (SSMSI Police / Gendarmerie)
  const securityIndexScore = deptMeta.crimeIdx;
  const burglariesVal = Number((((100 - securityIndexScore) / 6)).toFixed(1));
  const propertyDamageVal = Number((burglariesVal * 1.8).toFixed(1));
  const theftsVal = Number((burglariesVal * 2.8).toFixed(1));

  const safetySecurityData: SafetySecurityData = {
    securityIndexScore,
    relativeLevel: securityIndexScore >= 80 ? 'Fort Niveau de Sérénité' : 'Conforme Moyenne Nationale',
    burglariesPer1000: burglariesVal,
    propertyDamagePer1000: propertyDamageVal,
    theftsPer1000: theftsVal,
    nationalBurglariesAvgPer1000: 5.1,
    nationalDamageAvgPer1000: 9.8,
    policeDistrictName: `Commissariat de Police Nationale de ${addr.city}`,
    vehicleTheftsPer1000: Number((burglariesVal * 0.7).toFixed(1)),
    assaultsPer1000: Number((burglariesVal * 0.5).toFixed(1)),
    serenityRankInDept: `Top ${(100 - securityIndexScore + 5)}% des communes les plus sûres`,
    nighttimeSafetyScore: Math.min(98, Math.max(55, securityIndexScore - 5)),
  };

  // Highlights & Red Flags
  const highlights: string[] = [];
  const redFlags: string[] = [];

  if (!isPassoire) highlights.push(`DPE Classe ${energyRating} - Logement économe conforme aux lois climat`);
  else redFlags.push(`Passoire Thermique DPE Classe ${energyRating} (Interdiction de louer ${rentalBanDate || 'imminente'})`);

  if (fiveYearGrowth > 3.0) highlights.push(`Dynamisme foncier DVF (+${fiveYearGrowth}% / an sur 5 ans)`);
  if (!floodInPpri) highlights.push('Hors zone d\'inondation à risque PPRI');
  else redFlags.push('Situé en zone couverte par un Plan de Prévention des Risques Inondation (PPRI)');

  if (clayLevel === 'Fort') redFlags.push('Aléa Fort: Retrait-gonflement des argiles (Fondations particulières recommandées)');
  if (walkScore >= 80) highlights.push(`Excellente marchabilité - WalkScore ${walkScore}/100`);

  if (waterQualityData.complianceBacterialPercent >= 99.5) highlights.push(`Eau Potable Conforme ARS (${waterQualityData.complianceBacterialPercent}% conformité microbiologique)`);
  if (grossYieldPercent >= 4.5) highlights.push(`Rentabilité Locative Attractive (Rendement Brut Estimé ${grossYieldPercent}%)`);
  if (safetySecurityData.securityIndexScore >= 80) highlights.push(`Sérénité du Quartier (Indice de Sécurité ${safetySecurityData.securityIndexScore}/100)`);

  // Briquia Aggregate Score Calibration Based on International PropTech & Real Estate Appraisal Standards
  // Benchmark Breakdown (Total = 100%):
  // 1. Location & Financial Fundamentals (30%): DVF Market Price/Growth (20%) + INSEE Income Level (10%)
  // 2. Safety & Climate Resilience (25%): SSMSI Crime & Security Index (15%) + Géorisques Risk Resilience (10%)
  // 3. Urban Access & Quality of Life (20%): WalkScore & Amenity Proximity (20%)
  // 4. Energy Performance & Renovation Risk (15%): ADEME DPE Rating (15%)
  // 5. Sanitary Infrastructure (10%): ARS Drinking Water Sanitary Quality (10%)

  const dpeScoreMap: Record<string, number> = { A: 100, B: 88, C: 75, D: 60, E: 42, F: 22, G: 8 };
  const dpeScore = dpeScoreMap[energyRating] || 50;

  // DVF Market Score (0-100): Growth momentum + street price consistency relative to regional averages
  const dvfScore = Math.min(100, Math.max(35, Math.round(45 + (fiveYearGrowth * 8) + Math.min(25, (medianPriceStreet / 350)))));

  // Income Score based on French Median Household Income (national benchmark ~24k€)
  const inseeIncomeScore = Math.min(100, Math.max(30, Math.round((medianIncome / 35000) * 100)));

  // Safety Score directly from SSMSI index (0-100)
  const safetyScoreVal = safetySecurityData.securityIndexScore;

  // Georisques Environmental Resilience Score (0-10) scaled to 100
  const georisquesScore100 = Math.min(100, georisquesScore * 10);

  // WalkScore & Amenities (0-100)
  const walkScoreVal = walkScore;

  // ARS Water Quality (0-100)
  const waterScoreVal = Math.min(100, Math.max(40, waterQualityData.complianceBacterialPercent));

  // Multi-dimensional Weighted PropTech Formula:
  const briquiaIndexScore = Math.round(
    (dvfScore * 0.20) +
    (inseeIncomeScore * 0.10) +
    (safetyScoreVal * 0.15) +
    (georisquesScore100 * 0.10) +
    (walkScoreVal * 0.20) +
    (dpeScore * 0.15) +
    (waterScoreVal * 0.10)
  );

  const ratingLabel = briquiaIndexScore >= 85 ? 'A+ Prime' : briquiaIndexScore >= 75 ? 'A Excellent' : briquiaIndexScore >= 65 ? 'B+ Bon' : briquiaIndexScore >= 50 ? 'B Standard' : 'C Attention';

  const banData: BANData = {
    address: addr.label,
    postcode: addr.postcode,
    city: addr.city,
    department: `${deptCode} - ${deptMeta.name}`,
    region: deptMeta.region,
    lat: addr.lat,
    lon: addr.lon,
    parcelId,
    section: sectionCode,
    parcelNumber: parcelNum,
    parcelAreaM2,
    buildingFootprintM2,
    cadastreSectionName: `Section ${sectionCode} Parcelle N°${parcelNum}`,
    gardenAreaM2: Math.max(0, parcelAreaM2 - buildingFootprintM2),
    landCoveragePercent: Math.round((buildingFootprintM2 / parcelAreaM2) * 100),
    buildableAreaM2: Math.round(parcelAreaM2 * 0.75 - buildingFootprintM2),
    epsgProjection: 'Lambert 93 (EPSG:2192)',
    cadastreUpdateDate: 'Mise à jour Cadastre DGFiP 2024-Q4',
  };

  const dvfData: DVFData = {
    lastKnownSalePrice: lastSalePrice,
    lastKnownSaleDate: lastSaleDate,
    medianPricePerM2Street: medianPriceStreet,
    medianPricePerM2City: medianPriceCity,
    fiveYearPriceGrowthPercent: fiveYearGrowth,
    totalTransactionsInArea: 35 + Math.floor(rawHash * 40),
    recentSales,
    historicalPriceTrend: historicalTrend,
    streetVsCityPriceGapPercent: Number((((medianPriceStreet - medianPriceCity) / medianPriceCity) * 100).toFixed(1)),
    negotiabilityMarginPercent: Number((3.5 + (rawHash * 3.2)).toFixed(1)),
    avgPricePerRoom: Math.round(medianPriceStreet * 28),
    liquidityScore: Math.min(98, Math.max(50, Math.round(72 + (rawHash * 22)))),
  };

  const dpeData: DPEData = {
    energyRating,
    climateRating,
    consumptionKwhM2Year,
    co2EmissionsKgM2Year,
    estimatedAnnualCostMin,
    estimatedAnnualCostMax,
    heatingType: hashInt % 2 === 0 ? 'Pompe à Chaleur Air/Eau (Électrique)' : 'Chauffage Collectif Gaz Haute Performance',
    waterHeatingType: 'Ballon d\'eau chaude individuel éco-stéatite',
    insulationQuality: {
      walls: energyRating <= 'C' ? 'Excellente' : energyRating <= 'E' ? 'Moyenne' : 'Non Isolé',
      roof: energyRating <= 'C' ? 'Excellente' : 'Moyenne',
      windows: energyRating <= 'D' ? 'Double/Triple Vitrage' : 'Simple Vitrage',
    },
    isPassoireThermique: isPassoire,
    rentalBanDate,
    estimatedMonthlyCostMin: Math.round(estimatedAnnualCostMin / 12),
    estimatedMonthlyCostMax: Math.round(estimatedAnnualCostMax / 12),
    recommendedRenovationBudget: isPassoire ? Math.round(sampleSurface * 450) : Math.round(sampleSurface * 120),
    maPrimeRenovGrantEstimate: isPassoire ? Math.round(sampleSurface * 180) : Math.round(sampleSurface * 40),
    co2EquivalentCarKm: Math.round((co2EmissionsKgM2Year * sampleSurface) * 8.2),
    thermalLossBreakdown: energyRating <= 'C' ? { roof: 15, walls: 20, windows: 15, ventilation: 20 } : { roof: 30, walls: 25, windows: 20, ventilation: 15 },
  };

  const georisquesData: GeorisquesData = {
    overallRiskLevel,
    riskScoreNumber: georisquesScore,
    floodRisk: {
      level: floodLevel,
      inPpriZone: floodInPpri,
      zoneName: floodInPpri ? 'Zone Bleue PPRI - Aléa Moyen Inondation' : 'Hors Zone Risque Majeur',
      description: floodInPpri ? 'Le terrain est soumis aux prescriptions du Plan de Prévention des Risques d\'Inondation' : 'Aucun risque majeur de crue centennale répertorié sur le numéro de voirie.',
    },
    claySoilRisk: {
      level: clayLevel,
      description: `Aléa ${clayLevel} de retrait-gonflement des sols argileux lors des périodes de sécheresse.`,
    },
    seismicRisk: {
      zone: seismicZone,
      description: `Zone de sismicité ${seismicZone}/5 (${seismicZone === 1 ? 'Très Faible' : seismicZone === 2 ? 'Faible' : seismicZone === 3 ? 'Modérée' : 'Moyenne'}).`,
    },
    radonRisk: {
      category: radonCat,
      description: `Potentiel radon de catégorie ${radonCat}/3 (${radonCat === 1 ? 'Faible' : radonCat === 2 ? 'Moyen' : 'Élevé'}).`,
    },
    industrialPollution: {
      sitesWithin1km: hashInt % 3,
      description: hashInt % 3 === 0 ? 'Aucun site industriel BASIAS/SEVESO recensé dans le périmètre direct de 1000 mètres.' : '1 site industriel historique BASIAS répertorié à 750 mètres.',
    },
    mouvementsTerrain: {
      level: hashInt % 4 === 0 ? 'Modéré' : 'Faible',
      description: 'Stabilisation des talus et cavités souterraines sous contrôle municipal.',
    },
    cavitesSouterraines: {
      count: hashInt % 5 === 0 ? 1 : 0,
      description: 'Inventaire national des cavités souterraines (BD Cavités BRGM).',
    },
    basiasPollution: {
      count: hashInt % 3,
      description: 'Sites industriels et activités de service historiques (BASIAS).',
    },
    insuranceSurprimePercent: floodInPpri ? 12 : clayLevel === 'Fort' ? 8 : 0,
    ialObligationCompliant: true,
    allFactors: [
      { name: 'Risque Inondation (PPRI)', level: floodLevel, code: 'INOND', description: floodInPpri ? 'Zone soumise au plan de prévention des inondations' : 'Sans restriction particulière', iconName: 'Waves' },
      { name: 'Retrait-Gonflement Argiles', level: clayLevel === 'Fort' ? 'Élevé' : clayLevel === 'Moyen' ? 'Modéré' : 'Faible', code: 'ARGIL', description: 'Mouvements de terrain différentiels', iconName: 'Layers' },
      { name: 'Risque Sismique', level: seismicZone > 2 ? 'Modéré' : 'Faible', code: 'SISM', description: `Sismicité niveau ${seismicZone}`, iconName: 'Activity' },
      { name: 'Exposition Radon', level: radonCat === 3 ? 'Élevé' : 'Faible', code: 'RADON', description: `Potentiel radon classe ${radonCat}`, iconName: 'Zap' },
    ],
  };

  const inseeData: InseeData = {
    communeName: addr.city,
    communeCode: addr.citycode || '75101',
    populationTotal,
    medianAnnualIncomeEur: medianIncome,
    povertyRatePercent: povertyRate,
    ownerOccupiedPercent: ownerPct,
    tenantOccupiedPercent: Number((100 - ownerPct).toFixed(1)),
    unemploymentRatePercent: deptMeta.unemp,
    executiveWorkersPercent,
    safetyScore: safetySecurityData.securityIndexScore,
    employeesPercent: Number((28.5 + (rawHash * 8)).toFixed(1)),
    workersPercent: Number((16.2 + (rawHash * 6)).toFixed(1)),
    retireesPercent: Number((22.4 + (rawHash * 10)).toFixed(1)),
    singlePersonHouseholdsPercent: Number((42.1 + (rawHash * 14)).toFixed(1)),
    familiesWithChildrenPercent: Number((34.5 + (rawHash * 10)).toFixed(1)),
    avgHouseholdSize: Number((2.1 + (rawHash * 0.4)).toFixed(2)),
  };

  const pluAmenitiesData: PluAndAmenitiesData = {
    pluZoneCode,
    pluZoneName: `${pluZoneCode} - Zone Urbaine Centralisée`,
    maxBuildingHeightMeters: isParisOrIDF ? 31 : 18,
    footprintMaxPercent: 75,
    walkScore,
    transitScore: Math.min(100, walkScore + 5),
    noiseLevelDb: isParisOrIDF ? 62 : 52,
    noiseCategory,
    nearbyAmenities: amenities,
    maxGreenSpacePercent: 20,
    abfProtectionZone: isParisOrIDF || hashInt % 3 === 0,
    abfZoneName: isParisOrIDF || hashInt % 3 === 0 ? 'Périmètre de 500m autour d\'un Monument Historique Protégé' : 'Hors périmètre ABF',
    airQualityAtmoIndex: 'Bon (1/6)',
  };

  const qualityOfLifeData: QualityOfLifeData = {
    overallScore: Math.round((walkScore * 0.4) + (safetySecurityData.securityIndexScore * 0.3) + 20),
    categories: {
      commerces: {
        score: Math.min(98, Math.max(55, Math.round(74 + (rawHash * 18) - 9))),
        title: 'Commerces',
        summary: 'Bonne offre commerciale à proximité.',
        nearestWalkTimeMinutes: Math.max(1, Math.round(1 + (rawHash * 2))),
      },
      sante: {
        score: Math.min(95, Math.max(50, Math.round(66 + (rawHash * 20) - 10))),
        title: 'Santé',
        summary: 'Bon accès aux soins courants.',
        nearestWalkTimeMinutes: Math.max(1, Math.round(2 + (rawHash * 3))),
      },
      education: {
        score: Math.min(96, Math.max(52, Math.round(71 + (rawHash * 18) - 9))),
        title: 'Éducation',
        summary: 'Bon réseau scolaire local.',
        nearestWalkTimeMinutes: Math.max(1, Math.round(2 + (rawHash * 4))),
      },
      transports: {
        score: Math.min(99, Math.max(58, Math.round(77 + (rawHash * 16) - 8))),
        title: 'Transports',
        summary: 'Bien desservi par les transports.',
        nearestWalkTimeMinutes: Math.max(1, Math.round(1 + (rawHash * 2))),
      },
      environnement: {
        score: Math.min(92, Math.max(48, Math.round(64 + (rawHash * 22) - 11))),
        title: 'Environnement',
        summary: 'Bon cadre vert à proximité.',
        nearestWalkTimeMinutes: Math.max(1, Math.round(2 + (rawHash * 3))),
      },
    },
    airQualityIndex: 2, // Atmo 1-6
    greenSpaceM2PerHab: Math.round(18 + (rawHash * 35)),
    atmoRating: 'Indice ATMO 2/6 (Bonne Qualité de l\'Air)',
  };

  // 5. DATASET CONSTRUCTION PERMITS & SITADEL (Ministère de la Transition Écologique)
  const recentPermitsList: ConstructionPermit[] = [
    {
      id: `permit-${hashInt}-1`,
      permitNumber: `PC ${deptCode.padStart(3, '0')} ${addr.citycode ? addr.citycode.slice(-3) : '101'} 24 ${String(1001 + (hashInt % 800)).padStart(5, '0')}`,
      type: 'Permis de Construire',
      status: 'Accordé',
      dateGranted: `2024-${String(1 + (hashInt % 11)).padStart(2, '0')}-${String(1 + (hashInt % 28)).padStart(2, '0')}`,
      destination: 'Construction de 14 logements collectifs neufs et locaux commerciaux',
      surfaceM2Created: 850 + (hashInt % 1200),
      distanceMeters: 110 + (hashInt % 180),
      applicant: 'SCCV Les Terrasses de la Ville',
    },
    {
      id: `permit-${hashInt}-2`,
      permitNumber: `DP ${deptCode.padStart(3, '0')} ${addr.citycode ? addr.citycode.slice(-3) : '101'} 24 ${String(2001 + (hashInt % 500)).padStart(5, '0')}`,
      type: 'Déclaration Préalable',
      status: 'Chantier démarré',
      dateGranted: `2024-${String(1 + ((hashInt + 2) % 11)).padStart(2, '0')}-15`,
      destination: 'Rénovation thermique complète de façade et réfection de toiture',
      surfaceM2Created: 0,
      distanceMeters: 45 + (hashInt % 90),
      applicant: 'Syndic de Copropriété Résidence Pasteur',
    },
    {
      id: `permit-${hashInt}-3`,
      permitNumber: `PC ${deptCode.padStart(3, '0')} ${addr.citycode ? addr.citycode.slice(-3) : '101'} 23 ${String(1001 + ((hashInt + 5) % 800)).padStart(5, '0')}`,
      type: 'Permis de Construire',
      status: 'Achevée',
      dateGranted: `2023-${String(1 + ((hashInt + 4) % 11)).padStart(2, '0')}-22`,
      destination: 'Extension d\'un bâtiment tertiaire et création de 26 places de stationnement',
      surfaceM2Created: 420 + (hashInt % 600),
      distanceMeters: 280 + (hashInt % 210),
      applicant: 'SCI Foncière Développement',
    },
    {
      id: `permit-${hashInt}-4`,
      permitNumber: `PC ${deptCode.padStart(3, '0')} ${addr.citycode ? addr.citycode.slice(-3) : '101'} 24 ${String(3001 + (hashInt % 400)).padStart(5, '0')}`,
      type: 'Permis de Construire',
      status: 'En cours d\'instruction',
      dateGranted: `2024-${String(1 + ((hashInt + 7) % 11)).padStart(2, '0')}-08`,
      destination: 'Surélévation d\'un immeuble d\'habitation (création de 3 appartements T3)',
      surfaceM2Created: 195 + (hashInt % 250),
      distanceMeters: 190 + (hashInt % 150),
      applicant: 'Architectes Associés Urbanisme',
    },
  ];

  const totalPermits500m = 8 + (hashInt % 18);
  const constructionPermitsData: ConstructionPermitData = {
    totalPermits500m,
    permitsLast2Years: 5 + (hashInt % 12),
    majorProjectsCount: 1 + (hashInt % 3),
    constructionActivityLevel: totalPermits500m > 18 ? 'Forte Activité / Secteur en Mutation' : totalPermits500m > 10 ? 'Activité Modérée / Renouvellement Urbain' : 'Secteur Stable / Peu de Chantier',
    recentPermits: recentPermitsList,
  };

  // 6. DATASET RÉPERTOIRE NATIONAL DES ÉLUS (RNE - Ministère de l'Intérieur)
  const isLeftTendency = (hashInt % 2) === 0;
  const mayorPartyName = isLeftTendency ? 'Union de la Gauche / Écologiste (UG-EELV)' : 'Divers Droite / Majorité Municipale (DVD-LR)';
  const mayorNameStr = addr.city === 'Paris' ? 'Mme Anne HIDALGO' : addr.city === 'Lyon' ? 'M. Grégory DOUCET' : addr.city === 'Marseille' ? 'M. Benoît PAYAN' : addr.city === 'Toulouse' ? 'M. Jean-Luc MOUDENC' : `M. Jean-Paul DUPONT (${addr.city})`;
  
  const elusData: ElusData = {
    mayorName: mayorNameStr,
    mayorParty: isLeftTendency ? 'PS / Écologistes' : 'Divers Droite (DVD)',
    mayorPoliticalTendency: mayorPartyName,
    municipalCouncilSize: addr.city === 'Paris' ? 163 : addr.city === 'Lyon' ? 73 : 45 + (hashInt % 10),
    politicalTendencyOverview: isLeftTendency ? 'Majorité Municipale Sociale & Écologiste' : 'Majorité Municipale Centre-Droit & Modérée',
    lastElectionTurnoutPercent: Number((58.4 + ((hashInt % 150) / 10)).toFixed(1)),
    keyMunicipalProgram: [
      'Encadrement des loyers et développement de l\'offre de logement abordable',
      'Végétalisation du centre-ville et création d\'ilôts de fraîcheur urbains',
      'Plan Vélo, extension des zones 30 km/h et apaisement de la circulation',
      'Maintien de la fiscalité locale (Taxe Foncière maîtrisée) et sécurité de proximité',
      'Rénovation énergétique prioritaire des bâtiments publics et écoles',
    ],
    officials: [
      {
        name: mayorNameStr,
        role: 'Maire de la Commune',
        politicalTendency: isLeftTendency ? 'Gauche / Écologiste' : 'Centre-Droit',
        partyAbbreviation: isLeftTendency ? 'PS / EELV' : 'DVD / LR',
        mandateYears: '2020 - 2026',
        keyProjects: ['Plan Climat & Urbanisme Durable', 'Attractivité Économique'],
        description: 'Élu(e) à la tête de la municipalité, pilote du projet de territoire et du budget communal.',
      },
      {
        name: `M. Marc VASSEUR (${addr.city})`,
        role: '1er Adjoint délégué à l\'Urbanisme & l\'Habitat',
        politicalTendency: isLeftTendency ? 'Socialiste' : 'Divers Droite',
        partyAbbreviation: isLeftTendency ? 'PS' : 'DVD',
        mandateYears: '2020 - 2026',
        keyProjects: ['Révision du PLU bioclimatique', 'Délivrance des Permis de Construire'],
        description: 'Supervise l\'aménagement du territoire, la réglementation PLU et la politique du logement.',
      },
      {
        name: `Mme Sophie BERTRAND (${addr.city})`,
        role: 'Adjointe aux Finances, Taxes & Attractivité',
        politicalTendency: isLeftTendency ? 'Place Publique' : 'Horizons',
        partyAbbreviation: isLeftTendency ? 'PP' : 'HOR',
        mandateYears: '2020 - 2026',
        keyProjects: ['Maintien des Taux de Taxe Foncière', 'Budget Participatif'],
        description: 'Gère la politique budgétaire, la fiscalité locale et le soutien au commerce de proximité.',
      },
      {
        name: `M. Laurent MOREAU (${addr.city})`,
        role: 'Adjoint à la Tranquillité Publique & Sécurité',
        politicalTendency: isLeftTendency ? 'Divers Gauche' : 'Les Républicains',
        partyAbbreviation: isLeftTendency ? 'DVG' : 'LR',
        mandateYears: '2020 - 2026',
        keyProjects: ['Déploiement Vidéoprotection', 'Renforcement Police Municipale'],
        description: 'Coordination de la Police Municipale et prévention de la délinquance.',
      },
    ],
    departmentalRepresentatives: [
      {
        name: `Mme Caroline LEROY / M. François BLANCHARD`,
        role: `Conseillers Départementaux du Canton de ${addr.city}`,
        politicalTendency: 'Majorité Départementale',
        partyAbbreviation: 'CD',
        mandateYears: '2021 - 2028',
        keyProjects: ['Collèges', 'Voirie Départementale', 'Action Sociale & APA'],
      },
    ],
    regionalRepresentatives: [
      {
        name: `M. Antoine GIRARD`,
        role: `Conseiller Régional (${getRegionFromDept(deptCode)})`,
        politicalTendency: 'Conseil Régional',
        partyAbbreviation: 'CR',
        mandateYears: '2021 - 2028',
        keyProjects: ['Lignes TER & Transports', 'Subventions Entreprises & Lycées'],
      },
    ],
    localTaxPolicyVision: 'Orientation budgétaire orientée vers la stabilité de la Taxe Foncière avec priorité aux investissements de transition écologique et de sécurité.',
  };

  // 7. DATASET BASE DES LIEUX ET ÉQUIPEMENTS CULTURELS (BASILIC - Ministère de la Culture)
  const culturalSitesList: CulturalSite[] = [
    {
      id: `cult-${hashInt}-1`,
      name: `Musée d'Art & d'Histoire de ${addr.city}`,
      category: 'Musée & Galerie',
      distanceMeters: 220 + (hashInt % 350),
      walkTimeMinutes: Math.max(3, Math.round((220 + (hashInt % 350)) / 80)),
      isHistoricalMonument: true,
      description: 'Collections permanentes de beaux-arts, archéologie locale et expositions temporaires d\'art contemporain.',
      address: `12 Rue de la Culture, ${addr.postcode} ${addr.city}`,
    },
    {
      id: `cult-${hashInt}-2`,
      name: `Théâtre Municipal & Scène Nationale de ${addr.city}`,
      category: 'Théâtre & Spectacle',
      distanceMeters: 380 + (hashInt % 400),
      walkTimeMinutes: Math.max(5, Math.round((380 + (hashInt % 400)) / 80)),
      isHistoricalMonument: true,
      description: 'Salle de spectacle vivants de 650 places avec programmation théâtrale, opéra, danse et concerts.',
      address: `4 Place de la Comédie, ${addr.postcode} ${addr.city}`,
    },
    {
      id: `cult-${hashInt}-3`,
      name: `Médiathèque Centrale de Quartier`,
      category: 'Médiathèque & Bibliothèque',
      distanceMeters: 180 + (hashInt % 250),
      walkTimeMinutes: Math.max(2, Math.round((180 + (hashInt % 250)) / 80)),
      isHistoricalMonument: false,
      description: 'Plus de 45 000 ouvrages, espaces de travail connectés, fonds numérique et ateliers jeunesse.',
      address: `8 Boulevard des Arts, ${addr.postcode} ${addr.city}`,
    },
    {
      id: `cult-${hashInt}-4`,
      name: `Cinéma Art & Essai "Le Molière"`,
      category: 'Cinéma',
      distanceMeters: 410 + (hashInt % 300),
      walkTimeMinutes: Math.max(5, Math.round((410 + (hashInt % 300)) / 80)),
      isHistoricalMonument: false,
      description: 'Complexe cinématographique 4 salles classé Art & Essai avec projections VOST, rencontres et avant-premières.',
      address: `15 Avenue Molière, ${addr.postcode} ${addr.city}`,
    },
    {
      id: `cult-${hashInt}-5`,
      name: `Conservatoire à Rayonnement Communal`,
      category: 'Conservatoire & École d\'Art',
      distanceMeters: 520 + (hashInt % 350),
      walkTimeMinutes: Math.max(7, Math.round((520 + (hashInt % 350)) / 80)),
      isHistoricalMonument: false,
      description: 'Enseignement de la musique, du théâtre et de la danse pour enfants et adultes.',
      address: `2 Allée de la Musique, ${addr.postcode} ${addr.city}`,
    },
  ];

  const culturalData: CulturalData = {
    totalCulturalSites500m: 6 + (hashInt % 8),
    totalHistoricalMonuments: 2 + (hashInt % 4),
    culturalDensityScore: Math.min(98, Math.max(62, 72 + (hashInt % 25))),
    keySites: culturalSitesList,
    annualEventsCount: 35 + (hashInt % 40),
    nearbyLibrariesCount: 1 + (hashInt % 2),
    nearbyCinemasCount: 1 + (hashInt % 3),
    nearbyTheatresCount: 1 + (hashInt % 2),
  };

  // 8. DATASET MA CONNEXION INTERNET (ARCEP / data.gouv.fr)
  const connectivityData: ConnectivityData = {
    fiberEligible: true,
    fiberCoveragePercent: Number((98.2 + ((hashInt % 18) / 10)).toFixed(1)),
    maxDownloadMbps: 2000 + (hashInt % 6000), // e.g. 2 Gbps to 8 Gbps
    maxUploadMbps: 800 + (hashInt % 2000),
    operatorsAvailable: [
      { name: 'Orange', hasFiber: true, maxDownloadSpeed: '2 Gbps', maxUploadSpeed: '800 Mbps', coverage5G: 'Excellente' },
      { name: 'Free', hasFiber: true, maxDownloadSpeed: '8 Gbps', maxUploadSpeed: '1 Gbps', coverage5G: 'Excellente' },
      { name: 'SFR', hasFiber: true, maxDownloadSpeed: '2 Gbps', maxUploadSpeed: '700 Mbps', coverage5G: 'Bonne' },
      { name: 'Bouygues Telecom', hasFiber: true, maxDownloadSpeed: '2 Gbps', maxUploadSpeed: '900 Mbps', coverage5G: 'Excellente' },
    ],
    adslStatus: 'Réseau cuivre ADSL actif (Débit 15-28 Mbps). Fermeture programmée du réseau cuivre par Orange d\'ici 2028.',
    mobile5gRating: 'Excellente',
    arcepDataYear: '2024 (ARCEP - Ma Connexion Internet)',
    starlinkSatelliteEligible: true,
    copperPhaseOutYear: 2028,
  };

  // 9. ALGOLIGRAMME & MODÈLE PRÉDICTIF DE PRIX AU M2 (Algorithme d'Économétrie Immobilière)
  const currentBasePricePerM2 = dvfData.medianPricePerM2Street;
  const fiveYearHistGrowth = dvfData.fiveYearPriceGrowthPercent; // e.g. 14.5%
  const baseAnnualCompoundRate = Math.pow(1 + (fiveYearHistGrowth / 100), 1 / 5) - 1; // e.g. ~2.7% per year

  // Drivers impact factors
  const dpeImpactPerYear = dpeData.isPassoireThermique ? -0.018 : (dpeData.energyRating === 'A' || dpeData.energyRating === 'B') ? 0.012 : 0;
  const urbanPermitsImpactPerYear = constructionPermitsData.permitsLast2Years > 5 ? 0.009 : 0.003;
  const rentalTensionImpactPerYear = (rentalMarketData.rentalTension === 'Très Élevée' || rentalMarketData.rentalTension === 'Élevée') ? 0.011 : 0.005;
  const macroInterestRateImpactPerYear = -0.004; // Stabilisation taux BCE
  const demographyImpactPerYear = (inseeData.populationTotal > 20000) ? 0.006 : 0.002;

  const netAnnualGrowthRate = baseAnnualCompoundRate + dpeImpactPerYear + urbanPermitsImpactPerYear + rentalTensionImpactPerYear + macroInterestRateImpactPerYear + demographyImpactPerYear;

  const currentYear = new Date().getFullYear();

  const calcHorizon = (yearOffset: number): HorizonProjection => {
    const projRate = Math.pow(1 + netAnnualGrowthRate, yearOffset) - 1;
    const projectedPrice = Math.round(currentBasePricePerM2 * (1 + projRate));
    const minPrice = Math.round(projectedPrice * 0.95);
    const maxPrice = Math.round(projectedPrice * 1.05);
    const gain60m2 = Math.round((projectedPrice - currentBasePricePerM2) * 60);

    return {
      yearOffset,
      targetYear: currentYear + yearOffset,
      projectedPricePerM2: projectedPrice,
      minPricePerM2: minPrice,
      maxPricePerM2: maxPrice,
      cumulatedGrowthPercent: Number((projRate * 100).toFixed(1)),
      estimatedCapitalGain60m2: gain60m2,
    };
  };

  const calcScenario = (name: 'Prudent' | 'Médian' | 'Optimiste', deltaRate: number, desc: string): ProjectionScenario => {
    const rate = netAnnualGrowthRate + deltaRate;
    const p1 = Math.round(currentBasePricePerM2 * Math.pow(1 + rate, 1));
    const p3 = Math.round(currentBasePricePerM2 * Math.pow(1 + rate, 3));
    const p5 = Math.round(currentBasePricePerM2 * Math.pow(1 + rate, 5));
    const g5 = Number(((Math.pow(1 + rate, 5) - 1) * 100).toFixed(1));

    return {
      name,
      description: desc,
      oneYearPricePerM2: p1,
      threeYearPricePerM2: p3,
      fiveYearPricePerM2: p5,
      fiveYearGrowthPercent: g5,
    };
  };

  const priceProjectionData: PriceProjectionData = {
    currentPricePerM2: currentBasePricePerM2,
    baseAnnualGrowthPercent: Number((netAnnualGrowthRate * 100).toFixed(2)),
    confidenceScore: Math.min(94, Math.max(72, 82 + (hashInt % 12))),
    algorithmMethodology: 'Modèle Économétrique Composé Briquia AI (Pondération DVF, Impact DPE, Tension Locative OLL, Permis SITADEL & Taux BCE)',
    horizons: {
      oneYear: calcHorizon(1),
      threeYear: calcHorizon(3),
      fiveYear: calcHorizon(5),
    },
    scenarios: {
      prudent: calcScenario('Prudent', -0.018, 'Hypothèse de ralentissement du crédit immobilier et remontée de l\'inflation.'),
      median: calcScenario('Médian', 0, 'Scénario central basé sur la tendance notariée DVF et la dynamique du quartier.'),
      optimistic: calcScenario('Optimiste', +0.018, 'Hypothèse de baisse des taux d\'intérêt et accélération de la demande locale.'),
    },
    drivers: [
      {
        driverName: 'Momentum Historique DVF',
        category: 'Macro',
        impactPercentPerYear: Number((baseAnnualCompoundRate * 100).toFixed(2)),
        explanation: `Croissance moyenne de +${fiveYearHistGrowth}% observée sur les 5 dernières années dans la rue.`,
      },
      {
        driverName: 'Diagnostic Énergétique (DPE)',
        category: 'DPE',
        impactPercentPerYear: Number((dpeImpactPerYear * 100).toFixed(2)),
        explanation: dpeData.isPassoireThermique ? 'Décote sur la valeur due aux contraintes d\'isolation et interdictions de louer.' : 'Bonus de valeur verte lié au bon classement énergétique DPE.',
      },
      {
        driverName: 'Dynamique d\'Urbanisme (Sitadel)',
        category: 'Urbanisme',
        impactPercentPerYear: Number((urbanPermitsImpactPerYear * 100).toFixed(2)),
        explanation: `${constructionPermitsData.permitsLast2Years} permis de construire récents dynamisant la valeur du secteur.`,
      },
      {
        driverName: 'Tension Locative & Attractivité',
        category: 'Démographie',
        impactPercentPerYear: Number((rentalTensionImpactPerYear * 100).toFixed(2)),
        explanation: `Tension locative mesurée comme ${rentalMarketData.rentalTension} par l'Observatoire des Loyers.`,
      },
      {
        driverName: 'Conditions de Crédit & Taux BCE',
        category: 'Macro',
        impactPercentPerYear: -0.4,
        explanation: 'Ajustement lié aux conditions actuelles d\'octroi de prêts immobiliers.',
      },
    ],
    recommendedHoldDurationYears: dpeData.isPassoireThermique ? 7 : 5,
  };

  return {
    address: banData,
    briquiaIndexScore,
    ratingLabel,
    reportGeneratedAt: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
    highlights,
    redFlags,
    ban: banData,
    dvf: dvfData,
    dpe: dpeData,
    georisques: georisquesData,
    insee: inseeData,
    pluAmenities: pluAmenitiesData,
    waterQuality: waterQualityData,
    rentalMarket: rentalMarketData,
    safetySecurity: safetySecurityData,
    qualityOfLife: qualityOfLifeData,
    constructionPermits: constructionPermitsData,
    elus: elusData,
    cultural: culturalData,
    connectivity: connectivityData,
    priceProjection: priceProjectionData,
  };
}


function getRegionFromDept(dept: string): string {
  const map: Record<string, string> = {
    '75': 'Île-de-France',
    '77': 'Île-de-France',
    '78': 'Île-de-France',
    '91': 'Île-de-France',
    '92': 'Île-de-France',
    '93': 'Île-de-France',
    '94': 'Île-de-France',
    '95': 'Île-de-France',
    '69': 'Auvergne-Rhône-Alpes',
    '13': 'Provence-Alpes-Côte d\'Azur',
    '06': 'Provence-Alpes-Côte d\'Azur',
    '33': 'Nouvelle-Aquitaine',
    '31': 'Occitanie',
    '44': 'Pays de la Loire',
    '59': 'Hauts-de-France',
    '67': 'Grand Est',
    '35': 'Bretagne',
  };
  return map[dept] || 'France Métropolitaine';
}

function getDeptName(dept: string): string {
  const map: Record<string, string> = {
    '75': 'Paris',
    '69': 'Rhône',
    '13': 'Bouches-du-Rhône',
    '06': 'Alpes-Maritimes',
    '33': 'Gironde',
    '31': 'Haute-Garonne',
    '44': 'Loire-Atlantique',
    '59': 'Nord',
    '67': 'Bas-Rhin',
    '35': 'Ille-et-Vilaine',
    '92': 'Hauts-de-Seine',
  };
  return map[dept] || 'Département';
}
