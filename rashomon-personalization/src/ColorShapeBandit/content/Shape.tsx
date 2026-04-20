import "./Shape.css";
import React from "react";
import {type Configuration} from "../configuration.ts";

const Shape: React.FC<Configuration> = ({ color, shape }: Configuration) => {
  const shapeClass = `shape ${shape}`;
  const style = shape === "triangle"
    ? {}
    : { backgroundColor: color };

  return (
    <div className="shape-container">
      <div
        className={shapeClass} 
        style={shape === "triangle" ? { borderBottomColor: color } : style}
      ></div>
    </div>
  );
};

export default Shape;
