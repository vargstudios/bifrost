export function readAsBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(btoa(reader.result as string));
    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(blob);
  });
}

export function toList(files: FileList | null): File[] {
  if (!files) {
    return [];
  }

  const list = [];
  for (let i = 0; i < files.length; i++) {
    list.push(files[i]);
  }
  return list;
}

export function totalBytes(files: File[]): number {
  return files.map((file) => file.size).reduce((a, b) => a + b, 0);
}

// https://stackoverflow.com/a/18650828
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
