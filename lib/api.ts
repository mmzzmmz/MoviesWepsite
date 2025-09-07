const TMDB_API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NGNkNzE0NzM0ZmFhNjI4MzViNTFkYWY2ZTc4YjFkNCIsIm5iZiI6MTc1NjI5MDYxMi4xMzkwMDAyLCJzdWIiOiI2OGFlZGUzNDY5NDJmMTdhOWIzZDhhNTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.HEvvFu1cWbtbV__4HPN8rwvZa591F7wobIHmWxr2yS4"
const BASE_URL = "https://api.themoviedb.org/3"
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original"

export interface Movie {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string
  backdrop_path: string
  release_date: string
  vote_average: number
  vote_count: number
  popularity: number
  original_language: string
  genre_ids: number[]
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[]
  runtime: number
  budget: number
  revenue: number
  status: string
}

const apiOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TMDB_API_KEY}`,
  },
}

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, apiOptions)
      if (response.ok) {
        return response
      }
      if (response.status === 429) {
        // Rate limited, wait and retry
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)))
        continue
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise((resolve) => setTimeout(resolve, 500 * (i + 1)))
    }
  }
  throw new Error("Max retries exceeded")
}

export async function fetchNowPlayingMovies(): Promise<Movie[]> {
  try {
    const response = await fetchWithRetry(`${BASE_URL}/movie/now_playing`)
    const result = await response.json()
    return result.results || []
  } catch (error) {
    console.error("Error fetching now playing movies:", error)
    return []
  }
}

export async function fetchPopularMovies(): Promise<Movie[]> {
  try {
    const response = await fetchWithRetry(`${BASE_URL}/movie/popular?language=en-US&page=1`)
    const result = await response.json()
    return result.results || []
  } catch (error) {
    console.error("Error fetching popular movies:", error)
    return []
  }
}

export async function fetchMovieDetails(id: string): Promise<MovieDetails | null> {
  try {
    const response = await fetchWithRetry(`${BASE_URL}/movie/${id}`)
    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error fetching movie details:", error)
    return null
  }
}

export function getImageUrl(path: string): string {
  if (!path) return ""
  return `${IMAGE_BASE_URL}${path}`
}

export function getOptimizedImageUrl(path: string, size: "w300" | "w500" | "w780" | "original" = "w500"): string {
  if (!path) return ""
  return `https://image.tmdb.org/t/p/${size}${path}`
}
