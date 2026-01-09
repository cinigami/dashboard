import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock the template generator to avoid actual file download
vi.mock('../utils/templateGenerator', () => ({
  generateTemplate: vi.fn(),
}));

describe('App', () => {
  it('should render application title', () => {
    render(<App />);
    expect(screen.getByText('Instrument Asset Healthiness')).toBeInTheDocument();
  });

  it('should render Download Template button', () => {
    render(<App />);
    expect(screen.getByText('Download Template')).toBeInTheDocument();
  });

  it('should show file uploader when no data is loaded', () => {
    render(<App />);
    expect(screen.getByText(/Click to upload/)).toBeInTheDocument();
    expect(screen.getByText(/Upload an Excel file to get started/)).toBeInTheDocument();
  });

  it('should not show Export button when no data is loaded', () => {
    render(<App />);
    expect(screen.queryByText('Export Data')).not.toBeInTheDocument();
  });

  it('should call generateTemplate when Download Template is clicked', async () => {
    const user = userEvent.setup();
    const { generateTemplate } = await import('../utils/templateGenerator');

    render(<App />);

    const downloadButton = screen.getByText('Download Template');
    await user.click(downloadButton);

    expect(generateTemplate).toHaveBeenCalled();
  });

  it('should show upload instructions in empty state', () => {
    render(<App />);

    expect(screen.getByText(/Upload an Excel file to get started/)).toBeInTheDocument();
    expect(screen.getByText(/Download the template to see the required format/)).toBeInTheDocument();
  });

  it('should render file uploader in header when no data', () => {
    render(<App />);

    // Should have file upload area in the header section
    const uploadAreas = screen.getAllByText(/Click to upload/);
    expect(uploadAreas.length).toBeGreaterThan(0);
  });
});
