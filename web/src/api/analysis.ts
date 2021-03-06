import { request } from "./request";

export type ExrAnalysis = {
  width: number;
  height: number;
  framerate: number;
  channels: string;
  alpha: boolean;
};

export function analyseExr(exr: Blob): Promise<ExrAnalysis> {
  return request("/api/v1/analysis/exr", {
    method: "POST",
    headers: {
      "Content-Type": "image/x-exr",
    },
    body: exr,
  });
}
