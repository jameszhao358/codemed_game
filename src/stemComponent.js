import React, {useEffect} from 'react';

function PatientStem({stem}) {

  useEffect(() => {
    const container = document.querySelector('.patient-stem-container');
    if (container) {
      container.classList.add('slide-down-stem');
    }
  }, []);

  return (
    <div className="patient-stem-container">
      <h2 className="patient-stem">{stem}</h2>
    </div>
  );
}
  
  export default PatientStem;