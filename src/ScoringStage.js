import React, { useEffect, useRef } from "react";
import caseData from './cases.json';

function animationCounter(start, target, elementRef) {
    let current = start;
    const increment = (target - start) / 60; // Fixed 1-second animation at ~60fps

    function step() {
        current += increment;
        if (current >= target) {
            current = target; // Ensure the value stops exactly at the target
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

function ScoringStage({ investigationPoints = [], diagnosisPoints = [], totalPoints, setTotalPoints, currentCase, overallScore, setOverallScore, setCaseID, setCurrentStage }) {
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
      setTotalPoints((prev) => prev + totalInvestigationPoints + totalDiagnosisPoints);
      setCaseID((currentCase.id % caseData.cases.length) + 1);
      setOverallScore(overallScore + totalEarned);
      setCurrentStage({
        stage: "investigation",
        investigationPoints: [], // Reset for the next case
        diagnosisPoints: [],
      });
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