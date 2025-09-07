import { Suspense } from 'react'
import MovieDetails from '@/components/movie-details'
import LoadingSpinner from '@/components/loading-spinner'
import AnimatedPage from '@/components/animated-page'

interface MoviePageProps {
  params: Promise<{ id: string }>
}

// NOTE: next export cannot render truly dynamic routes at build time unless
// you provide a list of paths. Below is an example `generateStaticParams` that
// provides a small set of example ids for static export. Replace the ids with
// the real set you want to pre-render, or remove this and switch to client-side
// fetching inside `MovieDetails` for fully dynamic behavior.

export async function generateStaticParams() {
  // Example placeholder ids. Replace <ID1>, <ID2> with actual numeric ids.
  return [
    { id: '550' },
    { id: '500' },
    { id: '600' },
  ]
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
