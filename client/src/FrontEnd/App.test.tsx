import { render, screen } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import App from './App';

test('renders app', async () => {
  render(<App />);
  await waitFor(() => {
    expect(screen.getByText(/OptiMind/i)).toBeInTheDocument();
  });
});
