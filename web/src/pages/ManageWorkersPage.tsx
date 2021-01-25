import * as React from "react";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ConfigSidebar } from "../components/ConfigSidebar";
import { Worker, listWorkers } from "../api/workers";

export function ManageWorkersPage(props: RouteComponentProps): JSX.Element {
  const [workers, setWorkers] = useState<Worker[]>([]);

  useEffect(() => {
    listWorkers().then(setWorkers);
  }, []);

  return (
    <div className="layout">
      <Header />
      <ConfigSidebar />
      <main className="import">
        <div className="title">MANAGE WORKERS</div>
        {workers.map((worker) => (
          <div>
            {worker.url} – {worker.state}
          </div>
        ))}
      </main>
      <Footer />
    </div>
  );
}
