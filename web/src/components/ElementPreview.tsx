import * as React from "react";
import { useRef, useState } from "react";
import { baseUrl } from "../api/server";
import { Element } from "../api/elements";
import { faCogs } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  element: Element;
};

export function ElementPreview(props: Props): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const element = props.element;
  const elementUrl = baseUrl() + `/api/v1/elements/${element.id}`;

  function onEnter() {
    if (!videoRef.current) {
      return;
    }
    videoRef.current.currentTime = 0;
    videoRef.current
      .play()
      .then(() => setPlaying(true))
      .catch((e) => console.log("Play", e));
  }

  function onLeave() {
    videoRef.current?.pause();
    setPlaying(false);
  }

  // TODO
  function size(element: Element): string {
    const width = element.versions
      .map((version) => version.width)
      .reduce((prev, curr) => Math.max(prev, curr), 0);
    const height = element.versions
      .map((version) => version.height)
      .reduce((prev, curr) => Math.max(prev, curr), 0);
    return `${width}x${height}`;
  }

  function processing() {
    return (
      <div className="preview">
        <div className="center" title="Processing...">
          <FontAwesomeIcon icon={faCogs} size="2x" />
        </div>
      </div>
    );
  }

  function preview() {
    return (
      <div className="preview" onMouseEnter={onEnter} onMouseLeave={onLeave}>
        <div
          className="image"
          style={{
            backgroundImage: `url('${elementUrl}/previews/image')`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
        />
        <video
          className="video"
          ref={videoRef}
          src={`${elementUrl}/previews/video`}
          loop
          muted
          width="100%"
          height="100%"
          preload="none"
          style={{ display: playing ? "block" : "none" }}
        />
      </div>
    );
  }

  return (
    <div className="element">
      <div className="title">{element.name}</div>
      {element.previews ? preview() : processing()}
      <div className="details">
        {element.framecount} Frames, {element.framerate} FPS
        {element.alpha ? ", Alpha" : ""}
      </div>
    </div>
  );
}
