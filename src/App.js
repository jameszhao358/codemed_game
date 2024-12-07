import './App.css';
import PatientStem from './stemComponent';
import InvestigationStage from './InvestigationStage';
import DiagnosisStage from './DiagnosisStage';
import caseData from './cases.json';
import React, { useState } from 'react';

  function App() {
    const [caseID, setCaseID] = useState(1);
    const currentCase = caseData.cases.find((c) => c.id === caseID);
    const [currentStage, setCurrentStage] = useState("investigation");

    return (
      <div className="App">

        <div class="patient-stem-container">
            <PatientStem key={caseID} stem={currentCase.stem} />
        </div>

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