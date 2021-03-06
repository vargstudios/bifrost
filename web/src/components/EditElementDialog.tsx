import * as React from "react";
import { useEffect, useState } from "react";
import { Dialog } from "../nyx/Dialog";
import { TextBox } from "../nyx/TextBox";
import { Button } from "../nyx/Button";
import { Element, updateElement } from "../api/elements";
import { SelectBox } from "../nyx/SelectBox";
import { listCategories } from "../api/element-categories";
import { Error } from "../api/error";
import { Column } from "../nyx/Column";
import { Row } from "../nyx/Row";

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
      <div className="mainlayout">
        <Column>
          <h2>EDIT ELEMENT</h2>
          <TextBox id="name" label="Name" value={name} onChange={setName} />
          <SelectBox
            id="category"
            label="Category"
            options={categories
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((category) => ({
                value: category.id,
                name: category.name,
              }))}
            value={categoryId}
            onChange={setCategoryId}
          />
          <Row>
            <Button label="Save" onClick={save} />
            <Button label="Cancel" onClick={props.onCancel} />
          </Row>
        </Column>
      </div>
    </Dialog>
  );
}
