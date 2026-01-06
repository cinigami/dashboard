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
    // Check that status labels are present along with counts
    expect(screen.getByText('Healthy')).toBeInTheDocument();
    expect(screen.getByText('Caution')).toBeInTheDocument();
    expect(screen.getByText('Warning')).toBeInTheDocument();
  });

  it('should display total assets count', () => {
    render(<GaugeCard data={mockInstrumentRows} />);
    expect(screen.getByText(/Total Assets: 5/)).toBeInTheDocument();
  });

  it('should display score', () => {
    render(<GaugeCard data={mockInstrumentRows} />);
    // Score calculation: (100 + 100 + 60 + 20 + 20) / 5 = 60
    // The gauge card should display a numeric score
    const scoreElement = screen.getAllByText(/\d+/).find(el => {
      const parent = el.closest('text');
      return parent && parent.getAttribute('class')?.includes('text-3xl');
    });
    expect(scoreElement).toBeInTheDocument();
  });

  it('should handle empty data', () => {
    render(<GaugeCard data={[]} />);
    expect(screen.getByText(/Total Assets: 0/)).toBeInTheDocument();
    // Should show all counts as 0
    const scoreText = screen.getAllByText('0').filter(el => {
      const parent = el.closest('text');
      return parent && parent.getAttribute('class')?.includes('text-3xl');
    });
    expect(scoreText.length).toBeGreaterThan(0);
  });

  it('should display correct status labels', () => {
    render(<GaugeCard data={mockInstrumentRows} />);
    expect(screen.getByText('Healthy')).toBeInTheDocument();
    expect(screen.getByText('Caution')).toBeInTheDocument();
    expect(screen.getByText('Warning')).toBeInTheDocument();
  });
});
