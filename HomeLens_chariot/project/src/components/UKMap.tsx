import { useState } from "react";

function UKMap() {
  const [priceRange, setPriceRange] = useState([200000, 800000]);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const regions = [
    { name: "London", price: 650000, x: 52, y: 65, color: "from-red-500 to-red-600" },
    { name: "West Midlands", price: 280000, x: 45, y: 45, color: "from-orange-500 to-orange-600" },
    { name: "Manchester", price: 320000, x: 42, y: 25, color: "from-yellow-500 to-yellow-600" },
    { name: "Birmingham", price: 275000, x: 47, y: 48, color: "from-orange-500 to-orange-600" },
    { name: "Leeds", price: 290000, x: 48, y: 22, color: "from-yellow-500 to-yellow-600" },
    { name: "Liverpool", price: 240000, x: 38, y: 28, color: "from-green-500 to-green-600" },
    { name: "Bristol", price: 420000, x: 35, y: 58, color: "from-orange-500 to-red-500" },
    { name: "Edinburgh", price: 380000, x: 45, y: 8, color: "from-yellow-500 to-orange-500" },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-lg rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Home Prices Across the UK
          </h2>
          <p className="text-slate-400">Interactive map with regional price data</p>
        </div>

        {/* Map Container */}
        <div className="relative bg-slate-900/50 rounded-2xl p-6 h-80 overflow-hidden">
          {/* UK Map Outline (Simplified) */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full opacity-20"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          >
            <path
              d="M20 80 L25 85 L30 82 L35 85 L40 80 L45 85 L50 82 L55 85 L60 80 L65 75 L70 70 L75 65 L80 60 L75 55 L70 50 L65 45 L60 40 L55 35 L50 30 L45 25 L40 20 L35 15 L30 20 L25 25 L20 30 L15 35 L10 40 L15 45 L20 50 L25 55 L30 60 L25 65 L20 70 Z"
              className="text-slate-600"
            />
          </svg>

          {/* Region Points */}
          {regions.map((region) => (
            <div
              key={region.name}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ left: `${region.x}%`, top: `${region.y}%` }}
              onMouseEnter={() => setHoveredRegion(region.name)}
              onMouseLeave={() => setHoveredRegion(null)}
            >
              <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${region.color} shadow-lg hover:scale-125 transition-transform duration-200`} />
              
              {/* Tooltip */}
              {hoveredRegion === region.name && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap border border-slate-700/50">
                  <div className="font-semibold">{region.name}</div>
                  <div className="text-slate-300">{formatPrice(region.price)}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Price Range Slider */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-slate-400">
            <span>Price Range</span>
            <span>{formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="100000"
              max="1000000"
              step="50000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UKMap;