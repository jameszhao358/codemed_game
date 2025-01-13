import './App.css';
import PatientStem from './stemComponent';
import InvestigationStage from './InvestigationStage';
import DiagnosisStage from './DiagnosisStage';
import ScoringStage from './ScoringStage';
import caseData from './cases.json';
import React, { useState } from 'react';
import cardiology from "./assets/images/cardiology.png";
import respiratory from "./assets/images/respiratory.png";

  function App() {
    const [caseID, setCaseID] = useState(5);
    const [overallScore, setOverallScore] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);
    const [selectedSpecialty, setSelectedSpecialty] = useState(null);
    const currentCase = caseData.cases.find((c) => c.id === caseID);

    const [currentStage, setCurrentStage] = useState({
      stage: "start", // Initial stage
      investigationPoints: [], // Store investigation points here
      diagnosisPoints: []
    });

    const handleSpecialtySelection = (specialty) => {
      const filteredCases = caseData.cases.filter((c) => c.specialty === specialty);
      if (filteredCases.length > 0) {
          setSelectedSpecialty(specialty);
          setCaseID(filteredCases[0].id); 
          setCurrentStage({ ...currentStage, stage: "investigation" });
      } else {
          alert(`No cases available yet.`);
      }
    };  

    return (
      <div className="App">

        {currentStage.stage !== "start" && currentStage.stage !== "specialty" && (
          <>
            <PatientStem 
              key={caseID} 
              stem={currentCase.stem} 
              currentStage={currentStage.stage}
              setCurrentStage={setCurrentStage}
            />
          </>
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
              onClick={() => setCurrentStage({ ...currentStage, stage: "specialty" })}
            >
              BEGIN
            </button>
            <p> A project by James Zhao & Bill Goh</p>
          </div>
        )}

        {currentStage.stage === "specialty" && (
          <div className="specialty-menu">
              <h2>Choose Your Specialty</h2>
                <div className="specialty-buttons">
                  <button
                    className="specialty-button"
                    onClick={() => handleSpecialtySelection("cardiology")}
                  >
                    <img className="cardiology-button" src={cardiology} alt="Cardiology" />
                    <span>Cardiology</span>
                  </button>
                  <button
                    className="specialty-button"
                    onClick={() => handleSpecialtySelection("respiratory")}
                  >
                    <img className="respiratory-button" src={respiratory} alt="Respiratory" />
                    <span>Respiratory</span>
                  </button>
                </div>
          </div>
        )}

        {currentStage.stage === "investigation" && (
            <InvestigationStage
              currentCase={currentCase}
              selectedSpecialty={selectedSpecialty}
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