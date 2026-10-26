import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('EcoQuest Uncaught Error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-eco-canvas flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              An unexpected error occurred in EcoQuest. Your learning progress is safe.
            </p>
            {this.state.error && (
              <div className="text-xs bg-gray-50 border border-gray-200 p-3 rounded-lg text-left text-gray-700 font-mono mb-6 overflow-x-auto">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-eco-forest text-white font-medium text-sm hover:bg-eco-forest-light transition-colors w-full"
            >
              <RefreshCw className="w-4 h-4" />
              Return to Safe Harbor
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
