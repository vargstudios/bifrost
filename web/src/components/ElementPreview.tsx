import * as React from "react";
import { useRef, useState } from "react";
import { baseUrl } from "../api/server";
import { Element } from "../api/elements";

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
