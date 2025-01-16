import React, { useState, useEffect, useRef } from "react";
import PatientImage from "./patientComponent";
import InvestigationMenu from "./investigationComponent";
import notePad from "./assets/images/notepad.png";

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
  const [criticalCount, setCriticalCount] = useState(0);
  const [criticalRevealed, setCriticalRevealed] = useState({});
  const [isListVisible, setIsListVisible] = useState(false);
  const {investigationPoints, setInvestigationPoints } = useAppContext();
  const [heartRate, setHeartRate] = useState(parseInt(currentCase.obs.HR, 10));
  const minHR = parseInt(currentCase.obs.HR, 10) - 10;
  const maxHR = parseInt(currentCase.obs.HR, 10) + 10;

  const totalCritical = currentCase.investigations.filter(
    (inv) => inv.critical
  ).length;
  const [selectedInvestigations, setSelectedInvestigations] = useState([]);

  const imageCache = useRef(new Map());

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

      console.log("Investigation points:", investigationPoints);

      if (selected.critical) {
        setCriticalRevealed((prev) => ({
          ...prev,
          [investigationName]: true,
        }));
      }

      if (selected.critical && criticalCount < totalCritical) {
        setCriticalCount((prevCount) => prevCount + 1);

        const notepadElement = document.querySelector(".toggle-button");
        if (notepadElement) {
          notepadElement.classList.add("pulse2");
          setTimeout(() => {
            notepadElement.classList.remove("pulse2");
          }, 1000);
        }
      }
    }
  };

  useEffect(() => {
    const popup = document.querySelector(".popup-message");
    if (popup) {
      setTimeout(() => {
        popup.classList.add("fade-in");
      }, 700); // Delay before appearing (500ms)

      setTimeout(() => {
        popup.classList.remove("fade-in");
        popup.classList.add("fade-out");
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
    const container = document.querySelector(".investigate-container");
    if (container) {
      container.classList.add("slide-up");
    }
  }, []);

  useEffect(() => {
    console.log("Updated Investigation Points:", investigationPoints);
  }, [investigationPoints]);

  return (
    <div className={`investigate-container ${isModalVisible && "to-front"}`}>
      <div className="popup-message">Choose your investigations!</div>

      <PatientImage image={currentCase.patientImage} />

      <div className="obs-container">
        <p>BP: {currentCase.obs.BP}</p>
        <p>Temp: {currentCase.obs.Temp}</p>
        <p>HR: {heartRate}</p>
        <p>RR: {currentCase.obs.RR}</p>
        <p>SPO2: {currentCase.obs.SPO2}</p>
      </div>

      <div className="investigation-records-container">
        <img
          src={notePad}
          alt="Notepad"
          className="toggle-button"
          onClick={() => setIsListVisible((prev) => !prev)}
        />
        <h3>Critical Investigations</h3>
        <p
          className={
            criticalCount === totalCritical ? "highlight-animation" : ""
          }
        >
          {criticalCount} / {totalCritical}
        </p>
        {criticalCount === totalCritical && (
          <button
            className="proceed-button"
            onClick={() => {
              const investigateContainer = document.querySelector(
                ".investigate-container"
              );
              if (investigateContainer) {
                investigateContainer.style.animation = "none";
                void investigateContainer.offsetWidth;
                investigateContainer.style.animation =
                  "slideDown 1s ease-in forwards";
              }

              document
                .querySelector(".investigate-container")
                .classList.add("slide-down");

              setTimeout(() => {
                setCurrentStage(STAGE_DIAGNOSIS);
              }, 1000);
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

      <InvestigationMenu
        selectedSpecialty={selectedSpecialty}
        investigations={currentCase.investigations.map((inv) => inv.name)}
        onInvestigationClick={handleInvestigationClick}
      />

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
