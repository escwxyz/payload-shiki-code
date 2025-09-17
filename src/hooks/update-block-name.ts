import type { FieldHook } from "payload";

export const updateBlockName: FieldHook = async ({ value, blockData }) => {
  if (typeof value === "string" && value.trim().length > 0) {
    const fileName = value.trim();

    if (blockData) {
      blockData.blockName = fileName;
    }
  }

  return value;
};
