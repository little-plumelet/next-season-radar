import { getTvDetails, type TmdbTvEpisodeAir } from '../api/getTvDetails'
import { getTrackedShows } from '../storage/trackedShows'
import { formatAirDate } from '../utils/formatAirDate'
import { tmdbPosterUrl } from '../utils/tmdbPosterUrl'

const STORAGE_KEY = 'checkShowLastNextEpisodeById' as const

type LastNextEpisodeMap = Record<string, string>

/** One in-flight check at a time so read→mutate→`storage.local.set` cannot race. */
let checkMutexTail = Promise.resolve()

async function withSerializedCheck(fn: () => Promise<void>): Promise<void> {
  const prev = checkMutexTail
  let release!: () => void
  checkMutexTail = new Promise<void>((resolve) => {
    release = resolve
  })
  await prev
  try {
    await fn()
  } finally {
    release()
  }
}

function episodeSignature(ep: TmdbTvEpisodeAir | null | undefined): string {
  if (!ep) return 'none'
  if (ep.id != null && ep.id !== 0) return String(ep.id)
  return `${ep.season_number}-${ep.episode_number}-${ep.air_date}`
}

function nextEpisodeNotificationMessage(ep: TmdbTvEpisodeAir): string {
  const datePart = ep.air_date ? formatAirDate(ep.air_date) : 'Air date TBA'
  const se = `Season ${ep.season_number}, Episode ${ep.episode_number}`
  const tail = ep.name ? ` · ${ep.name}` : ''
  return `${datePart}\n${se}${tail}`
}

const FALLBACK_ICON_URL = chrome.runtime.getURL('notification-icon.png')

// Clear same id before create so OS shows a new toast when dedupe storage resets.
async function notifyNextEpisode(
  seriesId: number,
  title: string,
  message: string,
  iconUrl: string,
): Promise<void> {
  const notificationId = `check-show-${seriesId}`
  await chrome.notifications.clear(notificationId)
  return new Promise((resolve, reject) => {
    chrome.notifications.create(
      notificationId,
      {
        type: 'basic',
        iconUrl,
        title,
        message,
        priority: 1,
        // Stays until user dismisses or clicks (Chrome); OS may still move it to Notification Center.
        requireInteraction: true,
      },
      () => {
        const err = chrome.runtime.lastError
        if (err) {
          console.error(
            '[CheckShow] notifications.create failed',
            notificationId,
            err.message,
          )
          reject(new Error(err.message))
        } else resolve()
      },
    )
  })
}

export async function handleCheckShowAlarm(): Promise<void> {
  await withSerializedCheck(runCheckShowAlarm)
}

async function runCheckShowAlarm(): Promise<void> {
  const shows = await getTrackedShows()

  if (shows.length === 0) {
    console.log('[CheckShow] No tracked shows.')
    return
  }

  console.log(`[CheckShow] Checking ${shows.length} tracked show(s)…`)

  const results = await Promise.allSettled(
    shows.map((show) => getTvDetails(show.id)),
  )

  // Read dedupe state after TMDB settles so clears during fetch are respected
  // (otherwise we keep stale `previous` and may skip notify / overwrite a cleared map).
  const stored = await chrome.storage.local.get(STORAGE_KEY)
  const lastById: LastNextEpisodeMap = {
    ...(stored[STORAGE_KEY] as LastNextEpisodeMap | undefined),
  }

  for (let i = 0; i < shows.length; i++) {
    const result = results[i]
    const show = shows[i]
    const key = String(show.id)

    if (result.status === 'rejected') {
      console.error(`[CheckShow] ${show.name}: failed —`, result.reason)
      continue
    }

    const d = result.value
    if (d == null) {
      console.error(`[CheckShow] ${show.name}: empty TMDB response`)
      continue
    }

    const next = d.next_episode_to_air ?? null
    const sig = episodeSignature(next)
    const previous = lastById[key]

    let persistSignature = true
    if (next && sig !== previous) {
      const displayTitle = d.name?.trim() || show.name
      const iconUrl = tmdbPosterUrl(d.poster_path) ?? FALLBACK_ICON_URL
      try {
        await notifyNextEpisode(
          show.id,
          displayTitle,
          nextEpisodeNotificationMessage(next),
          iconUrl,
        )
      } catch (e) {
        console.error(`[CheckShow] ${show.name}: notification failed —`, e)
        persistSignature = false
      }
    }

    if (persistSignature) {
      lastById[key] = sig
    }
  }

  await chrome.storage.local.set({ [STORAGE_KEY]: lastById })
}
