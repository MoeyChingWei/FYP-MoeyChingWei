/// <reference types="jest" />
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app', () => {
  render(<App />);
  const linkElement = screen.getByText(/TEST LAYOUT WORKING/i);
  expect(linkElement).toBeInTheDocument();
});
