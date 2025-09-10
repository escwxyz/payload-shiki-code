import type { FieldHook } from "payload";

export const trimCode: FieldHook = async ({ value }) => {
  if (typeof value === "string") {
    const lines = value.split("\n");

    let startIndex = 0;
    while (startIndex < lines.length && lines[startIndex].trim() === "") {
      startIndex++;
    }

    let endIndex = lines.length - 1;
    while (endIndex >= 0 && lines[endIndex].trim() === "") {
      endIndex--;
    }

    if (startIndex <= endIndex) {
      return lines.slice(startIndex, endIndex + 1).join("\n");
    }

    return value;
  }
  return value;
};
