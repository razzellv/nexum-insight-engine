import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Facility {
  id: string;
  name: string;
  address: string | null;
  tier: string;
  max_equipment_included: number;
  sensor_enabled: boolean;
}

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

interface RegisteredEquipment {
  id: string;
  facility_id: string;
  equipment_type: string;
  brand: string | null;
  model: string | null;
  logger_module: string;
  compliance_ruleset: string;
  benchmark_defaults: {
    min_efficiency_threshold: number;
    critical_threshold: number;
    service_interval_days: number;
    inspection_frequency: string;
  };
  sensor_enabled: boolean;
}

interface EquipmentContextType {
  // Facility registry
  currentFacility: Facility | null;
  setCurrentFacility: (facility: Facility | null) => void;
  
  // Equipment data from upload
  equipmentData: EquipmentData | null;
  setEquipmentData: (data: EquipmentData | null) => void;
  
  // Registered equipment with auto-assignments
  registeredEquipment: RegisteredEquipment | null;
  setRegisteredEquipment: (equipment: RegisteredEquipment | null) => void;
  
  // Performance data
  performanceData: any | null;
  setPerformanceData: (data: any | null) => void;
  
  // AI analysis
  aiAnalysis: string | null;
  setAiAnalysis: (analysis: string | null) => void;
  
  // Processing state
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const EquipmentContext = createContext<EquipmentContextType | undefined>(undefined);

export const EquipmentProvider = ({ children }: { children: ReactNode }) => {
  const [currentFacility, setCurrentFacility] = useState<Facility | null>(null);
  const [equipmentData, setEquipmentData] = useState<EquipmentData | null>(null);
  const [registeredEquipment, setRegisteredEquipment] = useState<RegisteredEquipment | null>(null);
  const [performanceData, setPerformanceData] = useState<any | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <EquipmentContext.Provider
      value={{
        currentFacility,
        setCurrentFacility,
        equipmentData,
        setEquipmentData,
        registeredEquipment,
        setRegisteredEquipment,
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
