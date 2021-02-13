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
