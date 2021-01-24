export type Filename = {
  name: string;
  sequence: number;
  extension: string;
};

export function parseFilename(filename: string): Filename | null {
  const re = /^(.+?)[._-]([0-9]+)\.([^.]+)$/;
  const match = re.exec(filename);
  if (!match) {
    return null;
  }
  return {
    name: match[1],
    sequence: parseInt(match[2]),
    extension: match[3],
  };
}
