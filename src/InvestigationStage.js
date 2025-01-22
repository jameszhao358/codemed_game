import React, { useState, useEffect, useRef } from "react";
import PatientImage from "./patientComponent";
import InvestigationMenu from "./investigationComponent";
import QuestionBox from "./questionBox";
import arrow from "./assets/images/arrow.png";
import magnifyingglass from "./assets/images/mag.png"

import ecgGrid from "./assets/images/ecgpaperdraft1.png";
import trace1 from "./assets/images/inferiorstemitrace.png";
import trace2 from "./assets/images/afibtrace.png";
import trace3 from "./assets/images/sinustachytrace.png";
import { STAGE_DIAGNOSIS, useAppContext } from "./context/appContext";

const ecgOverlays = {
  trace1: trace1,
  trace2: trace2,
  trace3: trace3,
  // Add more mappings for additional overlays
};

function InvestigationStage({
  currentCase,
  setCurrentStage,
  selectedSpecialty,
}) {
  const [selectedInvestigation, setSelectedInvestigation] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isExplanationVisible, setIsExplanationVisible] = useState(false);
  const [criticalCount, setCriticalCount] = useState(0);
  const [ancillaryCount, setAncillaryCount] = useState(0);
  const [criticalRevealed, setCriticalRevealed] = useState({});
  const [ancillaryRevealed, setAncillaryRevealed] = useState({});
  const [isListVisible, setIsListVisible] = useState(false);
  const [isList2Visible, setIsList2Visible] = useState(false);
  const [finishPre, setFinishPre] = useState(false);

  const { investigationPoints, setInvestigationPoints } = useAppContext();
  const { transitionToDiagnosis, setTransitionToDiagnosis } = useAppContext();

  const [heartRate, setHeartRate] = useState(parseInt(currentCase.obs.HR, 10));
  const minHR = parseInt(currentCase.obs.HR, 10) - 10;
  const maxHR = parseInt(currentCase.obs.HR, 10) + 10;

  const totalCritical = currentCase.investigations.filter(
    (inv) => inv.points === "critical"
  ).length;
  const [selectedInvestigations, setSelectedInvestigations] = useState([]);

  const imageCache = useRef(new Map());
  const investigateContainerRef = useRef(null);

  React.useEffect(() => {
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

  const handleInvestigationClick = (investigationName) => {
    const selected = currentCase.investigations.find(
      (investigation) => investigation.name === investigationName
    );
    const category = selected.points;
    const points =
      category === "critical" ? 100 : category === "ancillary" ? 10 : -10;

    setSelectedInvestigation(selected);
    setIsModalVisible(true);

    if (!selectedInvestigations.includes(investigationName)) {
      setInvestigationPoints((prevPoints) =>
        prevPoints.map((entry) =>
          entry.category === category
            ? { ...entry, points: entry.points + points }
            : entry
        )
      );

      setSelectedInvestigations((prevArray) => [
        ...prevArray,
        investigationName,
      ]);

      if (selected.points === "critical") {
        setCriticalRevealed((prev) => ({
          ...prev,
          [investigationName]: true,
        }));
      }

      if (selected.points === "ancillary") {
        setAncillaryRevealed((prev) => ({
          ...prev,
          [investigationName]: true,
        }));
      }

      if (selected.points === "critical" && criticalCount < totalCritical) {
        setCriticalCount((prevCount) => prevCount + 1);
      }

      if (selected.points === "ancillary") {
        setAncillaryCount((prevCount) => prevCount + 1);
      }
    }
  };

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
    console.log("Updated Investigation Points:", investigationPoints);
  }, [investigationPoints]);

  return (
    <div
        ref={investigateContainerRef}
        className={`investigate-container ${
            isModalVisible || isExplanationVisible ? "to-front" : ""
        } ${
            transitionToDiagnosis ? "slide-left-out" : "slide-up"
        }`}
    >

      <div className={`patient-wrapper ${
        currentCase.preInv
          ? finishPre
            ? "slide-down-bit"
            : "slide-up-high"
          : ""
      }`}>

        <div className="obs-container">
          <p>BP: {currentCase.obs.BP}</p>
          <p>Temp: {currentCase.obs.Temp}</p>
          <p>HR: {heartRate}</p>
          <p>RR: {currentCase.obs.RR}</p>
          <p>SPO2: {currentCase.obs.SPO2}</p>
        </div>
        
        <PatientImage image={currentCase.patientImage} />

        <div className="investigation-records-container">
          <img
            src={magnifyingglass}
            alt="Magnifying Glass"
          />
          <h3>Investigations:</h3>
          <p
            className={`critical-button ${
              criticalCount === totalCritical ? "highlight-animation" : ""
            }`}
            onClick={() => setIsListVisible((prev) => !prev)}
          >
            Critical: {criticalCount} / {totalCritical}
          </p>
          <p
            className='ancillary-button'
            onClick={() => setIsList2Visible((prev) => !prev)}
          > 
            Ancillary: +{ancillaryCount} 
          </p>
          
        </div>

        {criticalCount === totalCritical && (
            <img
              src={arrow}
              alt="Arrow"
              className="proceed-button"
              onClick={() => {
                setTransitionToDiagnosis(true);
                setTimeout(() => {
                  setCurrentStage(STAGE_DIAGNOSIS);
                }, 1000);
              }}
            />
          )}

      </div>

      {isListVisible && (
        <div className="modal">
          <div className="modal-box">
            <div className="modal-box-content">
              {currentCase.investigations
                .filter((inv) => inv.points === "critical")
                .every((inv) => !criticalRevealed[inv.name]) && (
                <p> Critical investigation results are recorded here. </p>
              )}

              {currentCase.investigations
                .filter((inv) => inv.points === "critical")
                .map((criticalInv) => (
                  <p
                    key={criticalInv.name}
                    style={{
                      cursor:
                        (criticalInv.isTable || criticalInv.name === "ECG") &&
                        criticalRevealed[criticalInv.name]
                          ? "pointer"
                          : "default",
                      color: !criticalRevealed[criticalInv.name]
                        ? "grey" // Unrevealed investigations show as grey
                        : criticalInv.name === "ECG"
                        ? "#ff0000" // Red for revealed ECGs
                        : criticalInv.isTable
                        ? "#007bff" // Blue for revealed table investigations
                        : "#333333", // Dark gray for other revealed investigations
                    }}
                    onClick={() => {
                      if (
                        (criticalInv.isTable || criticalInv.name === "ECG") &&
                        criticalRevealed[criticalInv.name]
                      ) {
                        setSelectedInvestigation({ ...criticalInv });
                        setIsModalVisible(true); // Open the modal
                      }
                    }}
                  >
                    {criticalRevealed[criticalInv.name]
                      ? criticalInv.isTable || criticalInv.name === "ECG"
                        ? `${criticalInv.name} (click for results)`
                        : `${criticalInv.name}: ${criticalInv.result}`
                      : "???"}
                  </p>
                ))}
            </div>
            <button
              className="close-button"
              onClick={() => setIsListVisible(false)} // Close the list
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isList2Visible && (
        <div className="modal">
          <div className="modal-box">
            <div className="modal-box-content">
              {currentCase.investigations
                .filter((inv) => inv.points === "ancillary")
                .every((inv) => !ancillaryRevealed[inv.name]) && (
                <p> Ancillary investigation results are recorded here. </p>
              )}

              {currentCase.investigations
                .filter((inv) => inv.points === "ancillary")
                .map(
                  (ancillaryInv) =>
                    ancillaryRevealed[ancillaryInv.name] && ( // Only display revealed investigations
                      <p
                        key={ancillaryInv.name}
                        style={{
                          cursor:
                            ancillaryInv.isTable && ancillaryRevealed[ancillaryInv.name]
                              ? "pointer"
                              : "default",
                          color: ancillaryInv.isTable
                            ? "#007bff" // Blue for revealed table investigations
                            : "#333333", // Dark gray for other investigations
                        }}
                        onClick={() => {
                          if (ancillaryInv.isTable) {
                            setSelectedInvestigation({ ...ancillaryInv });
                            setIsModalVisible(true); // Open the modal for details
                          }
                        }}
                      >
                        {ancillaryInv.isTable
                          ? `${ancillaryInv.name} (click for details)`
                          : `${ancillaryInv.name}: ${ancillaryInv.result}`}
                      </p>
                    )
                )}
            </div>
            <button
              className="close-button"
              onClick={() => setIsList2Visible(false)} // Close the list
            >
              Close
            </button>
          </div>
        </div>
      )}

      {currentCase.preInv && (
        <div
          className={`pre-question-box ${
            finishPre ? "slide-down-preq" : "slide-up"
          }`}
        >
          <QuestionBox
            questions={currentCase["pre-questions"] || []}
            onComplete={() => setFinishPre(true)}
            containerRef={investigateContainerRef}
            isExplanationVisible={isExplanationVisible}
            setIsExplanationVisible={setIsExplanationVisible}
          />
        </div>
      )}

      <div
        className={`investigation-menu ${
            currentCase.preInv
                ? finishPre
                    ? "slide-up-menu"
                    : "hidden"
                : "visible"
        }`}
      >
        <InvestigationMenu
            selectedSpecialty={selectedSpecialty}
            investigations={currentCase.investigations.map((inv) => inv.name)}
            onInvestigationClick={handleInvestigationClick}
        />
      </div>

      {isModalVisible && selectedInvestigation && (
        <div className="modal">
          <div
            className={`modal-content ${
              selectedInvestigation.name === "ECG" ? "ecg-modal" : ""
            }`}
          >
            <h3>{selectedInvestigation.name}</h3>
            {selectedInvestigation.name === "ECG" && (
              <div className="ecg-container">
                <img
                  src={imageCache.current.get(ecgGrid).src}
                  alt="ECG Grid"
                  className="ecg-grid"
                />
                <img
                  src={
                    imageCache.current.get(
                      ecgOverlays[selectedInvestigation.image]
                    ).src
                  }
                  alt="ECG overlay"
                  className="ecg-trace"
                />
              </div>
            )}
            {selectedInvestigation.isTable ? (
              <table>
                <tbody>
                  {selectedInvestigation.result
                    .split("\n")
                    .map((line, index) => {
                      const columns = line.split(": ");
                      return (
                        <tr key={index}>
                          {columns.map((column, colIndex) => (
                            <td key={colIndex}>{column}</td>
                          ))}
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            ) : (
              selectedInvestigation.name !== "ECG" && (
                <p>
                  {selectedInvestigation.result
                    .split("\n")
                    .map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                </p>
              )
            )}
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
