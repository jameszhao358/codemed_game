import doctorImage from "./assets/images/drstrange.png";
import React, {useState, useEffect} from "react";

function DiagnosisStage({ currentCase, setCaseID, setCurrentStage, caseData }) {

    const criticalInvestigations = currentCase.investigations.filter(
        (investigation) => investigation.critical
      );

    const [showModal, setShowModal] = useState(false);
    const [shuffledOptions, setShuffledOptions] = useState([]);

    useEffect(() => {
        setShuffledOptions([...currentCase.diagnosisOptions].sort(() => Math.random() - 0.5));
      }, [currentCase]);

    useEffect(() => {
    const container = document.querySelector('.diagnosis-container');
    if (container) {
        container.classList.add('slide-up');
    }
    }, []);

    const handleAnswerClick = (option, e) => {
        if (option === currentCase.correctOption) {
            setShowModal(true); // Show modal for correct answer
        } else {
            // Trigger shake animation directly
            const button = e.target;
            button.classList.remove("vibrating"); // Remove the class first
            void button.offsetWidth; // Trigger reflow to allow re-adding the class
            button.classList.add("vibrating"); // Re-add the class to restart the animation
        }
    };

    return (
    <>
      <div className="diagnosis-container">

        <div className = "investigation-report-container">
            {criticalInvestigations.map((inv, index) => (
            <p key={index}>
                {inv.name}: {inv.result}
            </p>
            ))}
        </div>
        
        <div className = "diagnosis-question-container">

            <img
            src={doctorImage}
            alt = "doctor"
            className="doctor-image"
            />

            <h3>What is the most likely diagnosis?</h3> 

            <div className="answer-grid">
                {shuffledOptions.map((option, index) => (
                    <button
                    key={index}
                    className="answer-button"
                    onClick={(e) => handleAnswerClick(option, e)}
                    >
                        {option}
                    </button>
                ))}
            </div>

            <p> Dr. Perry Cardium</p>

        </div>

      </div>

      {showModal !== false && (
        <div className="modal">
            <div className="modal-content">
                <h3 className="correct-text">
                    {"Well done!".split("").map((char, index) => (
                        <span
                        key={index}
                        className={char === " " ? "space" : ""}
                        style={{ 
                            animationDelay: `${-index * 0.2}s`,
                        }}
                        >
                            {char === " " ? "\u00A0" : char}    
                        </span>
                    ))}
                </h3>
                <button 
                    className="next-case-button" 
                    onClick={() => {
                        setShowModal(false);

                        const diagnosisContainer = document.querySelector(".diagnosis-container");
                        if (diagnosisContainer) {

                        diagnosisContainer.style.animation = "none";
                        void diagnosisContainer.offsetWidth;
                        diagnosisContainer.style.animation = "slideDown 1s ease-in forwards";
                        }

                        setTimeout(() => {
                            setCaseID((prevCaseID) => {
                              const nextCaseID = prevCaseID + 1;
                              return nextCaseID > caseData.cases.length ? 1 : nextCaseID;
                            });
                            setCurrentStage("investigation");
                          }, 1000);
                        }}
                    >Next Case!
                </button>

            </div>
        </div>
       )}

    </>
    );
  }
  
  export default DiagnosisStage;