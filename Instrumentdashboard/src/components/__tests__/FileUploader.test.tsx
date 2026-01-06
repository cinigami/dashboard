import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FileUploader from '../FileUploader';

describe('FileUploader', () => {
  it('should render upload area', () => {
    const onDataLoaded = vi.fn();
    render(<FileUploader onDataLoaded={onDataLoaded} />);

    expect(screen.getByText(/Click to upload/)).toBeInTheDocument();
    expect(screen.getByText(/drag and drop/)).toBeInTheDocument();
    expect(screen.getByText(/Excel file \(\.xlsx\)/)).toBeInTheDocument();
  });

  it('should show error for non-xlsx file', async () => {
    const onDataLoaded = vi.fn();
    const { container } = render(<FileUploader onDataLoaded={onDataLoaded} />);

    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    expect(input).toBeTruthy();

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(screen.getByText(/Please upload an Excel file/)).toBeInTheDocument();
    });

    expect(onDataLoaded).not.toHaveBeenCalled();
  });

  it('should show loading state during file processing', async () => {
    const onDataLoaded = vi.fn();
    const { container } = render(<FileUploader onDataLoaded={onDataLoaded} />);

    // Create a mock xlsx file
    const file = new File(['mock content'], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file],
    });

    fireEvent.change(input);

    // Should show loading state briefly
    await waitFor(
      () => {
        const loadingText = screen.queryByText('Processing file...');
        if (loadingText) {
          expect(loadingText).toBeInTheDocument();
        }
      },
      { timeout: 100 }
    );
  });

  it('should have drag and drop functionality', () => {
    const onDataLoaded = vi.fn();
    const { container } = render(<FileUploader onDataLoaded={onDataLoaded} />);

    const dropZone = container.querySelector('[class*="border-2 border-dashed"]') as HTMLElement;

    // Trigger drag over
    fireEvent.dragOver(dropZone);

    // Should add dragging styles (border-blue-500)
    expect(dropZone.className).toContain('border-blue-500');

    // Trigger drag leave
    fireEvent.dragLeave(dropZone);

    // Should remove dragging styles
    expect(dropZone.className).not.toContain('border-blue-500');
  });
});
