import * as React from "react";
import { useState } from "react";

export function Footer(): JSX.Element {
  const [title, setTitle] = useState("");

  const made = [
    "Assembled",
    "Crafted",
    "Manufactured",
    "Built",
    "Fabricated",
    "Produced",
    "Shaped",
    "Forged",
    "Constructed",
    "Glued together",
  ];

  const love = [
    "blood, sweat and tears",
    "machine learning",
    "science",
    "no effort",
    "arcane arts",
    "duct tape",
    "red tape",
    "cloud computing",
    "blockchain technology",
    "blissful ignorance",
    "copy and paste",
    "drag and drop",
  ];

  const varg = [
    "a roommate",
    "a flatmate",
    "yours truly",
    "an artificial intelligence",
    "the one who must not be named",
    "bezzerwizzers",
    "code ninjas",
    "underpaid workers",
    "chaos monkeys",
    "aliens",
    "toddlers",
    "[redacted]",
  ];

  function randomItem(items: string[]): string {
    const index = Math.floor(Math.random() * items.length);
    return items[index];
  }

  function randomTitle(): string {
    return (
      randomItem(made) + " with " + randomItem(love) + " by " + randomItem(varg)
    );
  }

  return (
    <footer>
      <span title={title} onMouseEnter={() => setTitle(randomTitle())}>
        Made with ♥ by VARG Studios
      </span>
    </footer>
  );
}
