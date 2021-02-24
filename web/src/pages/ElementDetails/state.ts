import { Element } from "../../api/elements";

export type State = Loading | Details | Rename | Failed;

export type Loading = {
  type: "Loading";
};

export type Details = {
  type: "Details";
  element: Element;
};

export type Rename = {
  type: "Rename";
  element: Element;
};

export type Failed = {
  type: "Failed";
  error: string;
};
