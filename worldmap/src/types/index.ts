export interface CountryData {
  id: string; // ISO 3166-1 numeric code from TopoJSON
  name: string;
  alpha3: string; // ISO 3166-1 alpha-3 code for storage
}

export interface VisitedData {
  visited: string[]; // Array of ISO 3166-1 alpha-3 codes
  lastUpdated: string; // ISO date string
}

export interface TooltipInfo {
  x: number;
  y: number;
  country: CountryData | null;
  isVisited: boolean;
}

export interface MobilePopoverInfo {
  country: CountryData | null;
  isVisited: boolean;
  isOpen: boolean;
}

export interface Geography {
  rsmKey: string;
  properties: {
    name: string;
  };
  id: string;
}
