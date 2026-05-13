import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getTvDetails } from '../getTvDetails'

const FAKE_TOKEN = 'test-token-xyz'

beforeEach(() => {
  vi.stubEnv('VITE_TMDB_READ_ACCESS_TOKEN', FAKE_TOKEN)
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe('getTvDetails', () => {
  it('throws when the token is missing', async () => {
    vi.stubEnv('VITE_TMDB_READ_ACCESS_TOKEN', '')

    await expect(getTvDetails(1396)).rejects.toThrow(
      'Missing VITE_TMDB_READ_ACCESS_TOKEN',
    )
  })

  it('calls the correct URL with series id and auth header', async () => {
    const body = { id: 1396, name: 'Breaking Bad' }
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(body), { status: 200 }),
    )

    await getTvDetails(1396)

    expect(fetchSpy).toHaveBeenCalledOnce()
    const [url, init] = fetchSpy.mock.calls[0]
    const parsed = new URL(url as string)
    expect(parsed.origin + parsed.pathname).toBe(
      'https://api.themoviedb.org/3/tv/1396',
    )
    expect(parsed.searchParams.get('language')).toBe('en-US')
    expect((init as RequestInit).headers).toEqual(
      expect.objectContaining({
        Authorization: `Bearer ${FAKE_TOKEN}`,
      }),
    )
  })

  it('returns parsed JSON on success', async () => {
    const body = { id: 1396, name: 'Breaking Bad', poster_path: '/bb.jpg' }
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(body), { status: 200 }),
    )

    const result = await getTvDetails(1396)
    expect(result).toEqual(body)
  })

  it('throws on non-OK response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('Not Found', { status: 404, statusText: 'Not Found' }),
    )

    await expect(getTvDetails(9999)).rejects.toThrow(
      'TMDB TV details failed: 404 Not Found',
    )
  })
})
