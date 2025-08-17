import WelcomeCard from "../components/WelcomeCard";
import UKMap from "../components/UKMap";
import ForecastingPanel from "../components/ForecastingPanel";
import SemanticQA from "../components/SemanticQA";
import PriceDrivers from "../components/PriceDrivers";

function Overview() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Row */}
        <WelcomeCard />
        <UKMap />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bottom Row */}
        <ForecastingPanel />
        <SemanticQA />
        <PriceDrivers />
      </div>
    </div>
  );
}

export default Overview;