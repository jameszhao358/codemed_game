import './App.css';
import PatientStem from './stemComponent';
import InvestigationStage from './InvestigationStage';
import DiagnosisStage from './DiagnosisStage';
import ScoringStage from './ScoringStage';
import caseData from './cases.json';
import React, { useState } from 'react';

  function App() {
    const [caseID, setCaseID] = useState(1);
    const [overallScore, setOverallScore] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);
    const currentCase = caseData.cases.find((c) => c.id === caseID);
    const [currentStage, setCurrentStage] = useState({
      stage: "start", // Initial stage
      investigationPoints: [], // Store investigation points here
      diagnosisPoints: []
    });

    return (
      <div className="App">

        {currentStage.stage !== "start" && (
          <PatientStem key={caseID} stem={currentCase.stem} currentStage={currentStage.stage} />
        )}

        {currentStage.stage === "start" && (
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
              onClick={() => setCurrentStage({ ...currentStage, stage: "investigation" })}
            >
              BEGIN
            </button>
            <p> A project by Bill Goh & James Zhao</p>
          </div>
        )}

        {currentStage.stage === "investigation" && (
            <InvestigationStage
              currentCase={currentCase}
              setCurrentStage={setCurrentStage}
            />
        )}

        {currentStage.stage === "diagnosis" && (
          <DiagnosisStage 
            currentCase={currentCase}
            setCaseID={setCaseID}
            setCurrentStage={setCurrentStage}
            investigationPoints={currentStage.investigationPoints}
            caseData={caseData}
          />
        )}

        {currentStage.stage === "scoring" && (
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