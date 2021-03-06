import { Element } from "../../api/elements";

export type State = Loading | Details | Edit | Delete | Failed;

export type Loading = {
  type: "Loading";
};

export type Details = {
  type: "Details";
  element: Element;
};

export type Edit = {
  type: "Edit";
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
