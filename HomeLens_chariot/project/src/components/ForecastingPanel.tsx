import { useState } from "react";

function ForecastingPanel() {
  const [showForecast, setShowForecast] = useState(false);

  // Mock data for the chart
  const historicalData = [
    { month: "Jan", price: 320000 },
    { month: "Feb", price: 325000 },
    { month: "Mar", price: 318000 },
    { month: "Apr", price: 335000 },
    { month: "May", price: 342000 },
    { month: "Jun", price: 338000 },
  ];

  const forecastData = [
    { month: "Jul", price: 345000 },
    { month: "Aug", price: 352000 },
    { month: "Sep", price: 348000 },
    { month: "Oct", price: 355000 },
    { month: "Nov", price: 360000 },
    { month: "Dec", price: 358000 },
  ];

  const allData = [...historicalData, ...(showForecast ? forecastData : [])];
  const maxPrice = Math.max(...allData.map(d => d.price));
  const minPrice = Math.min(...allData.map(d => d.price));

  return (
    <div className="bg-slate-800/40 backdrop-blur-lg rounded-3xl p-6 border border-slate-700/50 shadow-2xl">
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Price Forecasting</h3>
          <p className="text-slate-400 text-sm">6-month price predictions</p>
        </div>

        {/* Chart Container */}
        <div className="relative h-48 bg-slate-900/50 rounded-xl p-4">
          <svg viewBox="0 0 400 150" className="w-full h-full">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="0"
                y1={30 + i * 30}
                x2="400"
                y2={30 + i * 30}
                stroke="rgb(71 85 105)"
                strokeWidth="0.5"
                opacity="0.3"
              />
            ))}

            {/* Historical line */}
            <polyline
              fill="none"
              stroke="url(#historicalGradient)"
              strokeWidth="3"
              points={historicalData
                .map((d, i) => {
                  const x = 50 + (i * 50);
                  const y = 140 - ((d.price - minPrice) / (maxPrice - minPrice)) * 100;
                  return `${x},${y}`;
                })
                .join(" ")}
            />

            {/* Forecast line */}
            {showForecast && (
              <polyline
                fill="none"
                stroke="url(#forecastGradient)"
                strokeWidth="3"
                strokeDasharray="5,5"
                points={[...historicalData.slice(-1), ...forecastData]
                  .map((d, i) => {
                    const x = 250 + (i * 50);
                    const y = 140 - ((d.price - minPrice) / (maxPrice - minPrice)) * 100;
                    return `${x},${y}`;
                  })
                  .join(" ")}
              />
            )}

            {/* Data points */}
            {allData.map((d, i) => {
              const x = 50 + (i * 50);
              const y = 140 - ((d.price - minPrice) / (maxPrice - minPrice)) * 100;
              const isForecast = i >= historicalData.length;
              
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="4"
                  fill={isForecast ? "#f97316" : "#8b5cf6"}
                  className="hover:r-6 transition-all duration-200"
                />
              );
            })}

            {/* Gradients */}
            <defs>
              <linearGradient id="historicalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <linearGradient id="forecastGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
              <span className="text-slate-300">Historical</span>
            </div>
            {showForecast && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-slate-300">Forecast</span>
              </div>
            )}
          </div>
        </div>

        {/* Forecast Button */}
        <button
          onClick={() => setShowForecast(!showForecast)}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
            showForecast
              ? "bg-orange-500 hover:bg-orange-600 text-white"
              : "bg-slate-700 hover:bg-slate-600 text-slate-300"
          }`}
        >
          {showForecast ? "Hide Forecast" : "Show Forecast"}
        </button>
      </div>
    </div>
  );
}

export default ForecastingPanel;