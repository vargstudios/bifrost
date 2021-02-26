// Based on https://zellwk.com/blog/keyboard-focusable-elements/
export function getFocusableChildren(parent: HTMLElement): HTMLElement[] {
  const elements: HTMLElement[] = Array.from(
    parent.querySelectorAll(
      'a, button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])'
    )
  );
  return elements.filter((el) => !el.hasAttribute("disabled"));
}
