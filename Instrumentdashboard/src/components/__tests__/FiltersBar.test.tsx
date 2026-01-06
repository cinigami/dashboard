import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FiltersBar from '../FiltersBar';
import type { FilterState } from '../../utils/types';

describe('FiltersBar', () => {
  const mockFilters: FilterState = {
    areas: ['Ammonia', 'Utility', 'Urea', 'System', 'Turbomachinery'],
    equipmentTypes: [],
    statuses: [],
    dateFrom: null,
    dateTo: null,
    searchText: '',
    sortBy: 'date-desc',
  };

  const mockEquipmentTypes = ['Flow Transmitter', 'Pressure Transmitter', 'Temperature Transmitter'];

  it('should render filters title', () => {
    const onFiltersChange = vi.fn();
    render(
      <FiltersBar
        filters={mockFilters}
        availableEquipmentTypes={mockEquipmentTypes}
        onFiltersChange={onFiltersChange}
      />
    );
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('should render all area checkboxes', () => {
    const onFiltersChange = vi.fn();
    render(
      <FiltersBar
        filters={mockFilters}
        availableEquipmentTypes={mockEquipmentTypes}
        onFiltersChange={onFiltersChange}
      />
    );

    expect(screen.getByLabelText('Ammonia')).toBeInTheDocument();
    expect(screen.getByLabelText('Utility')).toBeInTheDocument();
    expect(screen.getByLabelText('Urea')).toBeInTheDocument();
    expect(screen.getByLabelText('System')).toBeInTheDocument();
    expect(screen.getByLabelText('Turbomachinery')).toBeInTheDocument();
  });

  it('should render equipment type checkboxes', () => {
    const onFiltersChange = vi.fn();
    render(
      <FiltersBar
        filters={mockFilters}
        availableEquipmentTypes={mockEquipmentTypes}
        onFiltersChange={onFiltersChange}
      />
    );

    expect(screen.getByLabelText('Flow Transmitter')).toBeInTheDocument();
    expect(screen.getByLabelText('Pressure Transmitter')).toBeInTheDocument();
    expect(screen.getByLabelText('Temperature Transmitter')).toBeInTheDocument();
  });

  it('should render status checkboxes', () => {
    const onFiltersChange = vi.fn();
    render(
      <FiltersBar
        filters={mockFilters}
        availableEquipmentTypes={mockEquipmentTypes}
        onFiltersChange={onFiltersChange}
      />
    );

    expect(screen.getByLabelText('Healthy')).toBeInTheDocument();
    expect(screen.getByLabelText('Caution')).toBeInTheDocument();
    expect(screen.getByLabelText('Warning')).toBeInTheDocument();
  });

  it('should call onFiltersChange when area is toggled', async () => {
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();
    render(
      <FiltersBar
        filters={mockFilters}
        availableEquipmentTypes={mockEquipmentTypes}
        onFiltersChange={onFiltersChange}
      />
    );

    const ammoniaCheckbox = screen.getByLabelText('Ammonia');
    await user.click(ammoniaCheckbox);

    expect(onFiltersChange).toHaveBeenCalled();
  });

  it('should call onFiltersChange when search text changes', async () => {
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();
    render(
      <FiltersBar
        filters={mockFilters}
        availableEquipmentTypes={mockEquipmentTypes}
        onFiltersChange={onFiltersChange}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Tag, Description, Alarm/);
    await user.type(searchInput, 'test');

    expect(onFiltersChange).toHaveBeenCalled();
  });

  it('should call onFiltersChange when sort changes', async () => {
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();
    render(
      <FiltersBar
        filters={mockFilters}
        availableEquipmentTypes={mockEquipmentTypes}
        onFiltersChange={onFiltersChange}
      />
    );

    const sortSelect = screen.getByDisplayValue('Notification Date (Newest)');
    await user.selectOptions(sortSelect, 'tag-asc');

    expect(onFiltersChange).toHaveBeenCalled();
  });

  it('should clear all filters when Clear All is clicked', async () => {
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();
    render(
      <FiltersBar
        filters={{ ...mockFilters, searchText: 'test', statuses: ['Healthy'] }}
        availableEquipmentTypes={mockEquipmentTypes}
        onFiltersChange={onFiltersChange}
      />
    );

    const clearButton = screen.getByText('Clear All');
    await user.click(clearButton);

    expect(onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({
        searchText: '',
        statuses: [],
        equipmentTypes: [],
      })
    );
  });
});
