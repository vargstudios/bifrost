import { get, post } from "./request";

export type Worker = {
  id: string;
  url: string;
  ip: string;
  port: number;
  name: string;
  enabled: boolean;
  state: WorkerState;
};

export type WorkerState = "NEW" | "UNREACHABLE" | "IDLE" | "WORKING";

export function listWorkers(): Promise<Worker[]> {
  return get("/api/v1/workers");
}

export function enableWorker(id: string): Promise<void> {
  return post("/api/v1/workers/" + id + "/enable", null);
}

export function disableWorker(id: string): Promise<void> {
  return post("/api/v1/workers/" + id + "/disable", null);
}
