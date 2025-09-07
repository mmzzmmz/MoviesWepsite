import { Suspense } from "react"
import MovieDetails from "@/components/movie-details"
import LoadingSpinner from "@/components/loading-spinner"
import AnimatedPage from "@/components/animated-page"

interface MoviePageProps {
  params: Promise<{ id: string }>
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params

  return (
    <AnimatedPage>
      <main className="min-h-screen bg-slate-900">
        <Suspense fallback={<LoadingSpinner />}>
          <MovieDetails movieId={id} />
        </Suspense>
      </main>
    </AnimatedPage>
  )
}
