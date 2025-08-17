import { Link } from "react-router-dom";

function WelcomeCard() {
  return (
    <div className="bg-slate-800/40 backdrop-blur-lg rounded-3xl p-8 border border-slate-700/50 shadow-2xl hover:shadow-violet-500/10 transition-all duration-300">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Welcome to HomeLens
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            An interactive tool for analyzing home prices across the UK providing forecasts, 
            insights, and semantic search capability.
          </p>
        </div>
        
        <Link
          to="/data-explorer"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-2xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25"
        >
          <span>Explore Data</span>
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default WelcomeCard;