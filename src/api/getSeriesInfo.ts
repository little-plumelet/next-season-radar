const SEARCH_TV_URL = 'https://api.themoviedb.org/3/search/tv'

/** TMDB `/search/tv` result — only fields we use in the app */
export interface TmdbTvSearchShowBasic {
  id: number
  name: string
  overview: string
  poster_path: string | null
  first_air_date: string
  vote_average: number
}

export interface TmdbTvSearchResponse {
  page: number
  results: TmdbTvSearchShowBasic[]
  total_pages: number
  total_results: number
}

export async function getSeriesInfo(
  seriesName: string,
): Promise<TmdbTvSearchResponse> {
  const token = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN as
    | string
    | undefined

  if (!token) {
    throw new Error('Missing VITE_TMDB_READ_ACCESS_TOKEN')
  }

  const url = new URL(SEARCH_TV_URL)
  url.searchParams.set('query', seriesName)
  url.searchParams.set('include_adult', 'false')
  url.searchParams.set('language', 'en-US')
  url.searchParams.set('page', '1')

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(
      `TMDB search failed: ${response.status} ${response.statusText}`,
    )
  }

  return (await response.json()) as TmdbTvSearchResponse
}
