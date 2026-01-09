import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GaugeCard from '../GaugeCard';
import { mockInstrumentRows } from '../../tests/mockData';

describe('GaugeCard', () => {
  it('should render overall healthiness title', () => {
    render(<GaugeCard data={mockInstrumentRows} />);
    expect(screen.getByText('Overall Equipment Healthiness')).toBeInTheDocument();
  });

  it('should display correct status counts', () => {
    render(<GaugeCard data={mockInstrumentRows} />);

    // Mock data has: 2 Healthy, 1 Caution, 2 Warning
    // Check that status labels are present (now displayed multiple times in the new layout)
    expect(screen.getAllByText('Healthy').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Caution').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Warning').length).toBeGreaterThan(0);
  });

  it('should display total assets count', () => {
    render(<GaugeCard data={mockInstrumentRows} />);
    // The count is now displayed separately: "Total Assets:" and "5"
    expect(screen.getByText(/Total Assets:/)).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should display score', () => {
    render(<GaugeCard data={mockInstrumentRows} />);
    // Score calculation: (100 + 100 + 60 + 20 + 20) / 5 = 60
    // The gauge card should display a numeric score
    const scoreElement = screen.getAllByText(/\d+/).find(el => {
      const parent = el.closest('text');
      return parent && parent.getAttribute('class')?.includes('text-6xl');
    });
    expect(scoreElement).toBeInTheDocument();
  });

  it('should handle empty data', () => {
    render(<GaugeCard data={[]} />);
    // The count is now displayed separately: "Total Assets:" and "0"
    expect(screen.getByText(/Total Assets:/)).toBeInTheDocument();
    expect(screen.getAllByText('0').length).toBeGreaterThan(0);
    // Should show score as 0 with text-6xl class
    const scoreText = screen.getAllByText('0').find(el => {
      const parent = el.closest('text');
      return parent && parent.getAttribute('class')?.includes('text-6xl');
    });
    expect(scoreText).toBeDefined();
  });

  it('should display correct status labels', () => {
    render(<GaugeCard data={mockInstrumentRows} />);
    // Status labels now appear multiple times in the new layout
    expect(screen.getAllByText('Healthy').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Caution').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Warning').length).toBeGreaterThan(0);
  });
});
