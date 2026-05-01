import React from 'react';
import { AlertCircle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // Update state with error details
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Send to error tracking service in production
    if (process.env.NODE_ENV === 'production' && process.env.VITE_ERROR_TRACKING_URL) {
      this.reportErrorToService(error, errorInfo);
    }
  }

  reportErrorToService = (error, errorInfo) => {
    try {
      // Example: Send to Sentry, LogRocket, etc.
      // fetch(process.env.VITE_ERROR_TRACKING_URL, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     message: error.toString(),
      //     stack: errorInfo.componentStack,
      //     timestamp: new Date().toISOString(),
      //   }),
      // });
    } catch (err) {
      console.error('Failed to report error:', err);
    }
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-red-100 p-4">
                <AlertCircle className="text-red-600" size={32} />
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-bold text-center mb-2 text-gray-900">
              Oops! Something went wrong
            </h1>
            <p className="text-center text-gray-600 mb-6">
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-h-40 overflow-y-auto">
                <p className="text-sm font-mono text-red-700 break-words">
                  <strong>Error:</strong> {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm font-semibold text-red-700 hover:text-red-800">
                      Component Stack
                    </summary>
                    <pre className="mt-2 text-xs text-red-600 whitespace-pre-wrap overflow-x-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-primary text-white px-4 py-2 rounded-lg 
                           hover:bg-pink-600 transition-colors duration-200 font-medium"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg 
                           hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Go Home
              </button>
            </div>

            {/* Error Count Warning */}
            {this.state.errorCount > 3 && (
              <p className="mt-4 text-sm text-center text-orange-600 bg-orange-50 px-3 py-2 rounded">
                ⚠️ Multiple errors detected. Please refresh the page completely or clear your browser cache.
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
