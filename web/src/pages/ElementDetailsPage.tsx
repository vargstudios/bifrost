import * as React from "react";
import { useEffect, useState } from "react";
import { Element, ElementVersion, getElement } from "../api/elements";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { NavLink, useParams } from "react-router-dom";
import { ElementPreview } from "../components/ElementPreview";
import { IconButton } from "../components/IconButton";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { copyToClipboard } from "../utils/ClipboardUtils";

export function ElementDetailsPage(): JSX.Element {
  const [element, setElement] = useState<Element | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    getElement(id)
      .then(setElement)
      .catch(() => alert("Failed to get element")); // TODO
  }, []);

  function renderElement(element: Element): JSX.Element {
    return (
      <>
        <div className="title">{element.name}</div>
        <ElementPreview element={element} />
        <div className="details">
          {element.framecount} Frames, {element.framerate} FPS,{" "}
          {element.channels}
        </div>
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
            <th />
          </tr>
        </thead>
        <tbody>
          {versions.map((version) => (
            <tr key={version.id}>
              <td>{version.name}</td>
              <td>{version.width}</td>
              <td>{version.height}</td>
              <td>{version.url}</td>
              <td>
                <IconButton
                  size="small"
                  title="Copy"
                  icon={faCopy}
                  onClick={() => copyToClipboard(version.url)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div className="layout">
      <Header />
      <aside className="sidebar">
        <div className="heading">ELEMENT</div>
        <NavLink to={`/elements/${id}`}>Details</NavLink>
      </aside>
      <main className="element-details">
        {element ? renderElement(element) : "Not found"}
      </main>
      <Footer />
    </div>
  );
}
