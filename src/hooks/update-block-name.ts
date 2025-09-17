import type { FieldHook } from 'payload';

export const updateBlockName: FieldHook = async ({ value, blockData }) => {
  if (blockData && typeof value === 'string') {
    const title = value.trim();

    blockData.blockName = title.length > 0 ? title : undefined;
  }

  return value;
};
