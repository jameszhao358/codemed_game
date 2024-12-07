import React, { useState, useEffect } from 'react';
import PatientImage from './patientComponent';
import InvestigationMenu from './investigationComponent';

function InvestigationStage({currentCase, setCurrentStage}) {
  const [selectedInvestigation, setSelectedInvestigation] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [criticalCount, setCriticalCount] = useState(0);

  const [heartRate, setHeartRate] = useState(parseInt(currentCase.obs.HR, 10));
  const minHR = parseInt(currentCase.obs.HR, 10) - 10;
  const maxHR = parseInt(currentCase.obs.HR, 10) + 10;

  const totalCritical = currentCase.investigations.filter((inv) => inv.critical).length;
  const [selectedInvestigations, setSelectedInvestigations] = useState([]);

  const handleInvestigationClick = (investigationName) => {
    const selected = currentCase.investigations.find(
      (investigation) => investigation.name === investigationName
    );

    setSelectedInvestigation(selected);
    setIsModalVisible(true);

    if (!selectedInvestigations.includes(investigationName)) {
      setSelectedInvestigations((prevArray) => [...prevArray, investigationName]);

      if (selected.critical && criticalCount < totalCritical) {
        setCriticalCount((prevCount) => prevCount + 1);
      }
    }
  };

  useEffect(() => { 
    const interval = setInterval(() => {
      setHeartRate((prevHR) => {
        const fluctuation = Math.floor(Math.random() * 7) - 3;
        const newHR = prevHR + fluctuation;

        return Math.min(Math.max(newHR, minHR), maxHR);
        });
      }, 2000); 

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [minHR, maxHR]);

  useEffect(() => {
    const container = document.querySelector('.investigate-container');
    if (container) {
      container.classList.add('slide-up');
    }
  }, []);

  return (
    <div className="investigate-container">

      <PatientImage image={currentCase.patientImage} />

      <div className="obs-container">
        <p>BP: {currentCase.obs.BP}</p>
        <p>Temp: {currentCase.obs.Temp}</p>
        <p>HR: {heartRate}</p>
        <p>RR: {currentCase.obs.RR}</p>
      </div>

      <div className="investigation-records-container">
        <h3>Critical Investigations</h3>
        <p className={criticalCount === totalCritical ? 'highlight-animation' : ''}>
          {criticalCount} / {totalCritical}
        </p>
        {criticalCount === totalCritical && (
          <button 
            className="proceed-button"
            onClick={() => {

              const investigateContainer = document.querySelector(".investigate-container");
                        if (investigateContainer) {

                        investigateContainer.style.animation = "none";
                        void investigateContainer.offsetWidth;
                        investigateContainer.style.animation = "slideDown 1s ease-in forwards";
                        }

              document.querySelector('.investigate-container').classList.add('slide-down');
              setTimeout(() => setCurrentStage("diagnosis"), 1000); 
            }}
          >
            Proceed
          </button>
        )}
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