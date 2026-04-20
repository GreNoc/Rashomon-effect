import React from "react";
import { Link } from "react-router-dom";
import './LandingPage.css';
import BackgroundContainer from "../utils/BackgroundContainer/BackgroundContainer.tsx";

const LandingPage: React.FC = () => {
  return (
    <BackgroundContainer>
        <div>
      <h1>Rashomon Personalization Overview</h1>
      <nav>
          <ul>
              {/*<li>
                  <Link to="/dashboard-overview">Dashboard Overview</Link>
              </li>*/}
              <li>
                  <Link to="/experiment">Experiment</Link>
              </li>
              {/*<li>
                  <Link to="/experiment-personalization-shortcut">Experiment → Personalization</Link>
              </li>
              <li>
                  <Link to="/experiment-evaluation-shortcut">Experiment → Evaluation</Link>
              </li>*/}
          </ul>
      </nav>
        </div>
    </BackgroundContainer>
  );
};

export default LandingPage;
