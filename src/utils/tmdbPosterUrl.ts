const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w92'

/** Full HTTPS URL for a TMDB `poster_path`, or `null` if missing. */
export function tmdbPosterUrl(
  posterPath: string | null | undefined,
): string | null {
  if (!posterPath) return null
  return `${TMDB_POSTER_BASE}${posterPath}`
}
