import type { TmdbTvSearchShowBasic } from '../../../../api/getSeriesInfo'

import { ShowItem } from './ShowItem'

import styles from './ShowsList.module.css'

export type ShowsListProps = {
  shows: TmdbTvSearchShowBasic[]
}

export function ShowsList({ shows }: ShowsListProps) {
  return (
    <ul className={styles.results}>
      {shows.map((show) => (
        <ShowItem key={show.id} show={show} />
      ))}
    </ul>
  )
}
