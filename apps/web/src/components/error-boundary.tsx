"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console for debugging
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Call the optional onError callback
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Check if it's a DOM manipulation error
      const isDOMError =
        this.state.error?.message?.includes("removeChild") ||
        this.state.error?.message?.includes("appendChild") ||
        this.state.error?.message?.includes("insertBefore");

      if (isDOMError) {
        // For DOM errors, try to recover by resetting the error state after a short delay
        setTimeout(() => {
          this.setState({ hasError: false, error: undefined });
        }, 100);
      }

      // Return fallback UI
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center p-4 text-center">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Something went wrong. Please try refreshing the page.
              </p>
              <button
                type="button"
                onClick={() =>
                  this.setState({ hasError: false, error: undefined })
                }
                className="text-sm text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
