import React, {useEffect} from 'react';

function PatientStem({stem, setCurrentStage}) {

  useEffect(() => {
    const container = document.querySelector('.patient-stem-container');
    if (container) {
      container.classList.add('slide-down-stem');
    }
  }, []);

  return (
    <>
      <div className="patient-stem-container">
        <h2 className="patient-stem">{stem}</h2>
      </div>
      <button 
          className = "back-button"
          onClick={() => 
            setCurrentStage({ stage: "specialty", investigationPoints: [], diagnosisPoints: [] })}
        >
          &lt;
      </button>
    </>
  );
}
  
  export default PatientStem;