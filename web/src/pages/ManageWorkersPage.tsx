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
import { baseUrl } from "../api/server";
import { TextArea } from "../nyx/TextArea";
import { Link } from "../nyx/Link";
import { Layout } from "../components/Layout";

export function ManageWorkersPage(): JSX.Element {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [workerCmd, setWorkerCmd] = useState(
    "docker run \\\n" +
      "  --detach \\\n" +
      "  --restart always \\\n" +
      "  --memory 320m \\\n" +
      "  --publish 3201:3201 \\\n" +
      "  --env WORKER_NAME=Unnamed \\\n" +
      "  --env SERVER_URL=" +
      baseUrl() +
      " \\\n" +
      "  vargstudios/bifrost-worker:latest"
  );

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
            <th title="Enabled">Enbl</th>
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
    <Layout>
      <Header />
      <ConfigSidebar />
      <main className="import">
        <div className="title">ADD WORKER</div>
        <div>Run the following command to start a worker with docker:</div>
        <TextArea
          columns={16}
          lines={8}
          value={workerCmd}
          onChange={setWorkerCmd}
        />
        <div>
          Alternatively,{" "}
          <Link
            href="https://github.com/vargstudios/bifrost/releases"
            text="download the Windows version from GitHub"
          />
        </div>
        <div className="title">MANAGE WORKERS</div>
        {workerTable()}
      </main>
      <Footer />
    </Layout>
  );
}
