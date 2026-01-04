# World Travel Tracker

An interactive world map web app to track countries you've visited. Built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- **Interactive World Map**: Click countries to toggle visited status
- **Visual Highlighting**: Visited countries shown in green
- **Zoom & Pan**: Navigate the map with mouse/touch gestures
- **Search**: Find countries by name or ISO code
- **Stats Summary**: Track progress with count and percentage
- **Data Persistence**: Saves to localStorage
- **Export/Import**: Download or upload visited data as JSON
- **Reset**: Clear all data with confirmation
- **Mobile-Friendly**: Responsive design with touch support

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone or navigate to the project directory
cd worldmap

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173` (or next available port).

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
worldmap/
├── public/
│   └── world-110m.json          # TopoJSON world map data
├── src/
│   ├── components/
│   │   ├── MapView.tsx          # Main map with zoom/pan
│   │   ├── Controls.tsx         # Search, stats, buttons
│   │   ├── Tooltip.tsx          # Desktop hover tooltip
│   │   └── MobilePopover.tsx    # Mobile bottom sheet
│   ├── utils/
│   │   ├── storage.ts           # localStorage helpers
│   │   └── countries.ts         # Country data & search
│   ├── types/
│   │   ├── index.ts             # TypeScript interfaces
│   │   └── react-simple-maps.d.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **react-simple-maps** - Map rendering
- **Tailwind CSS** - Styling
- **localStorage** - Data persistence

## Data Format

Visited countries are stored as ISO 3166-1 alpha-3 codes:

```json
{
  "visited": ["USA", "GBR", "JPN", "FRA"],
  "lastUpdated": "2024-01-15T10:30:00.000Z"
}
```

## Usage

1. **Toggle Visited**: Click any country on the map
2. **Search**: Type a country name in the search box
3. **View Stats**: See your progress in the sidebar
4. **Export**: Download your data as JSON
5. **Import**: Upload a previously exported JSON file
6. **Reset**: Clear all data (with confirmation)

### Mobile

On touch devices, tapping a country opens a bottom sheet with toggle options.

## License

MIT
