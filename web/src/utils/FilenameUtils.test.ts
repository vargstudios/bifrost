import { describe, it } from "mocha";
import { expect } from "chai";
import { parseFilename } from "./FilenameUtils";

describe("parseFilename", () => {
  it("returns null when invalid format", () => {
    expect(parseFilename("")).to.be.null;
  });
  it("handles sequence after hyphen", () => {
    expect(parseFilename("Fire-003.exr")).to.eql({
      name: "Fire",
      sequence: 3,
      extension: "exr",
    });
  });
  it("handles sequence after underscore", () => {
    expect(parseFilename("Bloody_Axe_0017.exr")).to.eql({
      name: "Bloody_Axe",
      sequence: 17,
      extension: "exr",
    });
  });
  it("handles sequence after dot", () => {
    expect(parseFilename("Water-Droplets.01017.jpg")).to.eql({
      name: "Water-Droplets",
      sequence: 1017,
      extension: "jpg",
    });
  });
});
