import doctorImage from "./assets/images/perrycardium2.png";
import React, {useState, useEffect, useRef} from "react";
import ecgGrid from "./assets/images/ecgpaperdraft1.png";
import trace1 from "./assets/images/inferiorstemitrace.png";
import trace2 from "./assets/images/afibtrace.png";
import trace3 from "./assets/images/sinustachytrace.png";
import {STAGE_SCORING, useAppContext} from "./context/appContext";

const ecgOverlays = {
    trace1: trace1,
    trace2: trace2,
    trace3: trace3,
  };

function DiagnosisStage({ currentCase, setCaseID, setCurrentStage, caseData, investigationPoints }) {

    const questions = currentCase.questions;
    const criticalInvestigations = currentCase.investigations.filter(
        (investigation) => investigation.critical
      );
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const { setDiagnosisPoints } = useAppContext();
    const [shuffledOptions, setShuffledOptions] = useState([]);
    const [dialogue, setDialogue] = useState(questions[0].prompt);
    const isFirstRender = useRef(true);
    const incorrectResponses = ["Try again...", "Not quite.", "Incorrect.", "Nope."];
    const [tableInvestigation, setTableInvestigation] = useState(null); // Stores the selected investigation for table
    const [isTableModalVisible, setIsTableModalVisible] = useState(false); // Tracks modal visibility
    const [isExplanationVisible, setIsExplanationVisible] = useState(false);
    const imageCache = useRef(new Map());

    useEffect(() => {
        const preloadImages = () => {
          const imagesToPreload = [ecgGrid, ...Object.values(ecgOverlays)];
          imagesToPreload.forEach((src) => {
            if (!imageCache.current.has(src)) {
              const img = new Image();
              img.src = src;
              imageCache.current.set(src, img);
            }
          });
        };
        preloadImages();
      }, []);

    useEffect(() => {
        setShuffledOptions([...questions[currentQuestionIndex].options].sort(() => Math.random() - 0.5));
        setDialogue(questions[currentQuestionIndex].prompt);
        setAttempts(0);
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

            if (attempts === 0) {
                setDiagnosisPoints((prev) => [...prev, 1]);
            } else {
                setDiagnosisPoints((prev) => [...prev, 0]);
            }

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
            
            setAttempts((prev) => prev + 1);

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
      <div className={`diagnosis-container ${isTableModalVisible && "to-front"}`}>
        {isExplanationVisible && (
            <div className="modal">
                <div className="modal-content">
                    <h3>Explanation</h3>
                    <p>
                        <span>
                            {questions[currentQuestionIndex].explanation}
                        </span>
                    </p>
                    <p className="citation">
                        {questions[currentQuestionIndex].sources && questions[currentQuestionIndex].sources.length > 0 ? (
                            questions[currentQuestionIndex].sources.map((source, index) => (
                                <div key={index}>
                                    {source.url ? (
                                        <a
                                            href={source.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {source.name}
                                        </a>
                                    ) : (
                                        <span className="non-url">{source.name}</span>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div>Source coming soon.</div>
                        )}
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
                <div
                className={`modal-content ${
                    tableInvestigation.name === "ECG" ? "ecg-modal" : ""
                }`}
                >
                <h3>{tableInvestigation.name}</h3>
                {tableInvestigation.name === "ECG" ? (
                    <div className="ecg-container">
                    <img
                        src={imageCache.current.get(ecgGrid).src}
                        alt="ECG Grid"
                        className="ecg-grid"
                    />
                    <img
                        src={imageCache.current.get(ecgOverlays[tableInvestigation.image]).src}
                        alt="ECG overlay"
                        className="ecg-trace"
                    />
                    </div>
                ) : tableInvestigation.isTable ? (
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
                ) : (
                    <p>{tableInvestigation.result}</p>
                )}
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
                    cursor: inv.name === "ECG" || inv.isTable ? "pointer" : "default",
                    color: inv.name === "ECG" ? "#ff0000" : inv.isTable ? "#007bff" : "#505050",
                    }}
                    onClick={() => {
                    if (inv.name === "ECG" || inv.isTable) {
                        setTableInvestigation({ ...inv }); // Set the selected investigation
                        setIsTableModalVisible(true); // Open the modal
                    }
                    }}
                >
                    {inv.name === "ECG"
                    ? `${inv.name} (click for results)`
                    : inv.isTable
                    ? `${inv.name} (click for table)`
                    : `${inv.name}: ${inv.result}`}
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

                            const stemContainer = document.querySelector('.patient-stem-container');
                            if (stemContainer) {
                            stemContainer.style.animation = 'none'; // Reset animation
                            void stemContainer.offsetWidth; // Trigger reflow
                            stemContainer.style.animation = 'slideUpStem 0.7s ease-in forwards';
                            }

                            setTimeout(() => {
                                setCurrentStage(STAGE_SCORING);
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
    </>
    );
  }
  
  export default DiagnosisStage;