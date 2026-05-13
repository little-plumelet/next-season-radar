import { Link } from 'react-router-dom'

import type { TmdbTvSearchShowBasic } from '../../../../api/getSeriesInfo'

import { ShowCardPoster } from '../../ShowCardPoster'
import { ShowCardAirRating } from './ShowItemParts'
import { cx } from '../../../utils/cx'
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
        <ShowCardPoster posterPath={show.poster_path} variant={detailLayout ? 'fill' : 'default'} />
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
