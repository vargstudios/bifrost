import * as React from "react";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { Element, ElementVersion, getElement } from "../api/elements";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useParams } from "react-router-dom";
import { ElementPreview } from "../components/ElementPreview";
import { ElementsSidebar } from "../components/ElementsSidebar";

export function ElementDetailsPage(props: RouteComponentProps): JSX.Element {
  const [element, setElement] = useState<Element | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    getElement(id).then(setElement);
  }, []);

  function renderElement(element: Element) {
    return (
      <>
        <div className="title">{element.name}</div>
        <ElementPreview element={element} />
        {renderVersionTable(
          element.versions.filter((version) => version.name !== "Preview")
        )}
      </>
    );
  }

  function renderVersionTable(versions: ElementVersion[]): JSX.Element {
    if (versions.length < 1) {
      return <div>No versions</div>;
    }
    return (
      <table>
        <thead>
          <tr>
            <th>Version</th>
            <th>Width</th>
            <th>Height</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {versions.map((version) => (
            <tr key={version.id}>
              <td>{version.name}</td>
              <td>{version.width}</td>
              <td>{version.height}</td>
              <td>{version.url}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div className="layout">
      <Header />
      <ElementsSidebar categories={[]} />
      <main className="element-details">
        {element ? renderElement(element) : "Not found"}
      </main>
      <Footer />
    </div>
  );
}
