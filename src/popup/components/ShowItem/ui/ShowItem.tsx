import { Link } from 'react-router-dom'

import type { TmdbTvSearchShowBasic } from '../../../../api/getSeriesInfo'

import { ShowCardAirRating, ShowCardPoster } from './ShowItemParts'
import { cx } from './showItemShared'
import styles from './ShowItem.module.css'

export type ShowItemProps = {
  show: TmdbTvSearchShowBasic
  /** Wider poster + spacing for a single-match row. */
  detailLayout?: boolean
}

export function ShowItem({ show, detailLayout }: ShowItemProps) {
  return (
    <li className={cx(styles.result, detailLayout && styles.resultWithNext)}>
      <Link
        className={cx(
          styles.cardLink,
          detailLayout && styles.cardLinkExpanded,
        )}
        to={`/show/${show.id}`}
      >
        <ShowCardPoster posterPath={show.poster_path} fill={detailLayout} />
        <div className={styles.layout}>
          <p className={styles.resultTitle}>{show.name}</p>
          <div>
            <ShowCardAirRating
              firstAirDate={show.first_air_date}
              voteAverage={show.vote_average}
              detailLayout={detailLayout}
            />
          </div>
        </div>
      </Link>
    </li>
  )
}
