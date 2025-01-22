import React, {useState, useEffect, useRef} from "react";
import ecgGrid from "./assets/images/ecgpaperdraft1.png";
import trace1 from "./assets/images/inferiorstemitrace.png";
import trace2 from "./assets/images/afibtrace.png";
import trace3 from "./assets/images/sinustachytrace.png";
import {STAGE_SCORING, useAppContext} from "./context/appContext";
import QuestionBox from "./questionBox";

const ecgOverlays = {
    trace1: trace1,
    trace2: trace2,
    trace3: trace3,
  };

function DiagnosisStage({ currentCase, setCurrentStage }) {

    const criticalInvestigations = currentCase.investigations.filter(
        (investigation) => investigation.critical
      );

    const [tableInvestigation, setTableInvestigation] = useState(null); // Stores the selected investigation for table
    const [isTableModalVisible, setIsTableModalVisible] = useState(false); // Tracks modal visibility
    const [isExplanationVisible, setIsExplanationVisible] = useState(false);
    
    const { transitionToScoring, setTransitionToScoring } = useAppContext();
    const imageCache = useRef(new Map());
    const diagnosisContainerRef = useRef(null);

    const handleComplete = () => {
        setTransitionToScoring(true); // Start the scoring transition
        setTimeout(() => {
            setCurrentStage(STAGE_SCORING); // Change the stage after transition
        }, 1000); // Match animation duration
    };

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

    return (
    <>
      <div
        ref={diagnosisContainerRef}
        className={`diagnosis-container ${
            isTableModalVisible || isExplanationVisible ? "to-front" : ""
        } ${
            transitionToScoring ? "slide-down" : "slide-left-in"
        }`}
        >
        
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

        <QuestionBox
            questions={currentCase.questions}
            onComplete={handleComplete}
            containerRef={diagnosisContainerRef}
            isExplanationVisible={isExplanationVisible}
            setIsExplanationVisible={setIsExplanationVisible}
        />

      </div>
    </>
    );
  }
  
  export default DiagnosisStage;