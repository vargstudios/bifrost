// Usage: array.filter(unique)
export function unique<T>(value: T, index: number, array: T[]): boolean {
  return array.indexOf(value) === index;
}

// Usage: array.every(isConsecutive)
export function isConsecutive(
  value: number,
  index: number,
  array: number[]
): boolean {
  return index < 1 || array[index - 1] + 1 === value;
}

// https://stackoverflow.com/a/12646864
export function shuffle<T>(array: T[]): T[] {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
