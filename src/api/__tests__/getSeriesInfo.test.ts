import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getSeriesInfo } from '../getSeriesInfo'

const FAKE_TOKEN = 'test-token-abc'

beforeEach(() => {
  vi.stubEnv('VITE_TMDB_READ_ACCESS_TOKEN', FAKE_TOKEN)
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe('getSeriesInfo', () => {
  it('throws when the token is missing', async () => {
    vi.stubEnv('VITE_TMDB_READ_ACCESS_TOKEN', '')

    await expect(getSeriesInfo('Breaking Bad')).rejects.toThrow(
      'Missing VITE_TMDB_READ_ACCESS_TOKEN',
    )
  })

  it('builds the correct URL and sends the auth header', async () => {
    const body = { page: 1, results: [], total_pages: 0, total_results: 0 }
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(body), { status: 200 }),
    )

    await getSeriesInfo('Breaking Bad')

    expect(fetchSpy).toHaveBeenCalledOnce()
    const [url, init] = fetchSpy.mock.calls[0]
    const parsed = new URL(url as string)
    expect(parsed.origin + parsed.pathname).toBe(
      'https://api.themoviedb.org/3/search/tv',
    )
    expect(parsed.searchParams.get('query')).toBe('Breaking Bad')
    expect(parsed.searchParams.get('include_adult')).toBe('false')
    expect(parsed.searchParams.get('language')).toBe('en-US')
    expect(parsed.searchParams.get('page')).toBe('1')
    expect((init as RequestInit).headers).toEqual(
      expect.objectContaining({
        Authorization: `Bearer ${FAKE_TOKEN}`,
      }),
    )
  })

  it('returns parsed JSON on success', async () => {
    const body = {
      page: 1,
      results: [
        {
          id: 1396,
          name: 'Breaking Bad',
          overview: 'A chemistry teacher...',
          poster_path: '/poster.jpg',
          first_air_date: '2008-01-20',
          vote_average: 8.9,
        },
      ],
      total_pages: 1,
      total_results: 1,
    }
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(body), { status: 200 }),
    )

    const result = await getSeriesInfo('Breaking Bad')
    expect(result).toEqual(body)
  })

  it('throws on non-OK response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('Unauthorized', { status: 401, statusText: 'Unauthorized' }),
    )

    await expect(getSeriesInfo('Breaking Bad')).rejects.toThrow(
      'TMDB search failed: 401 Unauthorized',
    )
  })
})
