import * as React from "react";
import { useEffect, useState } from "react";
import { shuffle } from "../utils/ArrayUtils";

export function Footer(): JSX.Element {
  const [index, setIndex] = useState(0);

  const [made, setMade] = useState([
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
  ]);

  const [love, setLove] = useState([
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
  ]);

  const [varg, setVarg] = useState([
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
  ]);

  useEffect(shuffleAll, []);

  function shuffleAll() {
    setMade(shuffle(made));
    setLove(shuffle(love));
    setVarg(shuffle(varg));
  }

  function nextTitle() {
    if (index < 9) {
      setIndex(index + 1);
    } else {
      shuffleAll();
      setIndex(0);
    }
  }

  return (
    <footer>
      <span
        title={made[index] + " with " + love[index] + " by " + varg[index]}
        onMouseEnter={nextTitle}
      >
        Made with ♥ by VARG Studios
      </span>
    </footer>
  );
}
