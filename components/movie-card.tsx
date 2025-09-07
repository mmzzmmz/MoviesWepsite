"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, Star, Calendar, TrendingUp, Heart, Share2, Bookmark, Info } from "lucide-react"
import { getImageUrl, type Movie } from "@/lib/api"
import MagneticButton from "./magnetic-button"

interface MovieCardProps {
  movie: Movie
  index: number
  priority?: boolean
}

export default function MovieCard({ movie, index, priority = false }: MovieCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear()
  }

  const formatRating = (rating: number) => {
    return rating.toFixed(1)
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "text-green-400"
    if (rating >= 6) return "text-yellow-400"
    return "text-red-400"
  }

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsBookmarked(!isBookmarked)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (navigator.share) {
      navigator.share({
        title: movie.title,
        text: movie.overview,
        url: `/movie/${movie.id}`,
      })
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl glass hover:scale-105 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/20 magnetic">
      {/* Movie Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        {!imageError ? (
          <Image
            src={getImageUrl(movie.poster_path) || "/placeholder.svg"}
            alt={movie.title}
            fill
            className={`object-cover transition-all duration-700 group-hover:scale-110 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            priority={priority}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 200px, (max-width: 768px) 220px, (max-width: 1024px) 240px, (max-width: 1280px) 260px, 280px"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-xs">No Image</p>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 shimmer" />
        )}

        {/* Enhanced Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />

        <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
          {/* Top Action Buttons */}
          <div className="flex justify-between items-start">
            <MagneticButton
              onClick={handleLike}
              className={`w-10 h-10 rounded-full glass-dark flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                isLiked ? "text-red-400" : "text-white/70 hover:text-red-400"
              }`}
              strength={0.2}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </MagneticButton>

            <MagneticButton
              onClick={handleBookmark}
              className={`w-10 h-10 rounded-full glass-dark flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                isBookmarked ? "text-primary" : "text-white/70 hover:text-primary"
              }`}
              strength={0.2}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
            </MagneticButton>
          </div>

          {/* Center Play Button */}
          <div className="flex items-center justify-center">
            <Link href={`/movie/${movie.id}`}>
              <MagneticButton className="w-20 h-20 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center transform scale-75 group-hover:scale-100 transition-all duration-700 hover:bg-primary pulse-glow">
                <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
              </MagneticButton>
            </Link>
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex justify-between items-end">
            <MagneticButton
              onClick={handleShare}
              className="w-10 h-10 rounded-full glass-dark flex items-center justify-center transition-all duration-300 hover:scale-110 text-white/70 hover:text-accent"
              strength={0.2}
            >
              <Share2 className="w-4 h-4" />
            </MagneticButton>

            <Link href={`/movie/${movie.id}`}>
              <MagneticButton className="w-10 h-10 rounded-full glass-dark flex items-center justify-center transition-all duration-300 hover:scale-110 text-white/70 hover:text-primary">
                <Info className="w-4 h-4" />
              </MagneticButton>
            </Link>
          </div>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium border border-white/10">
          <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
          <span className={`font-bold ${getRatingColor(movie.vote_average)}`}>{formatRating(movie.vote_average)}</span>
        </div>

        <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-primary-foreground opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
          #{Math.round(movie.popularity)}
        </div>
      </div>

      <div className="p-4 space-y-3 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-transparent"></div>
        </div>

        <div className="relative z-10">
          <h3 className="font-bold text-responsive-sm line-clamp-2 group-hover:text-primary transition-colors duration-300 mb-2">
            {movie.title}
          </h3>

          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(movie.release_date)}</span>
            </div>

            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{Math.round(movie.popularity)}</span>
            </div>
          </div>

          <div className="relative">
            <p className="text-xs text-muted-foreground line-clamp-3 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 leading-relaxed">
              {movie.overview}
            </p>
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-card to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          <div className="flex items-center justify-between pt-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
            <span className="text-xs px-2 py-1 rounded-full bg-secondary/50 text-secondary-foreground uppercase font-medium">
              {movie.original_language}
            </span>
            <span className="text-xs text-muted-foreground">{movie.vote_count.toLocaleString()} votes</span>
          </div>
        </div>

        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 via-transparent to-accent/10"></div>
        </div>
      </div>

      <div className="absolute inset-0 ripple pointer-events-none"></div>
    </div>
  )
}
