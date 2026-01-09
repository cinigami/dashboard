import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ObsolescenceTable from '../ObsolescenceTable';
import { mockInstrumentRows } from '../../tests/mockData';

describe('ObsolescenceTable', () => {
  it('should render title', () => {
    render(<ObsolescenceTable data={mockInstrumentRows} />);
    expect(screen.getByText('Obsolescence Panel (ALS)')).toBeInTheDocument();
  });

  it('should only show items with ALS in alarm description', () => {
    render(<ObsolescenceTable data={mockInstrumentRows} />);

    // Mock data has 2 items with "ALS" in alarm description
    // Count is now displayed separately
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Items')).toBeInTheDocument();
    expect(screen.getByText('ALS - Obsolete model')).toBeInTheDocument();
    expect(screen.getByText('ALS - Obsolete firmware')).toBeInTheDocument();
  });

  it('should display all required columns', () => {
    render(<ObsolescenceTable data={mockInstrumentRows} />);

    expect(screen.getByText('Area')).toBeInTheDocument();
    expect(screen.getByText('Equipment Type')).toBeInTheDocument();
    expect(screen.getByText('Tag Number')).toBeInTheDocument();
    expect(screen.getByText('Equipment Description')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Alarm Description')).toBeInTheDocument();
    expect(screen.getByText('Rectification')).toBeInTheDocument();
    expect(screen.getByText('Notification Date')).toBeInTheDocument();
  });

  it('should show no items message when no ALS items exist', () => {
    const dataWithoutALS = mockInstrumentRows.filter(
      row => !row.alarmDescription.toLowerCase().includes('als')
    );
    render(<ObsolescenceTable data={dataWithoutALS} />);

    expect(screen.getByText('No obsolescence items found')).toBeInTheDocument();
  });

  it('should display correct tag numbers for ALS items', () => {
    render(<ObsolescenceTable data={mockInstrumentRows} />);

    expect(screen.getByText('TT-2003')).toBeInTheDocument();
    expect(screen.getByText('AC-4003')).toBeInTheDocument();
  });
});
