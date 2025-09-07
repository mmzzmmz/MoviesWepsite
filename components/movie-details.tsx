"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Play,
  Star,
  Calendar,
  Clock,
  Globe,
  Heart,
  Bookmark,
  Share2,
  Download,
  ArrowLeft,
  Users,
  Award,
} from "lucide-react"
import { fetchMovieDetails, getOptimizedImageUrl, type MovieDetails as MovieDetailsType } from "@/lib/api"
import MagneticButton from "./magnetic-button"
import AnimatedCounter from "./animated-counter"
import LoadingSpinner from "./loading-spinner"

interface MovieDetailsProps {
  movieId: string
}

export default function MovieDetails({ movieId }: MovieDetailsProps) {
  const [movie, setMovie] = useState<MovieDetailsType | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    loadMovieDetails()
  }, [movieId])

  const loadMovieDetails = async () => {
    setLoading(true)
    try {
      const data = await fetchMovieDetails(movieId)
      setMovie(data)
    } catch (error) {
      console.error("Error loading movie details:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatRuntime = (minutes: number) => {
    if (!minutes) return "N/A"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatCurrency = (amount: number) => {
    if (!amount) return "Not disclosed"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "text-green-400"
    if (rating >= 6) return "text-yellow-400"
    return "text-red-400"
  }

  const handleLike = () => setIsLiked(!isLiked)
  const handleBookmark = () => setIsBookmarked(!isBookmarked)
  const handleShare = async () => {
    if (navigator.share && movie) {
      try {
        await navigator.share({
          title: movie.title,
          text: movie.overview,
          url: window.location.href,
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard?.writeText(window.location.href)
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard?.writeText(window.location.href)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <LoadingSpinner />
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Movie not found</h2>
          <p className="text-muted-foreground mb-6">The requested movie could not be loaded.</p>
          <Link href="/">
            <MagneticButton className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-medium">
              Back to Home
            </MagneticButton>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          {!imageError ? (
            <Image
              src={getOptimizedImageUrl(movie.backdrop_path || movie.poster_path, "original") || "/placeholder.svg"}
              alt={movie.title}
              fill
              className="object-cover"
              priority
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40"></div>
        </div>

        {/* Navigation */}
        <div className="absolute top-6 left-6 z-20">
          <Link href="/">
            <MagneticButton className="w-12 h-12 rounded-full glass-dark flex items-center justify-center text-white hover:text-primary transition-colors duration-300">
              <ArrowLeft className="w-5 h-5" />
            </MagneticButton>
          </Link>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container-padding w-full">
            <div className="grid lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto">
              {/* Movie Poster */}
              <div className="lg:col-span-4 flex justify-center lg:justify-start">
                <div className="relative w-80 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-500">
                  <Image
                    src={getOptimizedImageUrl(movie.poster_path, "w500") || "/placeholder.svg"}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    sizes="320px"
                  />
                  <div className="absolute inset-0 ring-1 ring-white/20 rounded-2xl"></div>
                </div>
              </div>

              {/* Movie Info */}
              <div className="lg:col-span-8 space-y-6 text-center lg:text-left">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">{movie.title}</h1>

                  {movie.title !== movie.original_title && (
                    <p className="text-xl text-slate-300 font-medium">{movie.original_title}</p>
                  )}

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm">
                    <div className="flex items-center gap-2 glass-dark px-3 py-1.5 rounded-full">
                      <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                      <span className={`font-bold ${getRatingColor(movie.vote_average)}`}>
                        {movie.vote_average.toFixed(1)}
                      </span>
                      <span className="text-slate-400">
                        (<AnimatedCounter end={movie.vote_count} />)
                      </span>
                    </div>

                    <div className="flex items-center gap-2 glass-dark px-3 py-1.5 rounded-full">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                    </div>

                    <div className="flex items-center gap-2 glass-dark px-3 py-1.5 rounded-full">
                      <Clock className="w-4 h-4 text-accent" />
                      <span>{formatRuntime(movie.runtime)}</span>
                    </div>

                    <div className="flex items-center gap-2 glass-dark px-3 py-1.5 rounded-full">
                      <Globe className="w-4 h-4 text-green-400" />
                      <span className="uppercase">{movie.original_language}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    {movie.genres?.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full border border-primary/30"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">{movie.overview}</p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <MagneticButton className="flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 pulse-glow">
                    <Play className="w-5 h-5" fill="currentColor" />
                    Watch Now
                  </MagneticButton>

                  <MagneticButton className="flex items-center gap-3 glass-dark text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300">
                    <Download className="w-5 h-5" />
                    Download
                  </MagneticButton>

                  <div className="flex gap-2">
                    <MagneticButton
                      onClick={handleLike}
                      className={`w-12 h-12 rounded-xl glass-dark flex items-center justify-center transition-all duration-300 ${
                        isLiked ? "text-red-400" : "text-white hover:text-red-400"
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                    </MagneticButton>

                    <MagneticButton
                      onClick={handleBookmark}
                      className={`w-12 h-12 rounded-xl glass-dark flex items-center justify-center transition-all duration-300 ${
                        isBookmarked ? "text-primary" : "text-white hover:text-primary"
                      }`}
                    >
                      <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
                    </MagneticButton>

                    <MagneticButton
                      onClick={handleShare}
                      className="w-12 h-12 rounded-xl glass-dark flex items-center justify-center text-white hover:text-accent transition-all duration-300"
                    >
                      <Share2 className="w-5 h-5" />
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 py-16">
        <div className="container-padding max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Details */}
            <div className="lg:col-span-2 space-y-8">
              <div className="glass rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Award className="w-6 h-6 text-primary" />
                  Movie Details
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Status
                      </h3>
                      <p className="text-lg font-medium">{movie.status || "Unknown"}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Release Date
                      </h3>
                      <p className="text-lg font-medium">
                        {new Date(movie.release_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Runtime
                      </h3>
                      <p className="text-lg font-medium">{formatRuntime(movie.runtime)}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Budget
                      </h3>
                      <p className="text-lg font-medium">{formatCurrency(movie.budget)}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Revenue
                      </h3>
                      <p className="text-lg font-medium text-green-400">{formatCurrency(movie.revenue)}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Language
                      </h3>
                      <p className="text-lg font-medium uppercase">{movie.original_language}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Synopsis */}
              <div className="glass rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">Synopsis</h2>
                <p className="text-lg leading-relaxed text-slate-300">{movie.overview}</p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Stats */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Statistics
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Rating</span>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                      <span className={`font-bold ${getRatingColor(movie.vote_average)}`}>
                        {movie.vote_average.toFixed(1)}/10
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Votes</span>
                    <AnimatedCounter end={movie.vote_count} className="font-semibold" />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Popularity</span>
                    <AnimatedCounter end={Math.round(movie.popularity)} className="font-semibold" />
                  </div>

                  {movie.budget > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Budget</span>
                      <span className="font-semibold text-sm">{formatCurrency(movie.budget)}</span>
                    </div>
                  )}

                  {movie.revenue > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Revenue</span>
                      <span className="font-semibold text-sm text-green-400">{formatCurrency(movie.revenue)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Genres */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres?.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-2 text-sm font-medium bg-primary/10 text-primary rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors duration-300"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
