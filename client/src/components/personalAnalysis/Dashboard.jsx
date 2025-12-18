import Navbar from "../navbar/Navbar";
import PersonalAnalysisDashboard from "./dashboard/PersonalAnalysisDashboard";
import { PersonalAnalysisProvider } from "../../context/personalAnalysis/PersonalAnalysisContext";

const dashboard = () => {
  return (
    <PersonalAnalysisProvider>
      <Navbar />
      <PersonalAnalysisDashboard />
    </PersonalAnalysisProvider>
  );
};
export default dashboard;
