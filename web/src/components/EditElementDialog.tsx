import * as React from "react";
import { useEffect, useState } from "react";
import { Dialog } from "../nyx/Dialog";
import { TextBox } from "../nyx/TextBox";
import { Button } from "../nyx/Button";
import { Element, updateElement } from "../api/elements";
import { SelectBox } from "../nyx/SelectBox";
import { listCategories } from "../api/element-categories";
import { Error } from "../api/error";

type Props = {
  element: Element;
  onSaved: () => void;
  onCancel: () => void;
};

export function EditElementDialog(props: Props): JSX.Element {
  const [name, setName] = useState(props.element.name);
  const [categoryId, setCategoryId] = useState(props.element.category.id);
  const [categories, setCategories] = useState([props.element.category]);

  useEffect(load, []);

  function load() {
    listCategories()
      .then(setCategories)
      .catch((error: Error) => alert("Load error: " + error.details));
  }

  function save() {
    updateElement(props.element.id, {
      name: name,
      categoryId: categoryId,
    })
      .then(props.onSaved)
      .catch((error: Error) => alert("Save error: " + error.details));
  }

  return (
    <Dialog onDismiss={props.onCancel}>
      <div className="import">
        <div className="title">EDIT ELEMENT</div>
        <TextBox id="name" label="Name" value={name} onChange={setName} />
        <SelectBox
          id="category"
          label="Category"
          options={categories.map((category) => ({
            value: category.id,
            name: category.name,
          }))}
          value={categoryId}
          onChange={setCategoryId}
        />
        <div>
          <Button label="Save" onClick={save} />
          <Button label="Cancel" onClick={props.onCancel} />
        </div>
      </div>
    </Dialog>
  );
}
