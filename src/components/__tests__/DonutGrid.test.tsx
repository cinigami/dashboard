import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import DonutGrid from '../DonutGrid';
import { mockInstrumentRows } from '../../tests/mockData';
import type { FilterState } from '../../utils/types';

describe('DonutGrid', () => {
  const mockFilters: FilterState = {
    areas: [],
    equipmentTypes: [],
    statuses: [],
    dateFrom: null,
    dateTo: null,
    searchText: '',
    sortBy: 'date-desc',
  };

  const onStatusToggle = vi.fn();

  it('should render title', () => {
    render(
      <DonutGrid data={mockInstrumentRows} filters={mockFilters} onStatusToggle={onStatusToggle} />
    );
    expect(screen.getByText('Status Distribution by Equipment Type')).toBeInTheDocument();
  });

  it('should render instruction text', () => {
    render(
      <DonutGrid data={mockInstrumentRows} filters={mockFilters} onStatusToggle={onStatusToggle} />
    );
    expect(screen.getByText(/Click on any segment to filter by status/)).toBeInTheDocument();
  });

  it('should show no data message when data is empty', () => {
    render(<DonutGrid data={[]} filters={mockFilters} onStatusToggle={onStatusToggle} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('should display equipment types as card headers', () => {
    render(
      <DonutGrid data={mockInstrumentRows} filters={mockFilters} onStatusToggle={onStatusToggle} />
    );

    expect(screen.getByText('Flow Transmitter')).toBeInTheDocument();
    expect(screen.getByText('Pressure Transmitter')).toBeInTheDocument();
    expect(screen.getByText('Temperature Transmitter')).toBeInTheDocument();
  });

  it('should show single donut when one equipment type is filtered', () => {
    const singleTypeFilter: FilterState = {
      ...mockFilters,
      equipmentTypes: ['Flow Transmitter'],
    };

    render(
      <DonutGrid
        data={mockInstrumentRows.filter(r => r.equipmentType === 'Flow Transmitter')}
        filters={singleTypeFilter}
        onStatusToggle={onStatusToggle}
      />
    );

    // Should only show one equipment type heading
    const flowTransmitters = screen.getAllByText('Flow Transmitter');
    expect(flowTransmitters).toHaveLength(1);
  });
});
