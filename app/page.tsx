import { Suspense } from "react"
import MoviesContainer from "@/components/movies-container"
import FilterOptions from "@/components/filter-options"
import LoadingSpinner from "@/components/loading-spinner"
import AnimatedPage from "@/components/animated-page"

export default function HomePage() {
  return (
    <AnimatedPage>
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-6 md:px-16 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <FilterOptions />
          <Suspense fallback={<LoadingSpinner />}>
            <MoviesContainer />
          </Suspense>
        </div>
      </main>
    </AnimatedPage>
  )
}
