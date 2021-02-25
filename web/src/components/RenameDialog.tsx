import * as React from "react";
import { useEffect, useState } from "react";
import { Dialog } from "../nyx/Dialog";
import { TextBox } from "../nyx/TextBox";
import { Button } from "../nyx/Button";

type Props = {
  title: string;
  name: string;
  onRename: (name: string) => void;
  onCancel: () => void;
};

export function RenameDialog(props: Props): JSX.Element {
  const [name, setName] = useState(props.name);
  const id = "rename";

  useEffect(() => {
    document.getElementById(id)?.focus();
  }, []);

  return (
    <Dialog onEscape={() => props.onCancel()}>
      <div className="import">
        <div className="title">{props.title}</div>
        <TextBox id={id} label="Name" value={name} onChange={setName} />
        <div>
          <Button label="Rename" onClick={() => props.onRename(name)} />
          <Button label="Cancel" onClick={() => props.onCancel()} />
        </div>
      </div>
    </Dialog>
  );
}
