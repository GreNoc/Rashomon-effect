import { useNavigate } from 'react-router-dom';

import backButtonImage from './assets/fuji-512x512.png';

const HomeButton = () => {

  const navigate = useNavigate();
  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="homeButtonContainer">
    <button onClick={goToHome} className="homeButton">
      <img 
        src={backButtonImage} 
        alt="Back to Home" 
        style={{ width: '100px', height: 'auto' }}
        className="homeButtonImage"
      />
    </button>
    </div>
  );
};

export default HomeButton;
