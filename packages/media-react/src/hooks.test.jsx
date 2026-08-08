import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, render, screen } from '@testing-library/react';
import { MediaProvider, useMediaClient } from './MediaProvider.jsx';
import { useMediaSearch } from './useMediaSearch.js';
import { useMediaEvents } from './useMediaEvents.js';

// Mock client
const mockClient = {
  search: vi.fn(),
  curated: vi.fn(),
  getById: vi.fn(),
  events: {
    subscribe: vi.fn(),
    emit: vi.fn(),
  },
};

const wrapper = ({ children }) => (
  <MediaProvider client={mockClient}>{children}</MediaProvider>
);

describe('MediaProvider', () => {
  it('throws if no client provided', () => {
    // Suppress console.error from React boundary during this test
    const consoleError = console.error;
    console.error = vi.fn();
    expect(() => render(<MediaProvider><div /></MediaProvider>)).toThrow();
    console.error = consoleError;
  });

  it('provides client to children', () => {
    const TestComponent = () => {
      const client = useMediaClient();
      return <div data-testid="client">{client ? 'yes' : 'no'}</div>;
    };
    render(<MediaProvider client={mockClient}><TestComponent /></MediaProvider>);
    expect(screen.getByTestId('client').textContent).toBe('yes');
  });
});

describe('useMediaSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('performs search and updates state', async () => {
    mockClient.search.mockResolvedValueOnce({
      items: [{ id: 1 }],
      page: 1,
      totalResults: 1,
      nextPage: null,
    });

    const { result } = renderHook(() => useMediaSearch(), { wrapper });

    expect(result.current.loading).toBe(false);

    await act(async () => {
      await result.current.search('nature');
    });

    expect(mockClient.search).toHaveBeenCalledWith(expect.objectContaining({
      query: 'nature',
      page: 1,
    }));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.loading).toBe(false);
  });
});

describe('useMediaEvents', () => {
  it('subscribes and unsubscribes', () => {
    const unsubscribe = vi.fn();
    mockClient.events.subscribe.mockReturnValue(unsubscribe);

    const listener = vi.fn();
    const { unmount } = renderHook(() => useMediaEvents(listener), { wrapper });

    expect(mockClient.events.subscribe).toHaveBeenCalledWith(listener);
    unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });
});
