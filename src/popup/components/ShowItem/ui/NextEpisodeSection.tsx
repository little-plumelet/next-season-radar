import type { TmdbTvEpisodeAir } from '../../../../api/getTvDetails'

import styles from './ShowItem.module.css'

function formatAirDate(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`)
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function NextEpisodeAirHeading({ episode }: { episode: TmdbTvEpisodeAir }) {
  if (!episode.air_date) {
    return <span className={styles.nextAirDateMuted}>Air date TBA</span>
  }
  return (
    <time className={styles.nextAirDate} dateTime={episode.air_date}>
      {formatAirDate(episode.air_date)}
    </time>
  )
}

/** Renders upcoming-episode UI when TMDB returned `next_episode_to_air`. */
export function NextEpisodeSection({
  episode,
}: {
  episode?: TmdbTvEpisodeAir
}) {
  if (!episode) return null

  const nameSuffix = episode.name ? ` · ${episode.name}` : ''

  return (
    <div className={styles.nextFocus} aria-live="polite">
      <p className={styles.nextEpisodeDetail}>Next episode:</p>
      <NextEpisodeAirHeading episode={episode} />
      <p className={styles.nextEpisodeDetail}>
        Season {episode.season_number}, Episode {episode.episode_number}
        {nameSuffix}
      </p>
    </div>
  )
}
