import React, { useState, useEffect } from 'react';
import PatientImage from './patientComponent';
import InvestigationMenu from './investigationComponent';
import notePad from "./assets/images/notepad.png";

function InvestigationStage({currentCase, setCurrentStage}) {
  const [selectedInvestigation, setSelectedInvestigation] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [criticalCount, setCriticalCount] = useState(0);
  const [criticalRevealed, setCriticalRevealed] = useState({});
  const [isListVisible, setIsListVisible] = useState(false);

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

    if (selected.critical) {
      setCriticalRevealed((prev) => ({
        ...prev,
        [investigationName]: true,
      }));
    }

    if (!selectedInvestigations.includes(investigationName)) {
      setSelectedInvestigations((prevArray) => [...prevArray, investigationName]);

      if (selected.critical && criticalCount < totalCritical) {
        setCriticalCount((prevCount) => prevCount + 1);

        const notepadElement = document.querySelector('.toggle-button');
        if (notepadElement) {
          notepadElement.classList.add('pulse2');
          setTimeout(() => {
            notepadElement.classList.remove('pulse2');
          }, 1000); 
        }
      }
    }
  };

  useEffect(() => {
    const popup = document.querySelector('.popup-message');
    if (popup) {
      setTimeout(() => {
        popup.classList.add('fade-in');
      }, 700); // Delay before appearing (500ms)
  
      setTimeout(() => {
        popup.classList.remove('fade-in');
        popup.classList.add('fade-out');
      }, 2500); // Starts fading out after 4 seconds total (500ms delay + 3.5s display time)

      setTimeout(() => {
        popup.remove(); // Destroy popup after fade-out animation
      }, 4000);
    }
  }, []);

  useEffect(() => {
    const initialRevealed = {};
    currentCase.investigations
      .filter((inv) => inv.critical)
      .forEach((inv) => {
        initialRevealed[inv.name] = false;
      });
    setCriticalRevealed(initialRevealed);
  }, [currentCase]);

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

      <div className="popup-message">Choose your investigations!</div>

      <PatientImage image={currentCase.patientImage} />


      <div className="obs-container">
        <p>BP: {currentCase.obs.BP}</p>
        <p>Temp: {currentCase.obs.Temp}</p>
        <p>HR: {heartRate}</p>
        <p>RR: {currentCase.obs.RR}</p>
      </div>

      <div className="investigation-records-container">
        <img
          src={notePad}
          alt="Notepad"
          className="toggle-button"
          onClick={() => setIsListVisible((prev) => !prev)}
        />
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

      {isListVisible && (  
        <div className="modal">
          <div className="modal-box">
            <div className="modal-box-content">
              {currentCase.investigations
                .filter((inv) => inv.critical)
                .every((inv) => !criticalRevealed[inv.name]) && (
                <p> Critical investigation results are recorded here. </p>
              )}
                    
              {currentCase.investigations
                .filter((inv) => inv.critical)
                .map((criticalInv) => (
                  <p
                    key={criticalInv.name}
                    style={{
                      color: criticalRevealed[criticalInv.name] ? '#333333' : 'grey',
                    }}
                  >
                    {criticalRevealed[criticalInv.name] ? criticalInv.result : '???'}
                  </p>
                ))}
              <button
                className="ok-button"
                onClick={() => setIsListVisible(false)} // Close the list
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


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