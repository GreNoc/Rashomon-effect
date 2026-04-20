import React, { useState } from "react";
import Dashboard from "./dashboard.tsx";
import { type Encoding } from "./bandit.ts";
import { hyperParameterLevels, normalizedData } from "./data.tsx";
import { decode } from "./encoding.ts"
import './DashboardBandit.css'
import BackgroundContainer from "../utils/BackgroundContainer/BackgroundContainer.tsx";

interface SliderComponentProps {
  min: number;
  max: number;
  setter: (index: number) => void;
}

const Slider: React.FC<SliderComponentProps> = ({ min, max, setter}) => {
  const [sliderValue, setSliderValue] = useState<number>(min);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(Number(event.target.value));
    setter(sliderValue)
  };

  return (
    <div style={{ width: '300px', margin: '20px auto', textAlign: 'center' }}>
      <input
        type="range"
        min={min}
        max={max}
        value={sliderValue}
        onChange={handleChange}
        style={{ width: '100%' }}
      />
      <p>Model Index: {sliderValue}</p>
    </div>
  );
};

const DashboardOverview: React.FC = () => {

    const configurationLookup = normalizedData.configurationData
    const encodings = Object.keys(configurationLookup).map(x => JSON.parse(x))

    const initialEncoding : Encoding = JSON.parse(Object.keys(configurationLookup)[0])
    const [encoding, setEncoding] = useState(initialEncoding)
    const [encodingInput, setEncodingInput] = useState<string>("")
    
    const handleEncodingSubmit = () => {
    try {
      const parsedEncoding = JSON.parse(encodingInput);
      if (JSON.stringify(parsedEncoding) in configurationLookup) {
        setEncoding(parsedEncoding);
      } else {
        alert("Invalid encoding: Not found in configuration data.");
      }
    } catch (error) {
      alert("Invalid encoding format. Please enter a valid JSON string.");
    }
    };

    return (
        <div>
            <BackgroundContainer>
                <div>
                    <Dashboard {...configurationLookup[JSON.stringify(encoding)]}/>
                </div>
                <div className="button-container">
                    <div>
                        <Slider
                            min={0}
                            max={encodings.length - 1}
                            setter={(index) => setEncoding(encodings[index])}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Enter encoding JSON"
                            value={encodingInput}
                            onChange={(e) => setEncodingInput(e.target.value)}
                            style={{width: '300px', marginRight: '10px'}}
                        />
                        <button onClick={handleEncodingSubmit}>Set Encoding</button>
                    </div>
                    <div>
                        <pre>
                           {JSON.stringify({
                                   configurartion: decode(encoding, hyperParameterLevels),
                                   encoding: encoding,
                                   hyperParameterLevels: hyperParameterLevels,
                                   plotData: configurationLookup[JSON.stringify(encoding)]
                               }
                               , null, 2)}
                        </pre>
                    </div>

                </div>
            </BackgroundContainer>
        </div>
    );
};

export default DashboardOverview;