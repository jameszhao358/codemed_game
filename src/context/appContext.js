import { useCallback, useState, useMemo, createContext } from "react";
import caseData from "../cases.json";
import contextFactory from "./contextFactory";

// CONSTANTS
export const STAGE_START = "start";
export const STAGE_SPECIALTY = "specialty";
export const STAGE_INVESTIGATION = "investigation";
export const STAGE_DIAGNOSIS = "diagnosis";
export const STAGE_SCORING = "scoring";

export const AppContext = createContext({});

const AppContextProvider = ({ children }) => {
  const [currentStage, setCurrentStage] = useState(STAGE_START);
  const [investigationPoints, setInvestigationPoints] = useState([
    { category: "critical", points: 0 },
    { category: "ancillary", points: 0 },
    { category: "unnecessary", points: 0 },
  ]);
  const [diagnosisPoints, setDiagnosisPoints] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [overallScore, setOverallScore] = useState(0);
  const [caseID, setCaseID] = useState(5);

  const [transitionToScoring, setTransitionToScoring] = useState(false);
  const [transitionToDiagnosis, setTransitionToDiagnosis] = useState(false);

  const handleSpecialty = useCallback((specialty) => {
    const filteredCases = caseData.cases.filter(
      (c) => c.specialty === specialty
    );
    if (filteredCases.length > 0) {
      setSelectedSpecialty(specialty);
      setCaseID(filteredCases[0].id);
      setCurrentStage(STAGE_INVESTIGATION);
    } else {
      alert(`No cases available yet.`);
    }
  }, []);

  const getFilteredCasesBySpecialty = useCallback((specialty) => caseData.cases.filter(c => c.specialty === specialty), []);

  const resetStage = () => {
    setInvestigationPoints([
      { category: "critical", points: 0 },
      { category: "ancillary", points: 0 },
      { category: "unnecessary", points: 0 },
    ]);
    setDiagnosisPoints([]);
    setCurrentStage(STAGE_SPECIALTY);
    setTransitionToDiagnosis(false);
    setTransitionToScoring(false);
  };

  const contextValue = useMemo(
    () => ({
      currentStage,
      investigationPoints,
      diagnosisPoints,
      selectedSpecialty,
      caseID,
      handleSpecialty,
      getFilteredCasesBySpecialty,
      setInvestigationPoints,
      setDiagnosisPoints,
      totalPoints,
      setTotalPoints,
      overallScore, 
      setOverallScore,
      setCurrentStage,
      setCaseID,
      resetStage,
      transitionToScoring, 
      setTransitionToScoring,
      transitionToDiagnosis,
      setTransitionToDiagnosis
    }),
    [
      caseID,
      currentStage,
      diagnosisPoints,
      handleSpecialty,
      investigationPoints,
      getFilteredCasesBySpecialty,
      selectedSpecialty,
      totalPoints,
      overallScore,
      transitionToDiagnosis,
      transitionToScoring
    ]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = contextFactory(AppContext, "AppContext");

export default AppContextProvider;
