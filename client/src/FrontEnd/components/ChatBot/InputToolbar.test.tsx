import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputToolbar from './InputToolbar';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock antd message
jest.mock('antd', () => {
  const actual = jest.requireActual('antd');
  return {
    ...actual,
    message: {
      success: jest.fn(),
      warning: jest.fn(),
      error: jest.fn(),
    },
  };
});

describe('InputToolbar Component', () => {
  const mockOnFileSelect = jest.fn();
  const mockOnImageSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
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
    expect(screen.getByRole('button', { name: /picture/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /smile/i })).toBeInTheDocument();
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
    // First two buttons should be disabled (file and image)
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
    expect(fileInput).toHaveAttribute('accept', '.pdf,.xlsx,.xls,.docx,.doc,.txt,.csv');
    expect(fileInput).toHaveAttribute('multiple');
  });

  test('image input accepts correct file types', () => {
    render(
      <InputToolbar
        onFileSelect={mockOnFileSelect}
        onImageSelect={mockOnImageSelect}
      />
    );

    const imageInput = document.querySelector('input[type="file"][accept*=".jpg"]') as HTMLInputElement;
    expect(imageInput).toHaveAttribute('accept', '.jpg,.jpeg,.png,.gif,.webp');
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

    const clickSpy = jest.spyOn(fileInput, 'click');
    fireEvent.click(fileButton);

    expect(clickSpy).toHaveBeenCalled();
  });

  test('clicking image button triggers image input', () => {
    render(
      <InputToolbar
        onFileSelect={mockOnFileSelect}
        onImageSelect={mockOnImageSelect}
      />
    );

    const imageButton = screen.getByRole('button', { name: /picture/i });
    const imageInput = document.querySelector('input[type="file"][accept*=".jpg"]') as HTMLInputElement;

    const clickSpy = jest.spyOn(imageInput, 'click');
    fireEvent.click(imageButton);

    expect(clickSpy).toHaveBeenCalled();
  });

  test('emoji button is disabled', () => {
    render(
      <InputToolbar
        onFileSelect={mockOnFileSelect}
        onImageSelect={mockOnImageSelect}
      />
    );

    const emojiButton = screen.getByRole('button', { name: /smile/i });
    expect(emojiButton).toBeDisabled();
  });
});
