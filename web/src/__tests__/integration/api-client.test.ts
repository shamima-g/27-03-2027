/**
 * Integration Test: API Client
 *
 * Tests the shared API client (apiClient, get, post, del) using MSW
 * to intercept HTTP requests at the network boundary.
 *
 * Pattern: Use server.use() to override specific responses per test.
 */

import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import { apiClient, get, post } from '@/lib/api/client';
import { API_BASE_URL } from '@/lib/utils/constants';
import type { APIError } from '@/types/api';

// Use the runtime base URL so handlers match what the client actually calls
const BASE = API_BASE_URL;

describe('API Client Integration Tests', () => {
  describe('Successful API requests', () => {
    it('should fetch data and parse JSON response', async () => {
      const mockData = { id: 1, name: 'Test User' };
      server.use(
        http.get(`${BASE}/v1/users/1`, () => HttpResponse.json(mockData)),
      );

      const result = await apiClient<typeof mockData>('/v1/users/1', {
        method: 'GET',
      });

      expect(result).toEqual(mockData);
    });

    it('should send POST request with body using convenience method', async () => {
      const requestBody = { name: 'New User', email: 'user@example.com' };
      const mockResponse = { id: 2, ...requestBody };
      server.use(
        http.post(`${BASE}/v1/users`, () =>
          HttpResponse.json(mockResponse, { status: 201 }),
        ),
      );

      const result = await post<typeof mockResponse>(
        '/v1/users',
        requestBody,
        'TestUser',
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle query parameters', async () => {
      const mockData = [{ id: 1, name: 'User 1' }];
      let capturedUrl = '';
      server.use(
        http.get(`${BASE}/v1/users`, ({ request }) => {
          capturedUrl = request.url;
          return HttpResponse.json(mockData);
        }),
      );

      await get<typeof mockData>('/v1/users', { role: 'admin', active: true });

      expect(capturedUrl).toContain('role=admin');
      expect(capturedUrl).toContain('active=true');
    });
  });

  describe('Error handling', () => {
    it('should handle 404 errors with proper error structure', async () => {
      server.use(
        http.get(`${BASE}/v1/users/999`, () =>
          HttpResponse.json(
            { Messages: ['User not found'] },
            { status: 404, statusText: 'Not Found' },
          ),
        ),
      );

      try {
        await apiClient('/v1/users/999', { method: 'GET' });
        throw new Error('Should have thrown an error');
      } catch (error) {
        const apiError = error as APIError;
        expect(apiError.statusCode).toBe(404);
        expect(apiError.message).toContain('Not Found');
        expect(apiError.details).toEqual(['User not found']);
      }
    });

    it('should handle 500 server errors', async () => {
      server.use(
        http.get(`${BASE}/v1/data`, () =>
          HttpResponse.json(
            {},
            { status: 500, statusText: 'Internal Server Error' },
          ),
        ),
      );

      try {
        await apiClient('/v1/data', { method: 'GET' });
        throw new Error('Should have thrown an error');
      } catch (error) {
        const apiError = error as APIError;
        expect(apiError.statusCode).toBe(500);
        expect(apiError.message).toContain('Internal Server Error');
      }
    });

    it('should handle network errors', async () => {
      // HttpResponse.error() simulates a network-level failure (connection refused)
      server.use(http.get(`${BASE}/v1/users`, () => HttpResponse.error()));

      try {
        await apiClient('/v1/users', { method: 'GET' });
        throw new Error('Should have thrown an error');
      } catch (error) {
        const apiError = error as APIError;
        expect(apiError.message).toContain('Network error');
        expect(apiError.statusCode).toBe(0);
      }
    });
  });

  describe('Request configuration', () => {
    it('should include LastChangedUser header for audit trails', async () => {
      let capturedHeader = '';
      server.use(
        http.post(`${BASE}/v1/data`, ({ request }) => {
          capturedHeader = request.headers.get('LastChangedUser') ?? '';
          return HttpResponse.json({ success: true });
        }),
      );

      await apiClient('/v1/data', {
        method: 'POST',
        body: JSON.stringify({ value: 'test' }),
        lastChangedUser: 'TestUser',
      });

      expect(capturedHeader).toBe('TestUser');
    });

    it('should handle 204 No Content responses', async () => {
      server.use(
        http.delete(
          `${BASE}/v1/users/1`,
          () => new HttpResponse(null, { status: 204 }),
        ),
      );

      const result = await apiClient('/v1/users/1', { method: 'DELETE' });

      expect(result).toBeUndefined();
    });
  });
});
