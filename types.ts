export enum AppPhase {
  GATE = 'GATE',         // The Warning/Truth Protocol
  INPUT = 'INPUT',       // Initial Dilemma Input
  PROCESSING_1 = 'PROC1', // Generating Questions
  QUESTIONS = 'QUESTIONS', // Socratic Questioning
  PROCESSING_2 = 'PROC2', // Analyzing Answers
  CLARITY = 'CLARITY'    // Final Verdict
}

export interface Question {
  id: number;
  text: string;
  answer: string;
}

export interface AnalysisResult {
  coreTruth: string;
  blindSpot: string;
  actionableStep: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  targetX: number;
  targetY: number;
}
