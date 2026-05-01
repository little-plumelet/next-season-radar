import type { TmdbTvDetails } from '../../api/getTvDetails'
import type { TmdbTvSearchShowBasic } from '../../api/getSeriesInfo'
import type { SearchSuccessExtras } from '../components/SearchBar/ui/SearchBar'

export function tvDetailsToSearchShow(
  details: TmdbTvDetails,
): TmdbTvSearchShowBasic {
  return {
    id: details.id,
    name: details.name,
    overview: details.overview,
    poster_path: details.poster_path,
    first_air_date: details.first_air_date ?? '',
    vote_average: details.vote_average,
  }
}

function toSearchExtrasStatus(
  raw: string | undefined,
): SearchSuccessExtras['status'] {
  if (raw === 'Ended' || raw === 'Returning Series' || raw === 'Canceled') {
    return raw
  }
  return 'Unknown'
}

export function tvDetailsToSearchExtras(
  details: TmdbTvDetails,
): SearchSuccessExtras {
  return {
    nextEpisode: details.next_episode_to_air ?? undefined,
    lastEpisode: details.last_episode_to_air ?? undefined,
    numberOfSeasons: details.number_of_seasons ?? 0,
    inProduction: details.in_production ?? false,
    status: toSearchExtrasStatus(details.status),
  }
}
