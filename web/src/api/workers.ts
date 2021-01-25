import { baseUrl } from "./server";

export type Worker = {
  url: string;
  state: WorkerState;
};

export type WorkerState = "NEW" | "UNREACHABLE" | "IDLE" | "WORKING";

export function listWorkers(): Promise<Worker[]> {
  return fetch(baseUrl() + "/api/v1/workers", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Unexpected status");
    }
    return response.json();
  });
}
