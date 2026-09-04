import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import InputToolbar from './InputToolbar';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock antd message
vi.mock('antd', async () => {
  const actual = await vi.importActual<typeof import('antd')>('antd');
  return {
    ...actual,
    message: {
      success: vi.fn(),
      warning: vi.fn(),
      error: vi.fn(),
    },
  };
});

describe('InputToolbar Component', () => {
  const mockOnFileSelect = vi.fn();
  const mockOnImageSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders toolbar buttons', () => {
    render(
      <InputToolbar
        onFileSelect={mockOnFileSelect}
        onImageSelect={mockOnImageSelect}
      />
    );

    // Check if buttons are rendered (they have tooltips with specific titles)
    expect(screen.getByRole('button', { name: /paper-clip/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /audio/i })).toBeInTheDocument();
  });

  test('disables buttons when disabled prop is true', () => {
    render(
      <InputToolbar
        onFileSelect={mockOnFileSelect}
        onImageSelect={mockOnImageSelect}
        disabled={true}
      />
    );

    const buttons = screen.getAllByRole('button');
    // File and voice controls should be disabled.
    expect(buttons[0]).toBeDisabled();
    expect(buttons[1]).toBeDisabled();
  });

  test('file input accepts correct file types', () => {
    render(
      <InputToolbar
        onFileSelect={mockOnFileSelect}
        onImageSelect={mockOnImageSelect}
      />
    );

    const fileInput = document.querySelector('input[type="file"][accept*=".pdf"]') as HTMLInputElement;
    expect(fileInput).toHaveAttribute('accept', '.pdf,.xlsx,.xls,.docx,.doc,.txt,.csv,.jpg,.jpeg,.png,.gif,.webp');
    expect(fileInput).toHaveAttribute('multiple');
  });

  test('file input accepts image file types', () => {
    render(
      <InputToolbar
        onFileSelect={mockOnFileSelect}
        onImageSelect={mockOnImageSelect}
      />
    );

    const imageInput = document.querySelector('input[type="file"][accept*=".jpg"]') as HTMLInputElement;
    expect(imageInput).toHaveAttribute('accept', expect.stringContaining('.jpg'));
    expect(imageInput).toHaveAttribute('multiple');
  });

  test('clicking file button triggers file input', () => {
    render(
      <InputToolbar
        onFileSelect={mockOnFileSelect}
        onImageSelect={mockOnImageSelect}
      />
    );

    const fileButton = screen.getByRole('button', { name: /paper-clip/i });
    const fileInput = document.querySelector('input[type="file"][accept*=".pdf"]') as HTMLInputElement;

    const clickSpy = vi.spyOn(fileInput, 'click');
    fireEvent.click(fileButton);

    expect(clickSpy).toHaveBeenCalled();
  });

  test('clicking attachment button triggers image-capable file input', () => {
    render(
      <InputToolbar
        onFileSelect={mockOnFileSelect}
        onImageSelect={mockOnImageSelect}
      />
    );

    const imageButton = screen.getByRole('button', { name: /paper-clip/i });
    const imageInput = document.querySelector('input[type="file"][accept*=".jpg"]') as HTMLInputElement;

    const clickSpy = vi.spyOn(imageInput, 'click');
    fireEvent.click(imageButton);

    expect(clickSpy).toHaveBeenCalled();
  });

  test('voice button is available', () => {
    render(
      <InputToolbar
        onFileSelect={mockOnFileSelect}
        onImageSelect={mockOnImageSelect}
      />
    );

    expect(screen.getByRole('button', { name: /audio/i })).toBeInTheDocument();
  });
});
