import React, { useState, useEffect, useRef } from "react";
import doctorImage from "./assets/images/newperrycardium.png";
import ReactDOM from "react-dom";
import {useAppContext} from "./context/appContext";

function QuestionBox({questions,  onComplete, containerRef, isExplanationVisible, setIsExplanationVisible }) {

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const { setDiagnosisPoints } = useAppContext();
    const [shuffledOptions, setShuffledOptions] = useState([]);
    const [dialogue, setDialogue] = useState(questions[0].prompt);
    const isFirstRender = useRef(true);
    const incorrectResponses = ["Try again...", "Not quite.", "Incorrect.", "Nope."];

    const handleViewExplanation = () => {
        setIsExplanationVisible(true); 
      };
    
    const handleCloseExplanation = () => {
    setIsExplanationVisible(false); 
    };


    const handleAnswerClick = (option, e) => {
        if (option === questions[currentQuestionIndex].correctOption) {

            if (attempts === 0) {
                setDiagnosisPoints((prev) => [...prev, 1]);
            } else {
                setDiagnosisPoints((prev) => [...prev, 0]);
            }

            setDialogue("Correct!"); 

        } else {
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
            void button.offsetWidth; 
            button.classList.add("vibrating");
    
            setTimeout(() => {
                setDialogue(questions[currentQuestionIndex].prompt); // Reset prompt
            }, 500);
        }
    };

    const handleContinue = () => {
        if (currentQuestionIndex + 1 < questions.length) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else if (onComplete) {
            onComplete(); // Notify parent when all questions are completed
        }
    };

    const modalContent = (
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
                    onClick={handleCloseExplanation}
                >
                    Close
                </button>
            </div>
        </div>
    );

    useEffect(() => {
            setShuffledOptions([...questions[currentQuestionIndex].options].sort(() => Math.random() - 0.5));
            setDialogue(questions[currentQuestionIndex].prompt);
            setAttempts(0);
            if (isFirstRender.current) {
                setTimeout(() => {
                    isFirstRender.current = false;
                }, 0);
            }
        }, [currentQuestionIndex, questions]);
    
    useEffect(() => {
        const doctorImage = document.querySelector(".doctor-image");
        if (doctorImage) {
            doctorImage.classList.remove("vibrating");
            void doctorImage.offsetWidth; 

            const iterations = Math.ceil(dialogue.length * 0.2);
            const typingDelay = isFirstRender.current ? 0.5 : 0;

            doctorImage.style.setProperty("--vibrating-iterations", iterations);
            doctorImage.style.setProperty("--typing-delay", `${typingDelay}s`);
            doctorImage.classList.add("vibrating");
        }
    }, [dialogue]);

    return (
        <div className = "diagnosis-question-container">
    
            {isExplanationVisible &&
                containerRef.current &&
                ReactDOM.createPortal(modalContent, containerRef.current)}
            
            <img
            src={doctorImage}
            alt = "doctor"
            className="doctor-image"
            />

            <h3 
                style={{
                    '--typing-duration': `${dialogue.length * 0.02}s`,
                    '--typing-delay': isFirstRender.current ? '0.5s' : '0s',
                    '--typing-steps': dialogue.length,
                }}
                key={dialogue}>{dialogue} 
            </h3> 

            {dialogue === "Correct!" && (
                <>
                <button
                    className="continue-button"
                    onClick={handleContinue}
                >
                    Continue
                </button>

                <button
                    className="view-explanation-button"
                    onClick={handleViewExplanation}
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
    )
}

export default QuestionBox;