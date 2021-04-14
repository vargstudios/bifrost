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
import { Error } from "../api/error";
import { baseUrl } from "../api/server";
import { TextArea } from "../nyx/TextArea";
import { Link } from "../nyx/Link";
import { Layout } from "../components/Layout";
import { Column } from "../nyx/Column";
import { CheckBox } from "../nyx/CheckBox";
import { Table } from "../nyx/Table";

export function ManageWorkersPage(): JSX.Element {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [workerCmd, setWorkerCmd] = useState(
    "docker run \\\n" +
      "  --detach \\\n" +
      "  --restart always \\\n" +
      "  --memory 480m \\\n" +
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
      .catch((error: Error) =>
        alert("Failed to list workers: " + error.details)
      );
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
      <Table
        head={
          <tr>
            <th title="Enabled">Enbl</th>
            <th>Name</th>
            <th>Address</th>
            <th>Port</th>
            <th>State</th>
          </tr>
        }
        body={workers
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((worker) => (
            <tr key={worker.id}>
              <td>
                <CheckBox
                  value={worker.enabled}
                  onChange={(enabled) =>
                    enabled
                      ? onEnableClicked(worker.id)
                      : onDisableClicked(worker.id)
                  }
                />
              </td>
              <td>{worker.name}</td>
              <td>{worker.ip}</td>
              <td>{worker.port}</td>
              <td>{worker.state}</td>
            </tr>
          ))}
      />
    );
  }

  return (
    <Layout>
      <Header />
      <ConfigSidebar />
      <main className="mainlayout">
        <Column>
          <h2>ADD WORKER</h2>
          <p>Run the following command to start a worker with docker:</p>
          <TextArea
            columns={16}
            lines={8}
            value={workerCmd}
            onChange={setWorkerCmd}
          />
          <p>
            Alternatively,{" "}
            <Link
              href="https://github.com/vargstudios/bifrost/releases"
              text="download the Windows version from GitHub"
            />
          </p>
          <h2>MANAGE WORKERS</h2>
          {workerTable()}
        </Column>
      </main>
      <Footer />
    </Layout>
  );
}
