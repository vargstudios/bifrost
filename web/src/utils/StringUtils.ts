export function commonSuffix(strings: string[]): string {
  return reverse(commonPrefix(strings.map(reverse)));
}

export function commonPrefix(strings: string[]): string {
  if (strings.length < 1) {
    return "";
  }
  // Sort alphabetically, then compare first and last
  const sorted = strings.sort();
  return commonPrefix2(sorted[0], sorted[sorted.length - 1]);
}

function commonPrefix2(a: string, b: string): string {
  const maxlength = Math.min(a.length, b.length);

  for (let i = 0; i < maxlength; i++) {
    if (a[i] !== b[i]) {
      return a.slice(0, i);
    }
  }

  return a.slice(0, maxlength);
}

export function reverse(s: string): string {
  return s.split("").reverse().join("");
}
