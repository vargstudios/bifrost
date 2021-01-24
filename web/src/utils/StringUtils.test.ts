import { describe, it } from "mocha";
import { expect } from "chai";
import { commonPrefix, commonSuffix, reverse } from "./StringUtils";

describe("commonSuffix", () => {
  it("returns empty string when no strings", () => {
    expect(commonSuffix([])).to.equal("");
  });
  it("returns full string when one string", () => {
    expect(commonSuffix(["Test"])).to.equal("Test");
  });
  it("returns common when multiple strings", () => {
    expect(commonSuffix(["Crocodile", "Beetle"])).to.equal("le");
  });
  it("returns common when many strings", () => {
    expect(commonSuffix(["Nyancat", "Longcat", "Hovercat"])).to.equal("cat");
  });
});

describe("commonPrefix", () => {
  it("returns empty string when no strings", () => {
    expect(commonPrefix([])).to.equal("");
  });
  it("returns full string when one string", () => {
    expect(commonPrefix(["Test"])).to.equal("Test");
  });
  it("returns common when multiple strings", () => {
    expect(commonPrefix(["Milo", "Mila"])).to.equal("Mil");
  });
  it("returns common when many strings", () => {
    expect(commonPrefix(["Alpha", "Alphabet", "Alpine", "Alf"])).to.equal("Al");
  });
});

describe("reverse", () => {
  it("reverses abc", () => {
    expect(reverse("abc")).to.equal("cba");
  });
  it("reverses onomatopoeia", () => {
    expect(reverse("onomatopoeia")).to.equal("aieopotamono");
  });
});
