import doctorImage from "./assets/images/perrycardium2.png";
import React, {useState, useEffect, useRef} from "react";

function DiagnosisStage({ currentCase, setCaseID, setCurrentStage, caseData }) {

    const questions = currentCase.questions;
    const criticalInvestigations = currentCase.investigations.filter(
        (investigation) => investigation.critical
      );

    // const [showModal, setShowModal] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [shuffledOptions, setShuffledOptions] = useState([]);
    const [dialogue, setDialogue] = useState(questions[0].prompt);
    const isFirstRender = useRef(true);
    const incorrectResponses = ["Try again...", "Not quite.", "Incorrect.", "Nope."];

    useEffect(() => {
        setShuffledOptions([...questions[currentQuestionIndex].options].sort(() => Math.random() - 0.5));
        setDialogue(questions[currentQuestionIndex].prompt);
        if (isFirstRender.current) {isFirstRender.current = false;}
    }, [currentQuestionIndex, questions]);

    useEffect(() => {
        const doctorImage = document.querySelector(".doctor-image");
        if (doctorImage) {
            // Remove and force reflow to reset animation
            doctorImage.classList.remove("vibrating");
            void doctorImage.offsetWidth; // Trigger reflow
    
            // Set the animation iterations dynamically
            const iterations = dialogue.length < 15 ? 2 : 10; // 2 iterations for "Correct!", 10 for others
            doctorImage.style.setProperty("--vibrating-iterations", iterations);
    
            // Reapply the vibrating class
            doctorImage.classList.add("vibrating");
        }
    }, [dialogue]);

    useEffect(() => {
    const container = document.querySelector('.diagnosis-container');
    if (container) {
        container.classList.add('slide-up');
    }
    }, []);

    const handleAnswerClick = (option, e) => {
        if (option === questions[currentQuestionIndex].correctOption) {
            setDialogue("Correct!"); 

            setTimeout(() => {
                if (currentQuestionIndex + 1 < questions.length) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1); // Move to the next question
                } else {

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
                }
            }, 1000);

        } else {
            setDialogue((prevDialogue) => {
                let newDialogue;
                do {
                    newDialogue = incorrectResponses[Math.floor(Math.random() * incorrectResponses.length)];
                } while (newDialogue === prevDialogue); // Ensure it's not the same as the last response
                return newDialogue;
            });
            const button = e.target;
            button.classList.remove("vibrating");
            void button.offsetWidth; // Trigger reflow
            button.classList.add("vibrating");

            setTimeout(() => {
                setDialogue(questions[currentQuestionIndex].prompt);
            }, 500);
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

            <h3 
                style={{
                    '--typing-duration': dialogue.length <= 15 ? '0.2s' : '1s',
                    '--typing-delay': isFirstRender.current ? '0.5s' : '0s',
                    'fontSize': dialogue.length > 54 ? "18px" : "20px",
                }}
                key={dialogue}>{dialogue} 
            </h3> 

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

      {/* {showModal !== false && (
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

       )} */}

    </>
    );
  }
  
  export default DiagnosisStage;