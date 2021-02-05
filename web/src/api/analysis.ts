import { baseUrl } from "./server";

export type ExrAnalysis = {
  width: number;
  height: number;
  framerate: number;
  channels: string;
  linear: boolean;
  alpha: boolean;
};

export function analyseExr(exr: Blob): Promise<ExrAnalysis> {
  return fetch(baseUrl() + "/api/v1/analysis/exr", {
    method: "POST",
    body: exr,
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Unexpected status");
    }
    return response.json();
  });
}
