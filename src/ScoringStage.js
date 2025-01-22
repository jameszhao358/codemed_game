import React, { useEffect, useRef } from "react";
import {STAGE_INVESTIGATION, useAppContext} from "./context/appContext";

function animationCounter(start, target, elementRef) {
    let current = start;
    const increment = (target - start) / 60; 

    function step() {
        current += increment;
        if (current >= target) {
            current = target; 
            if (elementRef.current) elementRef.current.textContent = Math.round(current);
            return;
        }
        if (elementRef.current) {
            elementRef.current.textContent = Math.round(current);
        }
        requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

function ScoringStage({setCaseID, setCurrentStage }) {
    const {
        investigationPoints,
        setInvestigationPoints,
        diagnosisPoints,
        setDiagnosisPoints,
        totalPoints,
        setTotalPoints,
        overallScore,
        setOverallScore,
        getFilteredCasesBySpecialty,
        selectedSpecialty,
        caseID,
        setTransitionToDiagnosis,
        setTransitionToScoring
    } = useAppContext();
    
    const totalInvestigationPoints = investigationPoints.reduce((sum, entry) => sum + entry.points, 0);
    const totalDiagnosisPoints = diagnosisPoints.filter((points) => points > 0).length * 100;
    const totalEarned = totalInvestigationPoints + totalDiagnosisPoints;

    const totalPointsEarnedRef = useRef(null); 
    const overallScoreRef = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            animationCounter(0, totalEarned, totalPointsEarnedRef);
        }, 600);

        setTimeout(() => {
            animationCounter(totalPoints, totalPoints + totalEarned, overallScoreRef);
        }, 900);
    }, [totalEarned, totalPoints]);
  
    const proceedToNextCase = () => {
        const filteredCases = getFilteredCasesBySpecialty(selectedSpecialty);
        const currentIndex = filteredCases.findIndex((c) => c.id === caseID);
        const nextIndex = (currentIndex + 1) % filteredCases.length;
        const nextCaseID = filteredCases[nextIndex].id;
        
        setTotalPoints((prev) => prev + totalInvestigationPoints + totalDiagnosisPoints);
        setOverallScore(overallScore + totalEarned);
        setInvestigationPoints([
            { category: "critical", points: 0 },
            { category: "ancillary", points: 0 },
            { category: "unnecessary", points: 0 },
          ]);
        setDiagnosisPoints([]); // Reset via context
        setCaseID(nextCaseID);
        setTransitionToDiagnosis(false);
        setTransitionToScoring(false);
        setCurrentStage(STAGE_INVESTIGATION); // Transition to next stage
    };
  
    return (
        <div className="scoring-stage">

            <h3>Investigations</h3>

            <div className="scoring-table1">
                {investigationPoints.map((entry, index) => (
                <div className="row" key={index}>
                    <div className="category">{entry.category.charAt(0).toUpperCase() + entry.category.slice(1)}</div>
                    <div className="points">{entry.points >= 0 ? "+" : ""}{entry.points}</div>
                </div>
                ))}
            </div>

            <h4>Questions</h4>

            <div className="scoring-table2">
                <div className="row">
                    <div className="category">
                        {`${diagnosisPoints.filter((points) => points > 0).length}/${diagnosisPoints.length} correct`}
                    </div>
                    <div className="points">
                    {`+${totalDiagnosisPoints}`}
                    </div>
                </div>
                <div className="row-total1">
                    <div className="category">Total points earned:</div>
                    <div className="points" ref={totalPointsEarnedRef}>+0</div>
                </div>
                <div className="row-total2">
                <div className="category">Overall Score:</div>
                <div className="points" ref={overallScoreRef}>{totalPoints}</div>
                </div>
            </div>
          <button className="next-case-button" onClick={proceedToNextCase}>Next Case</button>
        </div>
      );
  }
  
  export default ScoringStage;