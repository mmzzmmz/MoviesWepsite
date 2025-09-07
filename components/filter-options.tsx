"use client"

import { useState } from "react"
import { ChevronDown, Filter, Menu, Search } from "lucide-react"
import MagneticButton from "./magnetic-button"

export default function FilterOptions() {
  const [dropMenuOpen, setDropMenuOpen] = useState(false)
  const [filterMenuOpen, setFilterMenuOpen] = useState(false)
  const [activeSort, setActiveSort] = useState("Newest")
  const [language, setLanguage] = useState("all")
  const [media, setMedia] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="mb-8 space-y-6 scroll-reveal">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <h1 className="bg-gradient-to-r from-white via-primary to-accent bg-clip-text text-4xl md:text-5xl font-bold text-transparent">
            New Added Movies
          </h1>
          <p className="text-muted-foreground text-responsive-sm">Discover the latest blockbusters and hidden gems</p>
        </div>

        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl glass border border-white/10 bg-white/5 text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
          />
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-3 relative">
        {/* Sort Dropdown */}
        <div className="relative">
          <MagneticButton
            onClick={() => setDropMenuOpen(!dropMenuOpen)}
            className="flex items-center gap-2 rounded-xl glass px-6 py-3 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 btn-hover-slide"
            strength={0.1}
          >
            <Menu size={18} />
            <span className="text-sm font-medium">{activeSort}</span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${dropMenuOpen ? "rotate-180" : ""}`}
            />
          </MagneticButton>

          {dropMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-xl glass border border-white/10 shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2">
              {["Newest", "Popularity", "Rating", "Alphabetical"].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setActiveSort(option)
                    setDropMenuOpen(false)
                  }}
                  className={`w-full px-4 py-3 text-left text-sm transition-all duration-200 hover:bg-white/10 ripple ${
                    activeSort === option ? "bg-primary/20 text-primary border-l-2 border-primary" : "text-slate-300"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <MagneticButton
            onClick={() => setFilterMenuOpen(!filterMenuOpen)}
            className="flex items-center gap-2 rounded-xl glass px-6 py-3 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 btn-hover-slide"
            strength={0.1}
          >
            <Filter size={18} />
            <span className="text-sm font-medium">Filter</span>
          </MagneticButton>

          {filterMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 rounded-xl glass border border-white/10 shadow-2xl z-50 p-6 animate-in slide-in-from-top-2">
              <div className="space-y-6">
                <div>
                  <h3 className="mb-4 text-sm font-semibold text-white flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    Language
                  </h3>
                  <div className="space-y-3">
                    {[
                      { value: "all", label: "All Languages" },
                      { value: "en", label: "English" },
                      { value: "subtitled", label: "Subtitled" },
                      { value: "dubbed", label: "Dubbed" },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="language"
                          value={option.value}
                          checked={language === option.value}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-4 h-4 text-primary focus:ring-primary/50 focus:ring-2"
                        />
                        <span
                          className={`text-sm transition-colors duration-200 group-hover:text-white ${
                            language === option.value ? "text-primary font-medium" : "text-slate-300"
                          }`}
                        >
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-sm font-semibold text-white flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent"></div>
                    Media Type
                  </h3>
                  <div className="space-y-3">
                    {[
                      { value: "all", label: "All Media" },
                      { value: "movies", label: "Movies Only" },
                      { value: "series", label: "TV Series" },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="media"
                          value={option.value}
                          checked={media === option.value}
                          onChange={(e) => setMedia(e.target.value)}
                          className="w-4 h-4 text-accent focus:ring-accent/50 focus:ring-2"
                        />
                        <span
                          className={`text-sm transition-colors duration-200 group-hover:text-white ${
                            media === option.value ? "text-accent font-medium" : "text-slate-300"
                          }`}
                        >
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 ml-auto">
          {["Action", "Comedy", "Drama", "Sci-Fi"].map((genre) => (
            <button
              key={genre}
              className="px-3 py-1.5 text-xs rounded-full glass border border-white/10 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300 hover:scale-105"
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
