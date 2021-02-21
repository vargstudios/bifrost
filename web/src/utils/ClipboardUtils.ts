// Based on https://stackoverflow.com/a/30810322
export function copyToClipboard(text: string) {
  const textArea = document.createElement("textarea");

  // Place in the top-left corner of screen regardless of scroll position.
  textArea.style.position = "fixed";
  textArea.style.top = "0";
  textArea.style.left = "0";

  // Make invisible
  textArea.style.opacity = "0";

  textArea.value = text;

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand("copy");
  } catch (e) {
    console.log("Copy failed");
  }

  document.body.removeChild(textArea);
}
