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
  const [investigationPoints, setInvestigationPoints] = useState([]);
  const [diagnosisPoints, setDiagnosisPoints] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [caseID, setCaseID] = useState(5);

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

  const resetStage = () => {
    setInvestigationPoints([]);
    setDiagnosisPoints([]);
    setCurrentStage(STAGE_SPECIALTY);
  };

  const contextValue = useMemo(
    () => ({
      currentStage,
      investigationPoints,
      diagnosisPoints,
      selectedSpecialty,
      caseID,
      handleSpecialty,
      setInvestigationPoints,
      setDiagnosisPoints,
      setCurrentStage,
      setCaseID,
      resetStage,
    }),
    [
      caseID,
      currentStage,
      diagnosisPoints,
      handleSpecialty,
      investigationPoints,
      selectedSpecialty,
    ]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = contextFactory(AppContext, "AppContext");

export default AppContextProvider;
