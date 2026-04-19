const TMDB_API_BASE = 'https://api.themoviedb.org/3'

export interface TmdbCreatedBy {
  id: number
  credit_id: string
  name: string
  original_name: string
  gender: number
  profile_path: string | null
}

export interface TmdbGenre {
  id: number
  name: string
}

export interface TmdbTvEpisodeAir {
  id: number
  name: string
  overview: string
  vote_average: number
  vote_count: number
  air_date: string
  episode_number: number
  episode_type: string
  production_code: string
  runtime: number | null
  season_number: number
  show_id: number
  still_path: string | null
}

export interface TmdbNetwork {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export interface TmdbProductionCompany {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export interface TmdbProductionCountry {
  iso_3166_1: string
  name: string
}

export interface TmdbSeasonSummary {
  air_date: string | null
  episode_count: number
  id: number
  name: string
  overview: string
  poster_path: string | null
  season_number: number
  vote_average: number
}

export interface TmdbSpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

/** TMDB `GET /tv/{series_id}` response */
export interface TmdbTvDetails {
  adult: boolean
  backdrop_path: string | null
  created_by: TmdbCreatedBy[]
  episode_run_time: number[]
  first_air_date: string | null
  genres: TmdbGenre[]
  homepage: string
  id: number
  in_production: boolean
  languages: string[]
  last_air_date: string | null
  last_episode_to_air: TmdbTvEpisodeAir | null
  name: string
  next_episode_to_air: TmdbTvEpisodeAir | null
  networks: TmdbNetwork[]
  number_of_episodes: number
  number_of_seasons: number
  origin_country: string[]
  original_language: string
  original_name: string
  overview: string
  popularity: number
  poster_path: string | null
  production_companies: TmdbProductionCompany[]
  production_countries: TmdbProductionCountry[]
  seasons: TmdbSeasonSummary[]
  spoken_languages: TmdbSpokenLanguage[]
  status: string
  tagline: string
  type: string
  vote_average: number
  vote_count: number
}

export async function getTvDetails(seriesId: number): Promise<TmdbTvDetails> {
  const token = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN as
    | string
    | undefined

  if (!token) {
    throw new Error('Missing VITE_TMDB_READ_ACCESS_TOKEN')
  }

  const url = new URL(`${TMDB_API_BASE}/tv/${seriesId}`)
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
      `TMDB TV details failed: ${response.status} ${response.statusText}`,
    )
  }

  return (await response.json()) as TmdbTvDetails
}
