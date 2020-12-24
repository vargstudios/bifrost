enum CheckResult {
  NoFiles,
  MultipleSequences,
  Ok,
}

function checkSelectedFiles(files: File[]): string | null {
  if (files.length === 0) {
    return "No files selected";
  }
  return "Multiple sequences";
}
