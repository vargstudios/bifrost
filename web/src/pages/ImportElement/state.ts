import { ExrAnalysis } from "../../api/analysis";

export type State =
  | SelectFiles
  | Analysing
  | AnalysisError
  | DefineElement
  | Importing
  | ImportError
  | Success;

export type SelectFiles = {
  type: "SelectFiles";
};

export type Analysing = {
  type: "Analysing";
  files: File[];
};

export type AnalysisError = {
  type: "AnalysisError";
  error: string;
};

export type DefineElement = {
  type: "DefineElement";
  files: File[];
  analysis: ExrAnalysis;
  name: string;
  categoryId: string;
};

export type Importing = {
  type: "Importing";
  files: File[];
  analysis: ExrAnalysis;
  name: string;
  categoryId: string;
  currentFrame: number;
  totalFrames: number;
  startTime: number;
  currentTime: number;
};

export type ImportError = {
  type: "ImportError";
  files: File[];
  analysis: ExrAnalysis;
  name: string;
  categoryId: string;
  error: string;
};

export type Success = {
  type: "Success";
  name: string;
  elementId: string;
};
