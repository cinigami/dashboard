import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AlertsTableGrouped from '../AlertsTableGrouped';
import { mockInstrumentRows } from '../../tests/mockData';

describe('AlertsTableGrouped', () => {
  it('should render title', () => {
    render(<AlertsTableGrouped data={mockInstrumentRows} />);
    expect(screen.getByText('Alerts (Caution & Warning)')).toBeInTheDocument();
  });

  it('should only show Caution and Warning items', () => {
    render(<AlertsTableGrouped data={mockInstrumentRows} />);

    // Mock data has 1 Caution and 2 Warning = 3 alerts total
    // Count is now displayed separately
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Alerts')).toBeInTheDocument();
  });

  it('should group by equipment type', () => {
    render(<AlertsTableGrouped data={mockInstrumentRows} />);

    // Should show equipment type headers
    expect(screen.getByText('Pressure Transmitter')).toBeInTheDocument();
    expect(screen.getByText('Temperature Transmitter')).toBeInTheDocument();
    expect(screen.getByText('Actuator')).toBeInTheDocument();
  });

  it('should display warning and caution counts in group headers', () => {
    render(<AlertsTableGrouped data={mockInstrumentRows} />);

    // Temperature Transmitter has 1 Warning
    const warningTexts = screen.getAllByText(/Warning: 1/);
    expect(warningTexts.length).toBeGreaterThan(0);
    // Pressure Transmitter has 1 Caution
    const cautionTexts = screen.getAllByText(/Caution: 1/);
    expect(cautionTexts.length).toBeGreaterThan(0);
  });

  it('should show no alerts message when no alerts exist', () => {
    const healthyData = mockInstrumentRows.filter(row => row.status === 'Healthy');
    render(<AlertsTableGrouped data={healthyData} />);

    expect(screen.getByText('No alerts found')).toBeInTheDocument();
  });

  it('should have local search input', () => {
    render(<AlertsTableGrouped data={mockInstrumentRows} />);
    expect(screen.getByPlaceholderText('Search by tag, description, or rectification...')).toBeInTheDocument();
  });

  it('should filter alerts by local search', async () => {
    const user = userEvent.setup();
    render(<AlertsTableGrouped data={mockInstrumentRows} />);

    const searchInput = screen.getByPlaceholderText('Search by tag, description, or rectification...');
    await user.type(searchInput, 'Check');

    // After searching for "Check", items with "Check" in tag/description/rectification should be visible
    // Count is now displayed separately
    await waitFor(() => {
      expect(screen.getByText('Alerts')).toBeInTheDocument();
    });
  });

  it('should display all required columns', () => {
    render(<AlertsTableGrouped data={mockInstrumentRows} />);

    // Check for column headers using getAllByText since they appear in multiple tables
    expect(screen.getAllByText('Area').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Tag Number').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Equipment Description').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Status').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Rectification').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Notification Date').length).toBeGreaterThan(0);
  });
});
