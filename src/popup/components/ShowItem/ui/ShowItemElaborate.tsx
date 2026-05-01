import { useState } from 'react'

import type { TmdbTvSearchShowBasic } from '../../../../api/getSeriesInfo'
import { getTvDetails } from '../../../../api/getTvDetails'
import type { SearchSuccessExtras } from '../../SearchBar/ui/SearchBar'

import { NextEpisodeSection } from './NextEpisodeSection'
import { ShowCardAirRating, ShowCardPoster } from './ShowItemParts'
import { cx } from './showItemShared'
import styles from './ShowItem.module.css'

export type ShowItemElaborateProps = {
  show: TmdbTvSearchShowBasic
  extras: SearchSuccessExtras
  /** Wider poster + spacing when TV details are shown with next-episode block. */
  detailLayout?: boolean
}

export function ShowItemElaborate({
  show,
  extras,
  detailLayout,
}: ShowItemElaborateProps) {
  const [trackState, setTrackState] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [trackMessage, setTrackMessage] = useState<string>('')

  async function handleTrackNextSeason(): Promise<void> {
    setTrackState('loading')
    setTrackMessage('')
    try {
      const details = await getTvDetails(show.id)
      if (!details) {
        setTrackState('error')
        setTrackMessage('Could not refresh this show right now. Please retry.')
        return
      }
      setTrackState('success')
      setTrackMessage('Show details refreshed. Tracking integration is next.')
    } catch {
      setTrackState('error')
      setTrackMessage('Could not refresh this show right now. Please retry.')
    }
  }

  const showTrack = !extras.nextEpisode && extras.inProduction

  return (
    <li
      className={cx(
        styles.result,
        styles.resultElaborate,
        detailLayout && styles.resultWithNext,
      )}
    >
      <div className={styles.elaborateMain}>
        <ShowCardPoster posterPath={show.poster_path} fill={detailLayout} />
        <div className={styles.layout}>
          <p className={styles.resultTitle}>{show.name}</p>

          <NextEpisodeSection episode={extras.nextEpisode} />

          {!extras.nextEpisode ? (
            <div>
              <ShowCardAirRating
                firstAirDate={show.first_air_date}
                voteAverage={show.vote_average}
                detailLayout={detailLayout}
              />

              {Number(extras.numberOfSeasons) > 1 ? (
                <p>{extras.numberOfSeasons} seasons</p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {showTrack ? (
        <div className={styles.trackFooter}>
          <button
            type="button"
            className={styles.trackFooterBtn}
            disabled={trackState === 'loading'}
            onClick={() => {
              void handleTrackNextSeason()
            }}
          >
            {trackState === 'loading' ? 'Checking latest details…' : 'Track next season'}
          </button>
          {trackState !== 'idle' && trackMessage ? (
            <p
              className={cx(
                styles.trackStatus,
                trackState === 'error' && styles.trackStatusError,
              )}
              role={trackState === 'error' ? 'alert' : 'status'}
            >
              {trackMessage}
            </p>
          ) : null}
        </div>
      ) : null}
    </li>
  )
}
