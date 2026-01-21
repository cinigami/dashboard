# Excel Upload Feature - Refresh Dashboard Data

## Overview
Add functionality to refresh the dashboard by uploading an Excel file containing project data.

## Plan

- [x] Install `xlsx` library for Excel parsing
- [x] Create `ExcelUpload` component with drag-and-drop + file picker UI
- [x] Create Excel parser utility to map Excel columns to Project type
- [x] Update App.tsx to manage uploaded data state (fallback to mockData)
- [x] Add upload button to Header component

## Expected Excel Structure
The Excel file should have columns matching the Project interface:
- id, name, discipline, status, priority
- originalBudget, contractValue, currentBudget
- actualSpend, plannedSpend, remaining
- startDate, endDate, lastUpdated
- vendor, riskLevel, notes

## Technical Notes
- Data will persist only during session (no backend storage)
- Invalid rows will be skipped with warning
- Upload will replace all existing data

---

## Review Summary

### Changes Made

1. **Installed `xlsx` library** - Added Excel/CSV parsing capability

2. **Created `src/utils/excelParser.ts`** - Excel parser utility that:
   - Maps various column name formats to Project fields (e.g., "Name", "name", "Project Name")
   - Parses numbers, dates (including Excel serial dates), and enums
   - Returns parsed projects with error reporting for invalid rows

3. **Created `src/components/ExcelUploadModal.tsx`** - Upload modal with:
   - Drag-and-drop support
   - File picker button
   - Loading state with spinner
   - Parse results preview (shows first 3 projects)
   - Error/warning display for skipped rows
   - PETRONAS-branded styling

4. **Updated `src/App.tsx`**:
   - Added `uploadedProjects` state to store uploaded data
   - Added `isUploadModalOpen` state for modal visibility
   - Dashboard now uses uploaded data if available, otherwise falls back to mock data
   - Disciplines list dynamically updates based on active data

5. **Updated `src/components/Header.tsx`**:
   - Added "Upload Excel" button in the top bar
   - Shows green checkmark when data has been uploaded
   - Accepts `onUploadClick` and `hasUploadedData` props
