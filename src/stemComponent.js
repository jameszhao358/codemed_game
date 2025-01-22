import React from "react";
import { useAppContext } from "./context/appContext";

function PatientStem({ stem }) {
  const { resetStage, transitionToScoring } = useAppContext();

  return (
    <>
      <div
        className={`patient-stem-container ${
          transitionToScoring ? "slide-up-stem" : "slide-down-stem"
        }`}
      >
        <h2 className="patient-stem">{stem}</h2>
      </div>
      <button className="back-button" onClick={resetStage}>
        &lt;
      </button>
    </>
  );
}

export default PatientStem;
