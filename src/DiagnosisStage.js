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
    const [tableInvestigation, setTableInvestigation] = useState(null); // Stores the selected investigation for table
    const [isTableModalVisible, setIsTableModalVisible] = useState(false); // Tracks modal visibility
    const [isExplanationVisible, setIsExplanationVisible] = useState(false);

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
            setDialogue("Correct!"); // Set dialogue to "Correct!" and halt progression
        } else {
            // Handle incorrect responses
            setDialogue((prevDialogue) => {
                let newDialogue;
                do {
                    newDialogue = incorrectResponses[Math.floor(Math.random() * incorrectResponses.length)];
                } while (newDialogue === prevDialogue); // Ensure a different response
                return newDialogue;
            });
    
            // Add vibration effect to the button
            const button = e.target;
            button.classList.remove("vibrating");
            void button.offsetWidth; // Trigger reflow
            button.classList.add("vibrating");
    
            setTimeout(() => {
                setDialogue(questions[currentQuestionIndex].prompt); // Reset prompt
            }, 500);
        }
    };

    return (
    <>
      <div className="diagnosis-container">
        {isExplanationVisible && (
            <div className="modal">
                <div className="modal-content">
                    <h3>Explanation</h3>
                    <p>
                        <span>
                            {questions[currentQuestionIndex].explanation}
                        </span>
                    </p>
                    <button
                        className="close-button"
                        onClick={() => setIsExplanationVisible(false)}
                    >
                        Close
                    </button>
                </div>
            </div>
        )}
        
        {isTableModalVisible && tableInvestigation && (
            <div className="modal">
                <div className="modal-content">
                <h3>{tableInvestigation.name}</h3>
                <table>
                    <tbody>
                    {tableInvestigation.result.split("\n").map((line, index) => {
                        const [parameter, value, reference] = line.split(": ");
                        return (
                        <tr key={index}>
                            <td>{parameter}</td>
                            <td>{value}</td>
                            <td>{reference}</td>
                        </tr>
                        );
                    })}
                    </tbody>
                </table>
                <button
                    className="close-button"
                    onClick={() => setIsTableModalVisible(false)}
                >
                    Close
                </button>
                </div>
            </div>
        )}

        <div className = "investigation-report-container">
        {criticalInvestigations.map((inv, index) => (
            <p
                key={index}
                style={{
                    cursor: inv.isTable ? 'pointer' : 'default',
                    color: inv.isTable ? '#007bff' : '#333333',
                }}
                onClick={() => {
                    if (inv.isTable) {
                    setTableInvestigation({ ...inv }); // Set the selected investigation for the table
                    setIsTableModalVisible(true); // Open the modal
                    }
                }}
                >
                {inv.isTable ? `${inv.name} (click for results)` : `${inv.name}: ${inv.result}`}
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

            {dialogue === "Correct!" && (
                <>
                <button
                    className="continue-button"
                    onClick={() => {
                        if (currentQuestionIndex + 1 < questions.length) {
                            setCurrentQuestionIndex(currentQuestionIndex + 1); // Move to the next question
                            setDialogue(questions[currentQuestionIndex + 1].prompt); // Update dialogue
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
                    }}
                >
                    Continue
                </button>

                <button
                    className="view-explanation-button"
                    onClick={() => setIsExplanationVisible(true)}
                    >
                    View Explanation
                </button>
                </>
            )}

            <div className="answer-grid">
                {shuffledOptions.map((option, index) => (
                    <button
                    key={index}
                    className="answer-button"
                    onClick={(e) => handleAnswerClick(option, e)}
                    disabled = {dialogue === "Correct!"}
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