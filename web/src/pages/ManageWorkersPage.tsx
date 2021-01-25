import * as React from "react";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ConfigSidebar } from "../components/ConfigSidebar";
import { Worker, listWorkers } from "../api/workers";
import { useInterval } from "../hooks/useInterval";

export function ManageWorkersPage(props: RouteComponentProps): JSX.Element {
  const [workers, setWorkers] = useState<Worker[]>([]);

  useEffect(() => {
    listWorkers().then(setWorkers);
  }, []);

  useInterval(() => {
    listWorkers().then(setWorkers);
  }, 1000);

  function workerTable(): JSX.Element {
    if (workers.length < 1) {
      return <></>;
    }
    return (
      <table>
        <thead>
          <tr>
            <th>Url</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody>
          {workers.map((worker) => (
            <tr key={worker.url}>
              <td>{worker.url}</td>
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
