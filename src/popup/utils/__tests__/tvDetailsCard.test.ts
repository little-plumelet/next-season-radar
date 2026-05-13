import { describe, it, expect } from 'vitest'
import type { TmdbTvDetails } from '../../../api/getTvDetails'
import { tvDetailsToSearchShow, tvDetailsToSearchExtras } from '../tvDetailsCard'

function makeTvDetails(overrides: Partial<TmdbTvDetails> = {}): TmdbTvDetails {
  return {
    adult: false,
    backdrop_path: '/backdrop.jpg',
    created_by: [],
    episode_run_time: [45],
    first_air_date: '2020-01-15',
    genres: [{ id: 1, name: 'Drama' }],
    homepage: 'https://example.com',
    id: 42,
    in_production: true,
    languages: ['en'],
    last_air_date: '2024-06-01',
    last_episode_to_air: {
      id: 100,
      name: 'Finale',
      overview: 'The last one',
      vote_average: 8.5,
      vote_count: 200,
      air_date: '2024-06-01',
      episode_number: 10,
      episode_type: 'finale',
      production_code: '',
      runtime: 55,
      season_number: 3,
      show_id: 42,
      still_path: '/still.jpg',
    },
    name: 'Test Show',
    next_episode_to_air: null,
    networks: [],
    number_of_episodes: 30,
    number_of_seasons: 3,
    origin_country: ['US'],
    original_language: 'en',
    original_name: 'Test Show',
    overview: 'A great show about testing',
    popularity: 85.2,
    poster_path: '/poster.jpg',
    production_companies: [],
    production_countries: [],
    seasons: [],
    spoken_languages: [],
    status: 'Returning Series',
    tagline: 'Keep testing',
    type: 'Scripted',
    vote_average: 8.1,
    vote_count: 1500,
    ...overrides,
  }
}

describe('tvDetailsToSearchShow', () => {
  it('maps full details to the basic search show shape', () => {
    const details = makeTvDetails()
    const result = tvDetailsToSearchShow(details)

    expect(result).toEqual({
      id: 42,
      name: 'Test Show',
      overview: 'A great show about testing',
      poster_path: '/poster.jpg',
      first_air_date: '2020-01-15',
      vote_average: 8.1,
    })
  })

  it('defaults first_air_date to empty string when null', () => {
    const details = makeTvDetails({ first_air_date: null })
    const result = tvDetailsToSearchShow(details)

    expect(result.first_air_date).toBe('')
  })
})

describe('tvDetailsToSearchExtras', () => {
  it('maps details with no next episode', () => {
    const details = makeTvDetails({ next_episode_to_air: null })
    const result = tvDetailsToSearchExtras(details)

    expect(result).toEqual({
      nextEpisode: undefined,
      lastEpisode: details.last_episode_to_air,
      numberOfSeasons: 3,
      inProduction: true,
      status: 'Returning Series',
    })
  })

  it('includes next episode when present', () => {
    const nextEp = {
      id: 101,
      name: 'Premiere',
      overview: 'It begins again',
      vote_average: 0,
      vote_count: 0,
      air_date: '2025-01-10',
      episode_number: 1,
      episode_type: 'standard',
      production_code: '',
      runtime: null,
      season_number: 4,
      show_id: 42,
      still_path: null,
    }
    const details = makeTvDetails({ next_episode_to_air: nextEp })
    const result = tvDetailsToSearchExtras(details)

    expect(result.nextEpisode).toEqual(nextEp)
  })

  it('maps known statuses correctly', () => {
    expect(tvDetailsToSearchExtras(makeTvDetails({ status: 'Ended' })).status).toBe('Ended')
    expect(
      tvDetailsToSearchExtras(makeTvDetails({ status: 'Canceled' })).status,
    ).toBe('Canceled')
    expect(
      tvDetailsToSearchExtras(makeTvDetails({ status: 'Returning Series' })).status,
    ).toBe('Returning Series')
  })

  it('falls back to Unknown for unrecognised statuses', () => {
    expect(
      tvDetailsToSearchExtras(makeTvDetails({ status: 'In Production' })).status,
    ).toBe('Unknown')
    expect(
      tvDetailsToSearchExtras(makeTvDetails({ status: '' })).status,
    ).toBe('Unknown')
  })

  it('defaults numberOfSeasons and inProduction when fields are falsy', () => {
    const details = makeTvDetails({
      number_of_seasons: 0,
      in_production: false,
    })
    const result = tvDetailsToSearchExtras(details)

    expect(result.numberOfSeasons).toBe(0)
    expect(result.inProduction).toBe(false)
  })
})
