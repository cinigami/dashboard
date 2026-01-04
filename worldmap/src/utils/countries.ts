import type { CountryData } from '../types';

// ISO 3166-1 mapping: numeric code -> { name, alpha3 }
// This maps the TopoJSON IDs to alpha-3 codes for storage
const COUNTRY_MAP: Record<string, { name: string; alpha3: string }> = {
  '004': { name: 'Afghanistan', alpha3: 'AFG' },
  '008': { name: 'Albania', alpha3: 'ALB' },
  '012': { name: 'Algeria', alpha3: 'DZA' },
  '020': { name: 'Andorra', alpha3: 'AND' },
  '024': { name: 'Angola', alpha3: 'AGO' },
  '028': { name: 'Antigua and Barbuda', alpha3: 'ATG' },
  '031': { name: 'Azerbaijan', alpha3: 'AZE' },
  '032': { name: 'Argentina', alpha3: 'ARG' },
  '036': { name: 'Australia', alpha3: 'AUS' },
  '040': { name: 'Austria', alpha3: 'AUT' },
  '044': { name: 'Bahamas', alpha3: 'BHS' },
  '048': { name: 'Bahrain', alpha3: 'BHR' },
  '050': { name: 'Bangladesh', alpha3: 'BGD' },
  '051': { name: 'Armenia', alpha3: 'ARM' },
  '052': { name: 'Barbados', alpha3: 'BRB' },
  '056': { name: 'Belgium', alpha3: 'BEL' },
  '060': { name: 'Bermuda', alpha3: 'BMU' },
  '064': { name: 'Bhutan', alpha3: 'BTN' },
  '068': { name: 'Bolivia', alpha3: 'BOL' },
  '070': { name: 'Bosnia and Herzegovina', alpha3: 'BIH' },
  '072': { name: 'Botswana', alpha3: 'BWA' },
  '076': { name: 'Brazil', alpha3: 'BRA' },
  '084': { name: 'Belize', alpha3: 'BLZ' },
  '090': { name: 'Solomon Islands', alpha3: 'SLB' },
  '092': { name: 'British Virgin Islands', alpha3: 'VGB' },
  '096': { name: 'Brunei', alpha3: 'BRN' },
  '100': { name: 'Bulgaria', alpha3: 'BGR' },
  '104': { name: 'Myanmar', alpha3: 'MMR' },
  '108': { name: 'Burundi', alpha3: 'BDI' },
  '112': { name: 'Belarus', alpha3: 'BLR' },
  '116': { name: 'Cambodia', alpha3: 'KHM' },
  '120': { name: 'Cameroon', alpha3: 'CMR' },
  '124': { name: 'Canada', alpha3: 'CAN' },
  '132': { name: 'Cape Verde', alpha3: 'CPV' },
  '140': { name: 'Central African Republic', alpha3: 'CAF' },
  '144': { name: 'Sri Lanka', alpha3: 'LKA' },
  '148': { name: 'Chad', alpha3: 'TCD' },
  '152': { name: 'Chile', alpha3: 'CHL' },
  '156': { name: 'China', alpha3: 'CHN' },
  '158': { name: 'Taiwan', alpha3: 'TWN' },
  '170': { name: 'Colombia', alpha3: 'COL' },
  '174': { name: 'Comoros', alpha3: 'COM' },
  '175': { name: 'Mayotte', alpha3: 'MYT' },
  '178': { name: 'Congo', alpha3: 'COG' },
  '180': { name: 'Democratic Republic of the Congo', alpha3: 'COD' },
  '184': { name: 'Cook Islands', alpha3: 'COK' },
  '188': { name: 'Costa Rica', alpha3: 'CRI' },
  '191': { name: 'Croatia', alpha3: 'HRV' },
  '192': { name: 'Cuba', alpha3: 'CUB' },
  '196': { name: 'Cyprus', alpha3: 'CYP' },
  '203': { name: 'Czechia', alpha3: 'CZE' },
  '204': { name: 'Benin', alpha3: 'BEN' },
  '208': { name: 'Denmark', alpha3: 'DNK' },
  '212': { name: 'Dominica', alpha3: 'DMA' },
  '214': { name: 'Dominican Republic', alpha3: 'DOM' },
  '218': { name: 'Ecuador', alpha3: 'ECU' },
  '222': { name: 'El Salvador', alpha3: 'SLV' },
  '226': { name: 'Equatorial Guinea', alpha3: 'GNQ' },
  '231': { name: 'Ethiopia', alpha3: 'ETH' },
  '232': { name: 'Eritrea', alpha3: 'ERI' },
  '233': { name: 'Estonia', alpha3: 'EST' },
  '234': { name: 'Faroe Islands', alpha3: 'FRO' },
  '238': { name: 'Falkland Islands', alpha3: 'FLK' },
  '242': { name: 'Fiji', alpha3: 'FJI' },
  '246': { name: 'Finland', alpha3: 'FIN' },
  '248': { name: 'Åland Islands', alpha3: 'ALA' },
  '250': { name: 'France', alpha3: 'FRA' },
  '254': { name: 'French Guiana', alpha3: 'GUF' },
  '258': { name: 'French Polynesia', alpha3: 'PYF' },
  '260': { name: 'French Southern Territories', alpha3: 'ATF' },
  '262': { name: 'Djibouti', alpha3: 'DJI' },
  '266': { name: 'Gabon', alpha3: 'GAB' },
  '268': { name: 'Georgia', alpha3: 'GEO' },
  '270': { name: 'Gambia', alpha3: 'GMB' },
  '275': { name: 'Palestine', alpha3: 'PSE' },
  '276': { name: 'Germany', alpha3: 'DEU' },
  '288': { name: 'Ghana', alpha3: 'GHA' },
  '296': { name: 'Kiribati', alpha3: 'KIR' },
  '300': { name: 'Greece', alpha3: 'GRC' },
  '304': { name: 'Greenland', alpha3: 'GRL' },
  '308': { name: 'Grenada', alpha3: 'GRD' },
  '312': { name: 'Guadeloupe', alpha3: 'GLP' },
  '316': { name: 'Guam', alpha3: 'GUM' },
  '320': { name: 'Guatemala', alpha3: 'GTM' },
  '324': { name: 'Guinea', alpha3: 'GIN' },
  '328': { name: 'Guyana', alpha3: 'GUY' },
  '332': { name: 'Haiti', alpha3: 'HTI' },
  '336': { name: 'Vatican City', alpha3: 'VAT' },
  '340': { name: 'Honduras', alpha3: 'HND' },
  '344': { name: 'Hong Kong', alpha3: 'HKG' },
  '348': { name: 'Hungary', alpha3: 'HUN' },
  '352': { name: 'Iceland', alpha3: 'ISL' },
  '356': { name: 'India', alpha3: 'IND' },
  '360': { name: 'Indonesia', alpha3: 'IDN' },
  '364': { name: 'Iran', alpha3: 'IRN' },
  '368': { name: 'Iraq', alpha3: 'IRQ' },
  '372': { name: 'Ireland', alpha3: 'IRL' },
  '376': { name: 'Israel', alpha3: 'ISR' },
  '380': { name: 'Italy', alpha3: 'ITA' },
  '384': { name: "Côte d'Ivoire", alpha3: 'CIV' },
  '388': { name: 'Jamaica', alpha3: 'JAM' },
  '392': { name: 'Japan', alpha3: 'JPN' },
  '398': { name: 'Kazakhstan', alpha3: 'KAZ' },
  '400': { name: 'Jordan', alpha3: 'JOR' },
  '404': { name: 'Kenya', alpha3: 'KEN' },
  '408': { name: 'North Korea', alpha3: 'PRK' },
  '410': { name: 'South Korea', alpha3: 'KOR' },
  '414': { name: 'Kuwait', alpha3: 'KWT' },
  '417': { name: 'Kyrgyzstan', alpha3: 'KGZ' },
  '418': { name: 'Laos', alpha3: 'LAO' },
  '422': { name: 'Lebanon', alpha3: 'LBN' },
  '426': { name: 'Lesotho', alpha3: 'LSO' },
  '428': { name: 'Latvia', alpha3: 'LVA' },
  '430': { name: 'Liberia', alpha3: 'LBR' },
  '434': { name: 'Libya', alpha3: 'LBY' },
  '438': { name: 'Liechtenstein', alpha3: 'LIE' },
  '440': { name: 'Lithuania', alpha3: 'LTU' },
  '442': { name: 'Luxembourg', alpha3: 'LUX' },
  '446': { name: 'Macao', alpha3: 'MAC' },
  '450': { name: 'Madagascar', alpha3: 'MDG' },
  '454': { name: 'Malawi', alpha3: 'MWI' },
  '458': { name: 'Malaysia', alpha3: 'MYS' },
  '462': { name: 'Maldives', alpha3: 'MDV' },
  '466': { name: 'Mali', alpha3: 'MLI' },
  '470': { name: 'Malta', alpha3: 'MLT' },
  '474': { name: 'Martinique', alpha3: 'MTQ' },
  '478': { name: 'Mauritania', alpha3: 'MRT' },
  '480': { name: 'Mauritius', alpha3: 'MUS' },
  '484': { name: 'Mexico', alpha3: 'MEX' },
  '492': { name: 'Monaco', alpha3: 'MCO' },
  '496': { name: 'Mongolia', alpha3: 'MNG' },
  '498': { name: 'Moldova', alpha3: 'MDA' },
  '499': { name: 'Montenegro', alpha3: 'MNE' },
  '500': { name: 'Montserrat', alpha3: 'MSR' },
  '504': { name: 'Morocco', alpha3: 'MAR' },
  '508': { name: 'Mozambique', alpha3: 'MOZ' },
  '512': { name: 'Oman', alpha3: 'OMN' },
  '516': { name: 'Namibia', alpha3: 'NAM' },
  '520': { name: 'Nauru', alpha3: 'NRU' },
  '524': { name: 'Nepal', alpha3: 'NPL' },
  '528': { name: 'Netherlands', alpha3: 'NLD' },
  '531': { name: 'Curaçao', alpha3: 'CUW' },
  '533': { name: 'Aruba', alpha3: 'ABW' },
  '534': { name: 'Sint Maarten', alpha3: 'SXM' },
  '535': { name: 'Caribbean Netherlands', alpha3: 'BES' },
  '540': { name: 'New Caledonia', alpha3: 'NCL' },
  '548': { name: 'Vanuatu', alpha3: 'VUT' },
  '554': { name: 'New Zealand', alpha3: 'NZL' },
  '558': { name: 'Nicaragua', alpha3: 'NIC' },
  '562': { name: 'Niger', alpha3: 'NER' },
  '566': { name: 'Nigeria', alpha3: 'NGA' },
  '570': { name: 'Niue', alpha3: 'NIU' },
  '574': { name: 'Norfolk Island', alpha3: 'NFK' },
  '578': { name: 'Norway', alpha3: 'NOR' },
  '580': { name: 'Northern Mariana Islands', alpha3: 'MNP' },
  '581': { name: 'United States Minor Outlying Islands', alpha3: 'UMI' },
  '583': { name: 'Micronesia', alpha3: 'FSM' },
  '584': { name: 'Marshall Islands', alpha3: 'MHL' },
  '585': { name: 'Palau', alpha3: 'PLW' },
  '586': { name: 'Pakistan', alpha3: 'PAK' },
  '591': { name: 'Panama', alpha3: 'PAN' },
  '598': { name: 'Papua New Guinea', alpha3: 'PNG' },
  '600': { name: 'Paraguay', alpha3: 'PRY' },
  '604': { name: 'Peru', alpha3: 'PER' },
  '608': { name: 'Philippines', alpha3: 'PHL' },
  '612': { name: 'Pitcairn Islands', alpha3: 'PCN' },
  '616': { name: 'Poland', alpha3: 'POL' },
  '620': { name: 'Portugal', alpha3: 'PRT' },
  '624': { name: 'Guinea-Bissau', alpha3: 'GNB' },
  '626': { name: 'Timor-Leste', alpha3: 'TLS' },
  '630': { name: 'Puerto Rico', alpha3: 'PRI' },
  '634': { name: 'Qatar', alpha3: 'QAT' },
  '638': { name: 'Réunion', alpha3: 'REU' },
  '642': { name: 'Romania', alpha3: 'ROU' },
  '643': { name: 'Russia', alpha3: 'RUS' },
  '646': { name: 'Rwanda', alpha3: 'RWA' },
  '652': { name: 'Saint Barthélemy', alpha3: 'BLM' },
  '654': { name: 'Saint Helena', alpha3: 'SHN' },
  '659': { name: 'Saint Kitts and Nevis', alpha3: 'KNA' },
  '660': { name: 'Anguilla', alpha3: 'AIA' },
  '662': { name: 'Saint Lucia', alpha3: 'LCA' },
  '663': { name: 'Saint Martin', alpha3: 'MAF' },
  '666': { name: 'Saint Pierre and Miquelon', alpha3: 'SPM' },
  '670': { name: 'Saint Vincent and the Grenadines', alpha3: 'VCT' },
  '674': { name: 'San Marino', alpha3: 'SMR' },
  '678': { name: 'São Tomé and Príncipe', alpha3: 'STP' },
  '682': { name: 'Saudi Arabia', alpha3: 'SAU' },
  '686': { name: 'Senegal', alpha3: 'SEN' },
  '688': { name: 'Serbia', alpha3: 'SRB' },
  '690': { name: 'Seychelles', alpha3: 'SYC' },
  '694': { name: 'Sierra Leone', alpha3: 'SLE' },
  '702': { name: 'Singapore', alpha3: 'SGP' },
  '703': { name: 'Slovakia', alpha3: 'SVK' },
  '704': { name: 'Vietnam', alpha3: 'VNM' },
  '705': { name: 'Slovenia', alpha3: 'SVN' },
  '706': { name: 'Somalia', alpha3: 'SOM' },
  '710': { name: 'South Africa', alpha3: 'ZAF' },
  '716': { name: 'Zimbabwe', alpha3: 'ZWE' },
  '724': { name: 'Spain', alpha3: 'ESP' },
  '728': { name: 'South Sudan', alpha3: 'SSD' },
  '729': { name: 'Sudan', alpha3: 'SDN' },
  '732': { name: 'Western Sahara', alpha3: 'ESH' },
  '740': { name: 'Suriname', alpha3: 'SUR' },
  '744': { name: 'Svalbard and Jan Mayen', alpha3: 'SJM' },
  '748': { name: 'Eswatini', alpha3: 'SWZ' },
  '752': { name: 'Sweden', alpha3: 'SWE' },
  '756': { name: 'Switzerland', alpha3: 'CHE' },
  '760': { name: 'Syria', alpha3: 'SYR' },
  '762': { name: 'Tajikistan', alpha3: 'TJK' },
  '764': { name: 'Thailand', alpha3: 'THA' },
  '768': { name: 'Togo', alpha3: 'TGO' },
  '772': { name: 'Tokelau', alpha3: 'TKL' },
  '776': { name: 'Tonga', alpha3: 'TON' },
  '780': { name: 'Trinidad and Tobago', alpha3: 'TTO' },
  '784': { name: 'United Arab Emirates', alpha3: 'ARE' },
  '788': { name: 'Tunisia', alpha3: 'TUN' },
  '792': { name: 'Turkey', alpha3: 'TUR' },
  '795': { name: 'Turkmenistan', alpha3: 'TKM' },
  '796': { name: 'Turks and Caicos Islands', alpha3: 'TCA' },
  '798': { name: 'Tuvalu', alpha3: 'TUV' },
  '800': { name: 'Uganda', alpha3: 'UGA' },
  '804': { name: 'Ukraine', alpha3: 'UKR' },
  '807': { name: 'North Macedonia', alpha3: 'MKD' },
  '818': { name: 'Egypt', alpha3: 'EGY' },
  '826': { name: 'United Kingdom', alpha3: 'GBR' },
  '831': { name: 'Guernsey', alpha3: 'GGY' },
  '832': { name: 'Jersey', alpha3: 'JEY' },
  '833': { name: 'Isle of Man', alpha3: 'IMN' },
  '834': { name: 'Tanzania', alpha3: 'TZA' },
  '840': { name: 'United States', alpha3: 'USA' },
  '850': { name: 'U.S. Virgin Islands', alpha3: 'VIR' },
  '854': { name: 'Burkina Faso', alpha3: 'BFA' },
  '858': { name: 'Uruguay', alpha3: 'URY' },
  '860': { name: 'Uzbekistan', alpha3: 'UZB' },
  '862': { name: 'Venezuela', alpha3: 'VEN' },
  '876': { name: 'Wallis and Futuna', alpha3: 'WLF' },
  '882': { name: 'Samoa', alpha3: 'WSM' },
  '887': { name: 'Yemen', alpha3: 'YEM' },
  '894': { name: 'Zambia', alpha3: 'ZMB' },
  // Kosovo (not officially ISO but used in some datasets)
  '-99': { name: 'Kosovo', alpha3: 'XKX' },
  // Northern Cyprus (disputed)
  '-1': { name: 'Northern Cyprus', alpha3: 'XNC' },
  // Somaliland (disputed)
  '-2': { name: 'Somaliland', alpha3: 'XSO' },
};

// Reverse mapping: alpha3 -> numeric code
const ALPHA3_TO_NUMERIC: Record<string, string> = {};
Object.entries(COUNTRY_MAP).forEach(([numeric, data]) => {
  ALPHA3_TO_NUMERIC[data.alpha3] = numeric;
});

export function getCountryByNumericId(numericId: string): CountryData | null {
  // Pad numeric ID to 3 digits if needed
  const paddedId = numericId.padStart(3, '0');
  const country = COUNTRY_MAP[paddedId] || COUNTRY_MAP[numericId];
  if (country) {
    return {
      id: numericId,
      name: country.name,
      alpha3: country.alpha3,
    };
  }
  return null;
}

export function getCountryByAlpha3(alpha3: string): CountryData | null {
  const numericId = ALPHA3_TO_NUMERIC[alpha3];
  if (numericId) {
    const country = COUNTRY_MAP[numericId];
    return {
      id: numericId,
      name: country.name,
      alpha3: country.alpha3,
    };
  }
  return null;
}

export function getAllCountries(): CountryData[] {
  return Object.entries(COUNTRY_MAP).map(([id, data]) => ({
    id,
    name: data.name,
    alpha3: data.alpha3,
  }));
}

export function searchCountries(query: string): CountryData[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return [];

  return getAllCountries().filter(
    (country) =>
      country.name.toLowerCase().includes(lowerQuery) ||
      country.alpha3.toLowerCase().includes(lowerQuery)
  );
}

export function isVisited(alpha3: string, visitedList: string[]): boolean {
  return visitedList.includes(alpha3);
}

export function toggleVisited(alpha3: string, visitedList: string[]): string[] {
  if (isVisited(alpha3, visitedList)) {
    return visitedList.filter((code) => code !== alpha3);
  }
  return [...visitedList, alpha3];
}
