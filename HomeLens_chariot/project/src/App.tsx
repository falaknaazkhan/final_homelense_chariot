import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Overview from "./pages/Overview";
import DataExplorer from "./pages/DataExplorer";
import Forecasting from "./pages/Forecasting";
import SemanticQA from "./pages/SemanticQA";
import PriceDrivers from "./pages/PriceDrivers";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Define all routes here */}
          <Route path="/" element={<Overview />} />
          <Route path="/data-explorer" element={<DataExplorer />} />
          <Route path="/forecasting" element={<Forecasting />} />
          <Route path="/semantic-qa" element={<SemanticQA />} />
          <Route path="/price-drivers" element={<PriceDrivers />} />

          {/* IMPORTANT: DO NOT place any routes below this. */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;