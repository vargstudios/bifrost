import { ExrAnalysis } from "../../api/analysis";
import { ElementCategory } from "../../api/element-categories";

export type State =
  | Loading
  | LoadingError
  | SelectFiles
  | Analysing
  | AnalysisError
  | DefineElement
  | Importing
  | ImportError
  | Success;

export type Loading = {
  type: "Loading";
};

export type LoadingError = {
  type: "LoadingError";
  error: string;
};

export type SelectFiles = {
  type: "SelectFiles";
  categories: ElementCategory[];
};

export type Analysing = {
  type: "Analysing";
  categories: ElementCategory[];
  files: File[];
};

export type AnalysisError = {
  type: "AnalysisError";
  categories: ElementCategory[];
  error: string;
};

export type DefineElement = {
  type: "DefineElement";
  categories: ElementCategory[];
  files: File[];
  analysis: ExrAnalysis;
  name: string;
  categoryId: string;
};

export type Importing = {
  type: "Importing";
  categories: ElementCategory[];
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
  categories: ElementCategory[];
  files: File[];
  analysis: ExrAnalysis;
  name: string;
  categoryId: string;
  error: string;
};

export type Success = {
  type: "Success";
  categories: ElementCategory[];
  name: string;
  elementId: string;
};
