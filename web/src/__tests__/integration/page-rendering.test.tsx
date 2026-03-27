/**
 * Integration Test: Page Rendering
 *
 * Demonstrates integration testing for Next.js page components
 * with data fetching, user interactions, and state management.
 *
 * Uses MSW for request interception — no manual fetch mocking.
 */

import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { API_BASE_URL } from '@/lib/utils/constants';

// Match the runtime base URL the fetch call uses
const DATA_URL = `${API_BASE_URL}/data`;

// Example: A page component that fetches and displays data
function ExampleDataPage() {
  const [data, setData] = React.useState<{ name: string } | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/data`);
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Data Page</h1>
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Loading...' : 'Load Data'}
      </button>
      {error && <div role="alert">Error: {error}</div>}
      {data && <div>Name: {data.name}</div>}
    </div>
  );
}

describe('Page Rendering Integration Tests', () => {
  describe('Data fetching workflow', () => {
    it('should load and display data when button is clicked', async () => {
      const user = userEvent.setup();
      server.use(
        http.get(DATA_URL, () => HttpResponse.json({ name: 'Test Data' })),
      );

      render(<ExampleDataPage />);

      await user.click(screen.getByRole('button', { name: /load data/i }));

      await waitFor(() => {
        expect(screen.getByText('Name: Test Data')).toBeInTheDocument();
      });
    });

    it('should display error message when fetch fails', async () => {
      const user = userEvent.setup();
      server.use(
        http.get(DATA_URL, () => new HttpResponse(null, { status: 500 })),
      );

      render(<ExampleDataPage />);

      await user.click(screen.getByRole('button', { name: /load data/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Failed to fetch');
      });
    });

    it('should handle network errors', async () => {
      const user = userEvent.setup();
      // HttpResponse.error() simulates a network-level failure (connection refused / fetch TypeError)
      server.use(http.get(DATA_URL, () => HttpResponse.error()));

      render(<ExampleDataPage />);

      await user.click(screen.getByRole('button', { name: /load data/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have accessible heading', () => {
      render(<ExampleDataPage />);

      expect(
        screen.getByRole('heading', { name: /data page/i }),
      ).toBeInTheDocument();
    });

    it('should disable button during loading', async () => {
      const user = userEvent.setup();
      // Delay response to observe loading state
      server.use(
        http.get(DATA_URL, async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          return HttpResponse.json({ name: 'Slow Data' });
        }),
      );

      render(<ExampleDataPage />);

      await user.click(screen.getByRole('button', { name: /load data/i }));

      expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled();
    });
  });
});
