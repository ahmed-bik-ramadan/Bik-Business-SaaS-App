import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.props = props;
  }

  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 rtl font-arabic">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 max-w-md w-full text-center">
            <span className="text-5xl mb-4 block">⚠️</span>
            <h1 className="text-2xl font-bold text-slate-900 mb-3">حدث خطأ غير متوقع</h1>
            <p className="text-slate-600 mb-6 text-sm leading-relaxed">
              واجه التطبيق مشكلة تقنية غير متوقعة أثناء عرض هذه الصفحة. الرجاء المحاولة مجدداً.
            </p>
            {this.state.error && (
              <pre className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-xs text-left font-mono overflow-auto max-h-32 mb-6 text-slate-500">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-[#EF4444] hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md hover:shadow-lg"
            >
              إعادة محاولة التشغيل
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
