const TMDB_API_BASE = 'https://api.themoviedb.org/3'

/** TMDB `/tv/{series_id}/season/{season_number}` — season-level fields only. */
export interface TmdbTvSeasonDetails {
  _id: string
  air_date: string | null
  name: string
  overview: string
  id: number
  poster_path: string | null
  season_number: number
  vote_average: number
  episodes: TmdbTvEpisodeBasic[]
}

export interface TmdbTvEpisodeBasic {
  air_date: string | null
  episode_number: number
  id: number
  name: string
  overview: string
  runtime: number | null
}

export async function getSeasonDetails(
  seriesId: number,
  seasonNumber: number,
): Promise<TmdbTvSeasonDetails> {
  const token = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN as
    | string
    | undefined

  if (!token) {
    throw new Error('Missing VITE_TMDB_READ_ACCESS_TOKEN')
  }

  const url = new URL(`${TMDB_API_BASE}/tv/${seriesId}/season/${seasonNumber}`)
  url.searchParams.set('language', 'en-US')

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(
      `TMDB season details failed: ${response.status} ${response.statusText}`,
    )
  }

  return (await response.json()) as TmdbTvSeasonDetails
}
