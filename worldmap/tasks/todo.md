# World Map Visited Countries Tracker - Implementation Plan

## Overview
Build a React + TypeScript + Vite web app that allows users to track countries they've visited on an interactive world map.

## Tech Stack
- React 18 + TypeScript
- Vite (build tool)
- react-simple-maps (map rendering)
- Tailwind CSS (styling)
- localStorage (persistence)
- Local TopoJSON file (map data)

## Todo Checklist

### Phase 1: Project Setup
- [x] Initialize Vite + React + TypeScript project
- [x] Install dependencies (react-simple-maps, tailwindcss, etc.)
- [x] Configure Tailwind CSS
- [x] Add local world TopoJSON file

### Phase 2: Core Components & Types
- [x] Create TypeScript types (Country, VisitedData, etc.)
- [x] Create localStorage helper functions (load, save, reset)
- [x] Create country data utilities (name lookup, search)

### Phase 3: Map Implementation
- [x] Build MapView component with react-simple-maps
- [x] Implement country click to toggle visited
- [x] Add hover tooltip (desktop)
- [x] Add mobile tap popover/bottom sheet

### Phase 4: UI Controls
- [x] Build search box component to find countries
- [x] Build stats summary component
- [x] Build Reset button with confirmation dialog
- [x] Build Export/Import JSON functionality

### Phase 5: Integration & Polish
- [x] Wire up all components in App.tsx
- [x] Ensure mobile-friendly responsive layout
- [x] Test localStorage persistence
- [x] Final cleanup and code organization

## File Structure (Final)
```
worldmap/
├── public/
│   └── world-110m.json          # TopoJSON world map data (local)
├── src/
│   ├── components/
│   │   ├── MapView.tsx          # Main map with zoom/pan
│   │   ├── Controls.tsx         # Search, stats, export/import buttons
│   │   ├── Tooltip.tsx          # Desktop hover tooltip
│   │   └── MobilePopover.tsx    # Mobile bottom sheet
│   ├── utils/
│   │   ├── storage.ts           # localStorage helpers
│   │   └── countries.ts         # ISO country codes & search
│   ├── types/
│   │   ├── index.ts             # TypeScript interfaces
│   │   └── react-simple-maps.d.ts # Type declarations
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Tailwind + animations
├── package.json
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## Review

### Summary of Changes
All planned features have been implemented:

1. **Interactive World Map**: Using react-simple-maps with a local TopoJSON file (world-110m.json). Countries can be clicked to toggle visited status. Map supports zoom and pan.

2. **Visual Highlighting**: Visited countries are shown in green (#22c55e), unvisited in gray. Hover states provide visual feedback. Searched countries get a blue border highlight.

3. **Persistence**: Visited data stored in localStorage using ISO 3166-1 alpha-3 codes. Data persists across browser sessions.

4. **Search Functionality**: Search box allows finding countries by name or alpha-3 code. Clicking a search result toggles visited status and highlights the country.

5. **Stats Summary**: Shows count of visited countries (e.g., "12 / 177") and percentage of the world visited with a progress bar.

6. **Export/Import**: Export downloads a JSON file with visited countries. Import validates the JSON format and updates the map.

7. **Reset with Confirmation**: Reset button shows a confirmation dialog before clearing all data.

8. **Mobile Support**:
   - Responsive layout (sidebar moves below map on mobile)
   - Touch support via bottom sheet popover instead of hover tooltips
   - Mobile-friendly button sizes and touch targets

9. **UI/UX**: Clean, modern design with Tailwind CSS. Smooth transitions and animations. No external design dependencies.

### Technical Notes
- Downgraded React to v18 for react-simple-maps compatibility
- Created custom type declarations for react-simple-maps
- ISO numeric codes from TopoJSON are mapped to alpha-3 codes for storage
- ~177 countries/territories included in the country mapping
