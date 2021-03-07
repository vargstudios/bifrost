import * as React from "react";
import { CSSProperties, useRef, useState } from "react";
import { baseUrl } from "../api/server";
import { Element } from "../api/elements";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs } from "@fortawesome/free-solid-svg-icons";
import { useInterval } from "../hooks/useInterval";
import "./ElementPreview.scss";

type Props = {
  resize?: boolean;
  element: Element;
};

export function ElementPreview(props: Props): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const elementUrl = baseUrl() + `/api/v1/elements/${props.element.id}`;

  useInterval(updateProgress, playing ? 50 : 10_000);

  function updateProgress(): void {
    const video = videoRef.current;
    const lookahead = 0.2; // Compensate for interval and animation delay
    if (!video || !playing) {
      setProgress(0);
    } else {
      setProgress((video.currentTime + lookahead) / video.duration);
    }
  }

  function onEnter(): void {
    if (!videoRef.current) {
      return;
    }
    videoRef.current.currentTime = 0;
    videoRef.current
      .play()
      .then(() => setPlaying(true))
      .catch((e) => console.log("Play", e));
  }

  function onLeave(): void {
    videoRef.current?.pause();
    setPlaying(false);
    setProgress(0);
  }

  function customStyle(): CSSProperties {
    if (!props.resize) {
      return {};
    }
    // FIXME: Assumes second is preview
    const previewVersion = props.element.versions[1];
    return {
      width: previewVersion.width + "px",
      height: previewVersion.height + "px",
    };
  }

  function preview(): JSX.Element {
    return (
      <div
        className="preview"
        style={customStyle()}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
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

  function processing(): JSX.Element {
    return (
      <div className="preview" style={customStyle()}>
        <div className="center" title="Processing...">
          <FontAwesomeIcon icon={faCogs} size="2x" />
        </div>
      </div>
    );
  }

  return props.element.previews ? preview() : processing();
}
