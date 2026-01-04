import { useState, useCallback, memo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import { getCountryByNumericId } from '../utils/countries';
import type { CountryData, TooltipInfo, MobilePopoverInfo } from '../types';

interface MapViewProps {
  visited: string[];
  visitedSet: Set<string>;
  onToggleVisited: (alpha3: string) => void;
  onTooltipChange: (info: TooltipInfo | null) => void;
  onMobilePopoverChange: (info: MobilePopoverInfo) => void;
  highlightedCountry: string | null;
}

interface GeoType {
  rsmKey: string;
  id?: string;
  properties: {
    name?: string;
  };
}

const geoUrl = '/world-110m.json';

function MapView({
  visitedSet,
  onToggleVisited,
  onTooltipChange,
  onMobilePopoverChange,
  highlightedCountry,
}: MapViewProps) {
  const [position, setPosition] = useState({ coordinates: [0, 20] as [number, number], zoom: 1 });

  const handleMoveEnd = useCallback((pos: { coordinates: [number, number]; zoom: number }) => {
    setPosition(pos);
  }, []);

  const handleCountryClick = useCallback(
    (geo: GeoType) => {
      const id = geo.id || '';
      const country = getCountryByNumericId(id);
      if (country) {
        // Check if mobile (touch device)
        const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isMobile) {
          onMobilePopoverChange({
            country,
            isVisited: visitedSet.has(country.alpha3),
            isOpen: true,
          });
        } else {
          onToggleVisited(country.alpha3);
        }
      }
    },
    [visitedSet, onToggleVisited, onMobilePopoverChange]
  );

  const handleMouseEnter = useCallback(
    (geo: GeoType, event: React.MouseEvent) => {
      const id = geo.id || '';
      const country = getCountryByNumericId(id);
      if (country) {
        onTooltipChange({
          x: event.clientX,
          y: event.clientY,
          country,
          isVisited: visitedSet.has(country.alpha3),
        });
      }
    },
    [visitedSet, onTooltipChange]
  );

  const handleMouseMove = useCallback(
    (geo: GeoType, event: React.MouseEvent) => {
      const id = geo.id || '';
      const country = getCountryByNumericId(id);
      if (country) {
        onTooltipChange({
          x: event.clientX,
          y: event.clientY,
          country,
          isVisited: visitedSet.has(country.alpha3),
        });
      }
    },
    [visitedSet, onTooltipChange]
  );

  const handleMouseLeave = useCallback(() => {
    onTooltipChange(null);
  }, [onTooltipChange]);

  const getCountryStyle = useCallback(
    (countryData: CountryData | null) => {
      const countryVisited = countryData ? visitedSet.has(countryData.alpha3) : false;
      const isHighlighted = countryData?.alpha3 === highlightedCountry;

      return {
        default: {
          fill: countryVisited ? '#22c55e' : '#d1d5db',
          stroke: isHighlighted ? '#3b82f6' : '#9ca3af',
          strokeWidth: isHighlighted ? 2 : 0.5,
          outline: 'none',
          transition: 'all 0.2s ease',
        },
        hover: {
          fill: countryVisited ? '#16a34a' : '#9ca3af',
          stroke: '#3b82f6',
          strokeWidth: 1,
          outline: 'none',
          cursor: 'pointer',
        },
        pressed: {
          fill: countryVisited ? '#15803d' : '#6b7280',
          stroke: '#2563eb',
          strokeWidth: 1.5,
          outline: 'none',
        },
      };
    },
    [visitedSet, highlightedCountry]
  );

  return (
    <div className="w-full h-full bg-slate-100 rounded-lg overflow-hidden">
      <ComposableMap
        projectionConfig={{
          rotate: [-10, 0, 0],
          scale: 147,
        }}
        className="w-full h-full"
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
          minZoom={1}
          maxZoom={8}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }: { geographies: GeoType[] }) =>
              geographies.map((geo: GeoType) => {
                const country = getCountryByNumericId(geo.id || '');
                const style = getCountryStyle(country);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleCountryClick(geo)}
                    onMouseEnter={(e: React.MouseEvent<SVGPathElement>) => handleMouseEnter(geo, e)}
                    onMouseMove={(e: React.MouseEvent<SVGPathElement>) => handleMouseMove(geo, e)}
                    onMouseLeave={handleMouseLeave}
                    style={style}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}

export default memo(MapView);
