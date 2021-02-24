import { Element } from "../../api/elements";

export type State = Loading | Details | Rename | Delete | Failed;

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

export type Delete = {
  type: "Delete";
  element: Element;
};

export type Failed = {
  type: "Failed";
  error: string;
};
