import * as React from "react";
import { useRef, useState } from "react";
import { baseUrl } from "../api/server";
import { Element } from "../api/elements";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs } from "@fortawesome/free-solid-svg-icons";

type Props = {
  element: Element;
};

export function ElementPreview(props: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const elementUrl = baseUrl() + `/api/v1/elements/${props.element.id}`;

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

  function preview() {
    return (
      <div className="preview" onMouseEnter={onEnter} onMouseLeave={onLeave}>
        <div
          className="image"
          style={{
            backgroundImage: `url('${elementUrl}/preview.jpg')`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
        />
        <video
          className="video"
          ref={videoRef}
          src={`${elementUrl}/preview.mp4`}
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

  function processing() {
    return (
      <div className="preview">
        <div className="center" title="Processing...">
          <FontAwesomeIcon icon={faCogs} size="2x" />
        </div>
      </div>
    );
  }

  return props.element.previews ? preview() : processing();
}
