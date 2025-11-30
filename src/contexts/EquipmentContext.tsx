import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EquipmentData {
  Equipment_Type: string;
  Brand: string;
  RPM: number;
  HP: number;
  Voltage: number;
  Displacement: number;
  GPM?: number;
  Efficiency_Score?: number;
  Condition?: string;
  Suggested_Actions?: string[];
  Next_Service?: string;
  Timestamp?: string;
  Uploaded_By?: string;
}

interface EquipmentContextType {
  equipmentData: EquipmentData | null;
  setEquipmentData: (data: EquipmentData | null) => void;
  performanceData: any | null;
  setPerformanceData: (data: any | null) => void;
  aiAnalysis: string | null;
  setAiAnalysis: (analysis: string | null) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const EquipmentContext = createContext<EquipmentContextType | undefined>(undefined);

export const EquipmentProvider = ({ children }: { children: ReactNode }) => {
  const [equipmentData, setEquipmentData] = useState<EquipmentData | null>(null);
  const [performanceData, setPerformanceData] = useState<any | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <EquipmentContext.Provider
      value={{
        equipmentData,
        setEquipmentData,
        performanceData,
        setPerformanceData,
        aiAnalysis,
        setAiAnalysis,
        isProcessing,
        setIsProcessing,
      }}
    >
      {children}
    </EquipmentContext.Provider>
  );
};

export const useEquipment = () => {
  const context = useContext(EquipmentContext);
  if (!context) {
    throw new Error('useEquipment must be used within EquipmentProvider');
  }
  return context;
};
