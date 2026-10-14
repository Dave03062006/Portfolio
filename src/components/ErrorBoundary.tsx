import { Component, type ReactNode } from 'react'

type ErrorBoundaryProps = {
  /** What to show instead if something inside breaks. */
  fallback: ReactNode
  onError?: (error: Error) => void
  children: ReactNode
}

type ErrorBoundaryState = { failed: boolean }

/**
 * Catches errors in the part of the page inside it and shows `fallback` instead, so one
 * broken piece (like the 3D logo on an unusual graphics card) can't take down the whole site.
 * Error boundaries are one of the few things React still writes as a class.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { failed: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true }
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
