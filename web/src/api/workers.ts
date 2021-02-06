import { get } from "./request";

export type Worker = {
  url: string;
  state: WorkerState;
};

export type WorkerState = "NEW" | "UNREACHABLE" | "IDLE" | "WORKING";

export function listWorkers(): Promise<Worker[]> {
  return get("/api/v1/workers");
}
