import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./LandingPage/LandingPage.tsx";
import DashboardOverview from "./DashboardBandit/DashboardOverview.tsx";
import Experiment from "./Experiment/Experiment.tsx";
import PredictionGame from "./PredictionGame/Experiment.tsx"

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard-overview" element={<DashboardOverview />} />
        <Route path="/experiment" element={<Experiment initialState={"Intro"}/>} />
        <Route path="/experiment-personalization-shortcut" element={<Experiment initialState={"Personalization"}/>} />
        <Route path="/experiment-evaluation-shortcut" element={<Experiment initialState={"Evaluation"}/>} />
          <Route path="/prediction-game" element={<PredictionGame initialState={"Personalization"}/>} />
      </Routes>
    </Router>
  );
};

export default App;
