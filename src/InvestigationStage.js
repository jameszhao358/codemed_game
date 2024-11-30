import React, { useState, useEffect } from 'react';
import PatientStem from './stemComponent';
import PatientImage from './patientComponent';
import InvestigationMenu from './investigationComponent';
import caseData from './cases.json';

function InvestigationStage() {
  const [caseID] = useState(2);
  const [selectedInvestigation, setSelectedInvestigation] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const currentCase = caseData.cases.find((c) => c.id === caseID);

  const [heartRate, setHeartRate] = useState(parseInt(currentCase.obs.HR, 10));

  const handleInvestigationClick = (investigationName) => {
    const selected = currentCase.investigations.find(
      (investigation) => investigation.name === investigationName
    );
    setSelectedInvestigation(selected);
    setIsModalVisible(true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate((prevHR) => {
        // Generate a random fluctuation between -3 and +3 BPM
        const fluctuation = Math.floor(Math.random() * 7) - 3;
        const newHR = prevHR + fluctuation;

        // Ensure HR stays within a realistic range (e.g., 60 to 100 BPM)
        return Math.min(Math.max(newHR, 60), 100);
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="investigate-container">

      <div class="patient-stem-container">
        <PatientStem stem={currentCase.stem} />
      </div>

      <PatientImage image={currentCase.patientImage} />

      <div className="obs-container">
        <p>BP: {currentCase.obs.BP}</p>
        <p>Temp: {currentCase.obs.Temp}</p>
        <p>HR: {heartRate}</p>
        <p>RR: {currentCase.obs.RR}</p>
      </div>

      <div className="investigation-records-container">
        <h3>Investigation Results</h3>
        <ul>
          <li>???</li>
          <li>???</li>
          <li>???</li>
        </ul>
      </div>

      <InvestigationMenu
        investigations={currentCase.investigations.map((inv) => inv.name)}
        onInvestigationClick={handleInvestigationClick}
      />

      {isModalVisible && selectedInvestigation && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedInvestigation.name}</h3>
            <p>
              {selectedInvestigation.result.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </p>
            <button
              className="ok-button"
              onClick={() => setIsModalVisible(false)}
            >
              OK
            </button>
          </div>
        </div>

      )}
    </div>
  );
}

export default InvestigationStage;