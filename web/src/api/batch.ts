import { get, post } from "./request";
import { CreateElement } from "./elements";

export type BatchScannedElement = {
  scanId: string;
  name: string;
  framecount: number;
  width: number;
  height: number;
  framerate: number;
  channels: string;
  alpha: boolean;
};

export type BatchCreateElement = {
  scanId: string;
  categoryId: string;
  name: string;
};

export type BatchImportElementItem = {
  element: CreateElement;
  status: "PENDING" | "SUCCESS" | "FAILURE";
};

export type BatchImportElementsState =
  | Scanning
  | Scanned
  | Importing
  | Imported;

type Scanning = {
  type: "Scanning";
};

type Scanned = {
  type: "Scanned";
  scanned: BatchScannedElement[];
  time: number;
};

type Importing = {
  type: "Importing";
  scanned: BatchScannedElement[];
  items: BatchImportElementItem[];
};

type Imported = {
  type: "Imported";
  scanned: BatchScannedElement[];
  items: BatchImportElementItem[];
  time: number;
};

export function stateElements(): Promise<BatchImportElementsState> {
  return get("/api/v1/batch/import-elements/state");
}

export function scanElements(): Promise<void> {
  return post("/api/v1/batch/import-elements/scan", null);
}

export function importElements(elements: BatchCreateElement[]): Promise<void> {
  return post("/api/v1/batch/import-elements/import", elements);
}
