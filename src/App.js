import "./App.css";
import PatientStem from "./stemComponent";
import InvestigationStage from "./InvestigationStage";
import DiagnosisStage from "./DiagnosisStage";
import ScoringStage from "./ScoringStage";
import caseData from "./cases.json";
import React, { useMemo, useState } from "react";
import cardiology from "./assets/images/cardiology.png";
import respiratory from "./assets/images/respiratory.png";
import {
  useAppContext,
  STAGE_SPECIALTY,
  STAGE_INVESTIGATION,
  STAGE_DIAGNOSIS,
  STAGE_SCORING,
  STAGE_START,
} from "./context/appContext";
import StartMenu from "./startMenu";

function App() {
  const [overallScore, setOverallScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const {
    currentStage,
    setCurrentStage,
    selectedSpecialty,
    handleSpecialty,
    caseID,
    setCaseID,
  } = useAppContext();

  // 'useMemo' is a nice optimization tool.
  // Whenever state changes in React, it causes the state component (in this case 'App') and all it's children to re-render
  // 'useMemo' hook enables us to skip recomputing this value unless its dependencies change (deps are defined in the [])
  // currentCase will only get recomputed if caseID changes, regardless of how many times this component re-renders. This is ideal.
  // Note: `useCallback` is a similar optimization tool used for functions.
  const currentCase = useMemo(
    () => caseData.cases.find((c) => c.id === caseID),
    [caseID]
  );

  return (
    <div className="App">
      {currentStage !== STAGE_START && currentStage !== STAGE_SPECIALTY && (
        <>
          <PatientStem
            key={caseID}
            stem={currentCase.stem}
            currentStage={currentStage}
            setCurrentStage={setCurrentStage}
          />
        </>
      )}

      {currentStage === STAGE_START && (
        <StartMenu setCurrentStage={setCurrentStage} />
      )}

      {currentStage === STAGE_SPECIALTY && (
        <div className="specialty-menu">
          <h2>Choose Your Specialty</h2>
          <div className="specialty-buttons">
            <button
              className="specialty-button"
              onClick={() => handleSpecialty("cardiology")}
            >
              <img
                className="cardiology-button"
                src={cardiology}
                alt="Cardiology"
              />
              <span>Cardiology</span>
            </button>
            <button
              className="specialty-button"
              onClick={() => handleSpecialty("respiratory")}
            >
              <img
                className="respiratory-button"
                src={respiratory}
                alt="Respiratory"
              />
              <span>Respiratory</span>
            </button>
          </div>
        </div>
      )}

      {currentStage === STAGE_INVESTIGATION && (
        <InvestigationStage
          currentCase={currentCase}
          selectedSpecialty={selectedSpecialty}
          setCurrentStage={setCurrentStage}
        />
      )}

      {currentStage === STAGE_DIAGNOSIS && (
        <DiagnosisStage
          currentCase={currentCase}
          setCaseID={setCaseID}
          setCurrentStage={setCurrentStage}
          investigationPoints={currentStage.investigationPoints}
          caseData={caseData}
        />
      )}

      {currentStage === STAGE_SCORING && (
        <ScoringStage
          investigationPoints={currentStage.investigationPoints}
          diagnosisPoints={currentStage.diagnosisPoints}
          totalPoints={totalPoints}
          setTotalPoints={setTotalPoints}
          currentCase={currentCase}
          overallScore={overallScore} // Pass overall score
          setOverallScore={setOverallScore} // Pass setter
          setCaseID={setCaseID}
          setCurrentStage={setCurrentStage}
        />
      )}
    </div>
  );
}

export default App;
