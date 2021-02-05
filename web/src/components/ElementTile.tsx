import * as React from "react";
import { Element } from "../api/elements";
import { ElementPreview } from "./ElementPreview";
import { Link } from "react-router-dom";

type Props = {
  element: Element;
};

export function ElementTile(props: Props): JSX.Element {
  const element = props.element;

  return (
    <Link to={"/elements/" + element.id} className="element">
      <div className="title">{element.name}</div>
      <ElementPreview element={element} />
      <div className="details">
        {element.framecount} Frames, {element.framerate} FPS,{" "}
        {element.alpha ? "RGBA" : "RGB"}
      </div>
    </Link>
  );
}
