import type { TmdbTvDetails } from '../api/getTvDetails'

/** Minimal fields persisted for a tracked series (TMDB poster path + title). */
export type TrackedShow = {
  id: number
  poster_path: string | null
  name: string
}

export const TRACKED_SHOWS_KEY = 'trackedShows' as const

export function trackedShowFromTvDetails(details: TmdbTvDetails): TrackedShow {
  return {
    id: details.id,
    poster_path: details.poster_path,
    name: details.name,
  }
}

export async function getTrackedShows(): Promise<TrackedShow[]> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(TRACKED_SHOWS_KEY, (items) => {
      const lastError = chrome.runtime.lastError
      if (lastError) {
        reject(new Error(lastError.message))
        return
      }
      const raw: unknown = items[TRACKED_SHOWS_KEY]
      if (!Array.isArray(raw)) {
        resolve([])
        return
      }
      resolve(raw as TrackedShow[])
    })
  })
}

export async function removeTrackedShow(showId: number): Promise<void> {
  const existing = await getTrackedShows()
  const next = existing.filter((s) => s.id !== showId)

  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [TRACKED_SHOWS_KEY]: next }, () => {
      const lastError = chrome.runtime.lastError
      if (lastError) {
        reject(new Error(lastError.message))
        return
      }
      resolve()
    })
  })
}

export async function addTrackedShow(entry: TrackedShow): Promise<void> {
  const existing = await getTrackedShows()
  const idx = existing.findIndex((s) => s.id === entry.id)
  const next =
    idx === -1
      ? [...existing, entry]
      : existing.map((s, i) => (i === idx ? entry : s))

  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [TRACKED_SHOWS_KEY]: next }, () => {
      const lastError = chrome.runtime.lastError
      if (lastError) {
        reject(new Error(lastError.message))
        return
      }
      resolve()
    })
  })
}
