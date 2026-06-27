import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error('App error caught by ErrorBoundary:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <span className="text-6xl">🌾</span>
          <h1 className="mt-4 text-xl font-semibold text-soil-800 dark:text-soil-100">
            页面出错了
          </h1>
          <p className="mt-2 text-sm text-soil-500 dark:text-soil-400">
            请刷新页面或稍后重试
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-leaf-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-leaf-700"
          >
            刷新页面
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
