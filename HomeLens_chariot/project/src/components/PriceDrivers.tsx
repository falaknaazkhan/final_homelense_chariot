import { useState, useEffect } from "react";

function PriceDrivers() {
  const [animationComplete, setAnimationComplete] = useState(false);

  const drivers = [
    { name: "EPC Rating", value: 35, color: "from-green-500 to-green-600" },
    { name: "Broadband Speed", value: 25, color: "from-blue-500 to-blue-600" },
    { name: "Transport Links", value: 20, color: "from-purple-500 to-purple-600" },
    { name: "Local Amenities", value: 15, color: "from-orange-500 to-orange-600" },
    { name: "Crime Rate", value: 5, color: "from-red-500 to-red-600" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const total = drivers.reduce((sum, driver) => sum + driver.value, 0);
  let cumulativePercentage = 0;

  return (
    <div className="bg-slate-800/40 backdrop-blur-lg rounded-3xl p-6 border border-slate-700/50 shadow-2xl">
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Price Drivers</h3>
          <p className="text-slate-400 text-sm">Factors affecting home prices</p>
        </div>

        {/* Donut Chart */}
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
              {drivers.map((driver, index) => {
                const percentage = (driver.value / total) * 100;
                const strokeDasharray = `${percentage * 2.51} 251.2`; // 2π * 40 = 251.2
                const strokeDashoffset = -cumulativePercentage * 2.51;
                
                const segment = (
                  <circle
                    key={index}
                    cx="100"
                    cy="100"
                    r="40"
                    fill="none"
                    strokeWidth="20"
                    stroke={`url(#gradient-${index})`}
                    strokeDasharray={animationComplete ? strokeDasharray : "0 251.2"}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-out"
                    style={{ 
                      transitionDelay: `${index * 200}ms`,
                      filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.3))'
                    }}
                  />
                );
                
                cumulativePercentage += percentage;
                return segment;
              })}
              
              {/* Gradients */}
              <defs>
                {drivers.map((driver, index) => (
                  <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={driver.color.split(' ')[1]} />
                    <stop offset="100%" stopColor={driver.color.split(' ')[3]} />
                  </linearGradient>
                ))}
              </defs>
            </svg>
            
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-xs text-slate-400">Factors</div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          {drivers.map((driver, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-slate-900/30 rounded-xl hover:bg-slate-900/50 transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${driver.color}`}></div>
                <span className="text-slate-300 text-sm font-medium">{driver.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${driver.color} transition-all duration-1000 ease-out`}
                    style={{
                      width: animationComplete ? `${(driver.value / total) * 100}%` : '0%',
                      transitionDelay: `${index * 200}ms`
                    }}
                  ></div>
                </div>
                <span className="text-slate-400 text-sm font-semibold w-8 text-right">
                  {driver.value}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PriceDrivers;