import { Component } from "react";

// Leaflet manipulates the DOM directly outside React's own tree, which makes
// it the single riskiest piece of the Location page. With no boundary,
// an uncaught error anywhere below crashes the whole React root — Navbar,
// sidebar and footer included, since none of them are descendants of the
// thing that actually failed. This contains a crash to whatever it wraps.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-navy-950 p-8 text-center text-white">
            <p className="text-[10px] font-semibold tracking-[0.3em] text-brand-red uppercase">Something broke</p>
            <p className="max-w-md text-sm text-white/60">{this.state.error.message}</p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
