import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import type { TmdbTvDetails } from '../../api/getTvDetails'
import {
  installChromeMock,
  resetChromeMock,
  seedStore,
  forceStorageError,
} from '../../test/chrome.mock'
import {
  TRACKED_SHOWS_KEY,
  getTrackedShows,
  addTrackedShow,
  removeTrackedShow,
  trackedShowFromTvDetails,
} from '../trackedShows'

beforeEach(installChromeMock)
afterEach(resetChromeMock)

const SHOW_A = { id: 1, poster_path: '/a.jpg', name: 'Show A' }
const SHOW_B = { id: 2, poster_path: '/b.jpg', name: 'Show B' }

// ---------------------------------------------------------------------------
// trackedShowFromTvDetails (pure)
// ---------------------------------------------------------------------------

describe('trackedShowFromTvDetails', () => {
  it('extracts only id, poster_path, and name', () => {
    const details = {
      id: 99,
      poster_path: '/poster.jpg',
      name: 'My Series',
    } as TmdbTvDetails

    expect(trackedShowFromTvDetails(details)).toEqual({
      id: 99,
      poster_path: '/poster.jpg',
      name: 'My Series',
    })
  })

  it('preserves null poster_path', () => {
    const details = {
      id: 5,
      poster_path: null,
      name: 'No Poster',
    } as TmdbTvDetails

    expect(trackedShowFromTvDetails(details).poster_path).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// getTrackedShows
// ---------------------------------------------------------------------------

describe('getTrackedShows', () => {
  it('returns an empty array when storage is empty', async () => {
    const result = await getTrackedShows()
    expect(result).toEqual([])
  })

  it('returns stored shows', async () => {
    seedStore({ [TRACKED_SHOWS_KEY]: [SHOW_A, SHOW_B] })
    const result = await getTrackedShows()
    expect(result).toEqual([SHOW_A, SHOW_B])
  })

  it('returns empty array when stored value is not an array', async () => {
    seedStore({ [TRACKED_SHOWS_KEY]: 'not-an-array' })
    const result = await getTrackedShows()
    expect(result).toEqual([])
  })

  it('rejects when chrome.runtime.lastError is set', async () => {
    forceStorageError('Quota exceeded')
    await expect(getTrackedShows()).rejects.toThrow('Quota exceeded')
  })
})

// ---------------------------------------------------------------------------
// addTrackedShow
// ---------------------------------------------------------------------------

describe('addTrackedShow', () => {
  it('adds a new show to an empty list', async () => {
    await addTrackedShow(SHOW_A)
    const result = await getTrackedShows()
    expect(result).toEqual([SHOW_A])
  })

  it('appends to an existing list', async () => {
    seedStore({ [TRACKED_SHOWS_KEY]: [SHOW_A] })
    await addTrackedShow(SHOW_B)
    const result = await getTrackedShows()
    expect(result).toEqual([SHOW_A, SHOW_B])
  })

  it('updates an existing show in-place (upsert)', async () => {
    seedStore({ [TRACKED_SHOWS_KEY]: [SHOW_A, SHOW_B] })
    const updated = { ...SHOW_A, name: 'Show A Renamed' }
    await addTrackedShow(updated)
    const result = await getTrackedShows()
    expect(result).toEqual([updated, SHOW_B])
  })
})

// ---------------------------------------------------------------------------
// removeTrackedShow
// ---------------------------------------------------------------------------

describe('removeTrackedShow', () => {
  it('removes a show by id', async () => {
    seedStore({ [TRACKED_SHOWS_KEY]: [SHOW_A, SHOW_B] })
    await removeTrackedShow(SHOW_A.id)
    const result = await getTrackedShows()
    expect(result).toEqual([SHOW_B])
  })

  it('is a no-op when the id does not exist', async () => {
    seedStore({ [TRACKED_SHOWS_KEY]: [SHOW_A] })
    await removeTrackedShow(999)
    const result = await getTrackedShows()
    expect(result).toEqual([SHOW_A])
  })

  it('handles removing from an empty list', async () => {
    await removeTrackedShow(1)
    const result = await getTrackedShows()
    expect(result).toEqual([])
  })
})
