import type { TextFieldManyValidation } from "payload";
import {
  NOTATION_RANGE_REGEX,
  NOTATION_SINGLE_NUMBER_REGEX,
} from "../utils/regex.js";

export const validateNotationRange: TextFieldManyValidation = async (value) => {
  if (!(value && Array.isArray(value))) {
    return true;
  }

  for (const item of value) {
    if (!item) {
      continue;
    }

    const stringValue = String(item).trim();
    if (!stringValue) {
      continue;
    }

    const rangeMatch = stringValue.match(NOTATION_RANGE_REGEX);
    if (rangeMatch) {
      const start = Number.parseInt(rangeMatch[1], 10);
      const end = Number.parseInt(rangeMatch[2], 10);
      if (start > end) {
        return `Invalid range: ${stringValue} (start must be less than or equal to end)`;
      }
      continue;
    }

    const singleMatch = stringValue.match(NOTATION_SINGLE_NUMBER_REGEX);
    if (!singleMatch) {
      return `Invalid format: "${stringValue}". Only numbers (e.g., 1, 5, 10) or ranges (e.g., 2-5) are allowed`;
    }
  }

  return true;
};
