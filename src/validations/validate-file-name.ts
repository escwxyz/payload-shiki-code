import type { TextFieldValidation } from "payload";
import { FILENAME_LENGTH } from "../utils/constants.js";
import { getLanguageAlias } from "../utils/langs.js";
import { FILENAME_EXTENSION_REGEX } from "../utils/regex.js";

export const validateFileName: TextFieldValidation = async (
  value,
  { siblingData }
) => {
  if (!value) {
    return true;
  }

  if (value.length > FILENAME_LENGTH) {
    return `File name must be less than ${FILENAME_LENGTH} characters`;
  }

  const extensionMatch = value.match(FILENAME_EXTENSION_REGEX);
  if (!extensionMatch) {
    return "File name must have an extension";
  }

  const extension = extensionMatch[0];
  // @ts-expect-error siblingData is not typed
  if (siblingData?.language) {
    // @ts-expect-error siblingData is not typed
    const alias = getLanguageAlias(siblingData.language as string);

    if (extension !== `.${alias}`) {
      return `Invalid extension: ${extension} (expected ${alias})`;
    }
  }

  return true;
};
