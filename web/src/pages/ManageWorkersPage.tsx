import * as React from "react";
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ConfigSidebar } from "../components/ConfigSidebar";
import {
  disableWorker,
  enableWorker,
  listWorkers,
  Worker,
} from "../api/workers";
import { useInterval } from "../hooks/useInterval";
import { IconButton } from "../components/IconButton";
import { faCheckSquare, faSquare } from "@fortawesome/free-regular-svg-icons";
import { Error } from "../api/error";

export function ManageWorkersPage(): JSX.Element {
  const [workers, setWorkers] = useState<Worker[]>([]);

  useEffect(updateWorkers, []);
  useInterval(updateWorkers, 1000);

  function updateWorkers(): void {
    listWorkers()
      .then(setWorkers)
      .catch(() => alert("Failed to list workers")); // TODO
  }

  function onEnableClicked(id: string): void {
    enableWorker(id)
      .then(updateWorkers)
      .catch((error: Error) =>
        alert("Error enabling worker: " + error.details)
      );
  }

  function onDisableClicked(id: string): void {
    disableWorker(id)
      .then(updateWorkers)
      .catch((error: Error) =>
        alert("Error disabling worker: " + error.details)
      );
  }

  function workerTable(): JSX.Element {
    if (workers.length < 1) {
      return <div>No workers</div>;
    }
    return (
      <table>
        <thead>
          <tr>
            <th>Enbl</th>
            <th>Name</th>
            <th>Address</th>
            <th>Port</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody>
          {workers
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((worker) => (
              <tr key={worker.id}>
                <td>
                  {worker.enabled ? (
                    <IconButton
                      size="small"
                      title="Disable"
                      icon={faCheckSquare}
                      onClick={() => onDisableClicked(worker.id)}
                    />
                  ) : (
                    <IconButton
                      size="small"
                      title="Enable"
                      icon={faSquare}
                      onClick={() => onEnableClicked(worker.id)}
                    />
                  )}
                </td>
                <td>{worker.name}</td>
                <td>{worker.ip}</td>
                <td>{worker.port}</td>
                <td>{worker.state}</td>
              </tr>
            ))}
        </tbody>
      </table>
    );
  }

  return (
    <div className="layout">
      <Header />
      <ConfigSidebar />
      <main className="import">
        <div className="title">MANAGE WORKERS</div>
        {workerTable()}
      </main>
      <Footer />
    </div>
  );
}
