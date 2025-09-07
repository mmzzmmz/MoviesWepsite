"use client"

import { Component, type ReactNode } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import MagneticButton from "./magnetic-button"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-full glass flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem
              persists.
            </p>

            <MagneticButton
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-medium transition-all duration-300 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Page
            </MagneticButton>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
