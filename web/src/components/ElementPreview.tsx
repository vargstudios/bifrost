import * as React from "react";
import { useRef, useState } from "react";
import { baseUrl } from "../api/server";
import { Element } from "../api/elements";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs } from "@fortawesome/free-solid-svg-icons";
import { useInterval } from "../hooks/useInterval";

type Props = {
  element: Element;
};

export function ElementPreview(props: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const elementUrl = baseUrl() + `/api/v1/elements/${props.element.id}`;

  useInterval(
    () => {
      if (playing && videoRef.current) {
        setProgress(videoRef.current.currentTime / videoRef.current.duration);
      } else {
        setProgress(0);
      }
    },
    playing ? 50 : 1000
  );

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
    setProgress(0);
  }

  function preview() {
    return (
      <div className="preview" onMouseEnter={onEnter} onMouseLeave={onLeave}>
        <div
          style={{
            backgroundImage: `url('${elementUrl}/preview.jpg')`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
        />
        <video
          ref={videoRef}
          src={`${elementUrl}/preview.mp4`}
          muted
          width="100%"
          height="100%"
          preload="none"
          style={{ display: playing ? "block" : "none" }}
        />
        <div
          className="progress"
          style={{ display: playing ? "block" : "none" }}
        >
          <div className="bar" style={{ width: progress * 100 + "%" }} />
        </div>
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
