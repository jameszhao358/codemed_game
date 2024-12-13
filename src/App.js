import './App.css';
import PatientStem from './stemComponent';
import InvestigationStage from './InvestigationStage';
import DiagnosisStage from './DiagnosisStage';
import caseData from './cases.json';
import React, { useState } from 'react';

  function App() {
    const [caseID, setCaseID] = useState(1);
    const currentCase = caseData.cases.find((c) => c.id === caseID);
    const [currentStage, setCurrentStage] = useState("start");

    return (
      <div className="App">

        {currentStage !== "start" && (
          <div className="patient-stem-container">
            <PatientStem key={caseID} stem={currentCase.stem} />
          </div>
        )}

        {currentStage === "start" && (
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
              onClick={() => setCurrentStage("investigation")}
            >
              BEGIN
            </button>
            <p> A project by Bill Goh & James Zhao</p>
          </div>
        )}

        {currentStage === "investigation" && (
          <InvestigationStage
            currentCase={currentCase}
            setCurrentStage={setCurrentStage}
          />
        )}

        {currentStage === "diagnosis" && 
          <DiagnosisStage 
            currentCase={currentCase}
            setCaseID={setCaseID}
            setCurrentStage={setCurrentStage}
            caseData={caseData}
          />
        }

      </div>
    );
  }

export default App;