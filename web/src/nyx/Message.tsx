import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationCircle,
  faExclamationTriangle,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./Message.scss";

type Props = {
  type: "error" | "warn" | "info" | "success";
  text: string;
};

export function Message(props: Props): JSX.Element {
  function icon() {
    switch (props.type) {
      case "error":
        return faExclamationCircle;
      case "warn":
        return faExclamationTriangle;
      case "info":
        return faInfoCircle;
      case "success":
        return faCheckCircle;
    }
  }

  return (
    <div className={`nyx message ${props.type}`}>
      <FontAwesomeIcon icon={icon()} />
      <span className="text">{props.text}</span>
    </div>
  );
}
