// TODO
import { ExrAnalysis } from "../../api/analysis";

export type State =
  | SelectFiles
  | Analysing
  | AnalysisError
  | SetProperties
  | Creating
  | Importing
  | ImportError
  | Success;

type SelectFiles = {
  type: "SelectFiles";
};

type Analysing = {
  type: "Analysing";
  files: File[];
};

type AnalysisError = {
  type: "AnalysisError";
  files: File[];
  error: string;
};

type SetProperties = {
  type: "SetProperties";
  files: File[];
  analysis: ExrAnalysis;
  name: string;
  categoryId: string;
};

type Creating = {
  type: "Creating";
  files: File[];
  analysis: ExrAnalysis;
  name: string;
  categoryId: string;
  elementId: string;
};

type Importing = {
  type: "Importing";
  files: File[];
  analysis: ExrAnalysis;
  name: string;
  categoryId: string;
  currentFrame: number;
};

type ImportError = {
  type: "ImportError";
  files: File[];
  analysis: ExrAnalysis;
  name: string;
  categoryId: string;
  error: string;
};

type Success = {
  type: "Success";
  name: string;
  elementId: string;
};

export type Action = SetFiles;

type SetFiles = {
  type: "SetFiles";
  files: File[];
};

type SetAnalysis = {
  type: "SetAnalysis";
  result: Result<ExrAnalysis, string>;
};

// Helpers

export type Result<Value, Error> = Ok<Value> | Err<Error>;

type Ok<Value> = {
  type: "Ok";
  value: Value;
};

type Err<Error> = {
  type: "Err";
  error: Error;
};

export type Maybe<Value> = Just<Value> | Nothing;

type Just<Value> = {
  type: "Just";
  value: Value;
};

type Nothing = {
  type: "Nothing";
};
