import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import PlanMove from "./pages/PlanMove";
import Compare from "./pages/Compare";
import Plans from "./pages/Plans";
import PlanDetails from "./pages/PlanDetails";
import Analytics from "./pages/Analytics";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plan" element={<PlanMove />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/plans/:id" element={<PlanDetails />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Layout>
  );
}
