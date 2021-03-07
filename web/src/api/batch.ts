import { post } from "./request";

export type ScannedElement = {
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

export function scanElements(): Promise<ScannedElement[]> {
  return post("/api/v1/batch/scan-elements", null);
}

export function importElements(
  elements: BatchCreateElement[]
): Promise<ScannedElement[]> {
  return post("/api/v1/batch/import-elements", elements);
}
