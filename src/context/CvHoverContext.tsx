import React, { createContext, useContext, useState, useMemo } from 'react';
import { cvData } from '../data/cvData';

interface CvHoverContextType {
  hoveredJobId: string | null;
  setHoveredJobId: (id: string | null) => void;
  hoveredSkill: string | null;
  setHoveredSkill: (skill: string | null) => void;
  activeSkills: string[];
  isSkillHighlighted: (skill: string) => boolean;
  isJobHighlighted: (jobId: string) => boolean;
}

const CvHoverContext = createContext<CvHoverContextType | undefined>(undefined);

export const CvHoverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hoveredJobId, setHoveredJobId] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const activeSkills = useMemo(() => {
    if (hoveredSkill) return [hoveredSkill];
    if (!hoveredJobId) return [];
    const pos = cvData.experience.positions.find((p) => p.id === hoveredJobId);
    return pos?.skills || [];
  }, [hoveredJobId, hoveredSkill]);

  const isSkillHighlighted = (skill: string) => {
    return activeSkills.includes(skill);
  };

  const isJobHighlighted = (jobId: string) => {
    if (hoveredJobId === jobId) return true;
    if (hoveredSkill) {
      const pos = cvData.experience.positions.find((p) => p.id === jobId);
      return Boolean(pos?.skills?.includes(hoveredSkill));
    }
    return false;
  };

  return (
    <CvHoverContext.Provider
      value={{
        hoveredJobId,
        setHoveredJobId,
        hoveredSkill,
        setHoveredSkill,
        activeSkills,
        isSkillHighlighted,
        isJobHighlighted,
      }}
    >
      {children}
    </CvHoverContext.Provider>
  );
};

export const useCvHover = () => {
  const context = useContext(CvHoverContext);
  if (!context) {
    throw new Error('useCvHover must be used within a CvHoverProvider');
  }
  return context;
};

