/** TMDB poster base URL (w92 profile size). */
export const TMDB_POSTER_W92 = 'https://image.tmdb.org/t/p/w92'

export function cx(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(' ')
}
