"use client"

import { useEffect, useState } from "react"
import { fetchNowPlayingMovies, fetchPopularMovies, type Movie } from "@/lib/api"
import MovieCard from "./movie-card"
import LoadingSpinner from "./loading-spinner"
import AnimatedCounter from "./animated-counter"

export default function MoviesContainer() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"new" | "popular">("new")

  useEffect(() => {
    loadMovies()
  }, [activeTab])

  const loadMovies = async () => {
    setLoading(true)
    try {
      const data = activeTab === "new" ? await fetchNowPlayingMovies() : await fetchPopularMovies()
      setMovies(data)
    } catch (error) {
      console.error("Error loading movies:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 scroll-reveal">
      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex rounded-xl glass p-1 w-fit">
          <button
            onClick={() => setActiveTab("new")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 btn-hover-slide ${
              activeTab === "new"
                ? "bg-primary text-primary-foreground shadow-lg pulse-glow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            New Movies
          </button>
          <button
            onClick={() => setActiveTab("popular")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 btn-hover-slide ${
              activeTab === "popular"
                ? "bg-primary text-primary-foreground shadow-lg pulse-glow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Popular Movies
          </button>
        </div>

        <div className="text-responsive-sm text-muted-foreground">
          <AnimatedCounter end={movies.length} suffix=" movies found" />
        </div>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="movie-grid">
          {movies.map((movie, index) => (
            <div key={movie.id} className={`stagger-animation stagger-${Math.min(index + 1, 6)}`}>
              <MovieCard movie={movie} index={index} priority={index < 6} />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && movies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center scroll-reveal">
          <div className="w-24 h-24 rounded-full glass flex items-center justify-center mb-4 float">
            <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h2z"
              />
            </svg>
          </div>
          <h3 className="text-responsive-lg font-semibold mb-2">No movies found</h3>
          <p className="text-responsive-sm text-muted-foreground max-w-md">
            We couldn't find any movies matching your criteria. Try adjusting your filters or check back later.
          </p>
        </div>
      )}
    </div>
  )
}
