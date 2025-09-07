export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-slate-700/30"></div>
        <div className="absolute top-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-primary border-r-primary/50"></div>
        <div
          className="absolute top-2 left-2 h-12 w-12 animate-spin rounded-full border-2 border-transparent border-t-accent"
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
        ></div>
        <div className="absolute inset-0 rounded-full pulse-glow"></div>
      </div>
    </div>
  )
}
