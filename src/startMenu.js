import React from "react";
import { STAGE_SPECIALTY } from "./context/appContext";

const StartMenu = ({ setCurrentStage }) => {
  return (
    <div className="start-menu">
      <h1 className="start-title">
        {"CODE: MED".split("").map((char, index) => (
          <span
            key={index}
            className={char === " " ? "space" : ""}
            style={{
              animationDelay: `${index * -0.2}s`,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>
      <button
        className="start-button"
        onClick={() => setCurrentStage(STAGE_SPECIALTY)}
      >
        BEGIN
      </button>
      <p> A project by James Zhao & Bill Goh</p>
    </div>
  );
};

export default StartMenu;
