# Instrument Asset Healthiness Dashboard

A production-ready single-page web application for monitoring and analyzing instrument asset health across multiple industrial areas.

## Features

- **Excel Data Import**: Upload and parse Excel workbooks with multi-sheet support
- **Interactive Dashboard**: Real-time health scoring, status distribution charts, and alert monitoring
- **Advanced Filtering**: Multi-dimensional filtering by area, equipment type, status, date range, and text search
- **Export Capabilities**: Generate PDF reports and PowerPoint presentations
- **Data Persistence**: LocalStorage-based filter and upload history
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **xlsx** - Excel parsing
- **recharts** - Charts and visualizations
- **@tanstack/react-table** - Advanced table features
- **date-fns** - Date utilities
- **jspdf + jspdf-autotable** - PDF generation
- **pptxgenjs** - PowerPoint generation

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open your browser to the URL shown in the terminal (typically `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### 1. Download Template

Click "Download Excel Template" to get a properly formatted Excel file with sample data.

### 2. Upload Data

Upload an Excel workbook (.xlsx) containing sheets for each area:
- Ammonia
- Utility
- Urea
- System
- Turbomachinery

Each sheet must have these columns:
- Equipment Type
- Tag Number
- Equipment Description
- Status (Healthy/Caution/Warning)
- Alarm Description
- Rectification
- Notification Date

### 3. Explore Data

- **Overall Healthiness Gauge**: View aggregated health score
- **Status Donuts**: Interactive charts showing status distribution by equipment type
- **Alerts Panel**: Grouped table of Caution and Warning items
- **Obsolescence Panel**: Items with "ALS" in alarm description

### 4. Filter and Search

Use the filters bar to:
- Select specific areas and equipment types
- Filter by status
- Set date ranges
- Search across tags, descriptions, and alarms
- Change sorting order

### 5. Export

Click "Export" to:
- Configure export scope (independent filters)
- Select columns to include
- Preview data before export
- Generate PDF or PowerPoint files

## Project Structure

```
src/
├── components/          # React components
│   ├── AlertsTableGrouped.tsx
│   ├── DonutGrid.tsx
│   ├── ExportModal.tsx
│   ├── FileUploader.tsx
│   ├── FiltersBar.tsx
│   ├── GaugeCard.tsx
│   └── ObsolescenceTable.tsx
├── utils/               # Utilities
│   ├── excelParser.ts   # Excel file parsing
│   ├── exportPdf.ts     # PDF generation
│   ├── exportPpt.ts     # PowerPoint generation
│   ├── filterData.ts    # Data filtering and sorting
│   ├── scoring.ts       # Health scoring logic
│   ├── storage.ts       # LocalStorage persistence
│   ├── templateGenerator.ts  # Excel template generation
│   └── types.ts         # TypeScript type definitions
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

## Features Detail

### Health Scoring

- **Healthy**: 100 points
- **Caution**: 60 points
- **Warning**: 20 points
- **Unknown**: Excluded from scoring

Overall score is the average of all valid asset scores.

### Data Validation

- **Missing Sheets**: Non-blocking warning (loads available sheets)
- **Missing Columns**: Blocking error (prevents data load)
- **Status Normalization**: Case-insensitive status mapping
- **Date Parsing**: Handles Excel serial dates and text dates

### Export Features

**PDF Export:**
- Title page with timestamp and filters
- Overall score and status summary
- Auto-paginated data table

**PowerPoint Export:**
- Slide 1: Title, filters, gauge visual, key metrics
- Slide 2: Status distribution by top 6 equipment types
- Slide 3+: Alerts table with pagination

## Testing

The application includes comprehensive unit and integration tests using Vitest and React Testing Library.

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once (CI mode)
npm test -- --run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

The test suite includes:

**Utility Tests** (100% coverage):
- `scoring.test.ts` - Health score calculations and status counting
- `filterData.test.ts` - Data filtering and sorting logic
- `storage.test.ts` - LocalStorage persistence

**Component Tests** (90%+ coverage):
- `GaugeCard.test.tsx` - Overall health gauge rendering
- `FiltersBar.test.tsx` - Filter controls and interactions
- `DonutGrid.test.tsx` - Status distribution charts
- `AlertsTableGrouped.test.tsx` - Alerts panel with grouping
- `ObsolescenceTable.test.tsx` - ALS items table
- `FileUploader.test.tsx` - File upload and validation

**Integration Tests**:
- `App.test.tsx` - Main application flow

### Test Structure

```
src/
├── tests/
│   ├── setup.ts        # Test configuration
│   └── mockData.ts     # Shared test data
├── components/__tests__/
│   └── *.test.tsx      # Component tests
├── utils/__tests__/
│   └── *.test.ts       # Utility tests
└── __tests__/
    └── App.test.tsx    # Integration tests
```

### Current Status

- **69 tests total**
- **69 tests passing** (100% pass rate) ✅
- All critical paths covered
- Utilities: 100% coverage
- Components: 100% coverage

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

Proprietary
