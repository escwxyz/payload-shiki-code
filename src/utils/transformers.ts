import type { ShikiTransformer } from "shiki";
import { createCoreStructureTransformer } from "../transformers/core.js";
import { createLineNotationTransformer } from "../transformers/line-notation.js";
import type { CodeBlockData, PayloadShikiCodeConfig } from "../types.js";

type BuildTransformersParams = Pick<
  CodeBlockData,
  | "fileName"
  | "showLanguageLabel"
  | "showLineNumbers"
  | "language"
  | "startLineNumber"
  | "notationType"
  | "notationRange"
>;

export const buildTransformers = (
  config: PayloadShikiCodeConfig,
  params: BuildTransformersParams
): ShikiTransformer[] => {
  const {
    fileName,
    showLanguageLabel,
    showLineNumbers,
    language,
    startLineNumber,
    notationType,
    notationRange,
  } = params;

  const transformers: ShikiTransformer[] = [];

  transformers.push(
    createCoreStructureTransformer({
      fileName,
      showLanguageLabel,
      showLineNumbers,
      language,
      startLineNumber,
    })
  );

  if (notationType && notationRange && notationRange.length > 0) {
    transformers.push(
      createLineNotationTransformer({
        notationType,
        notationRange,
      })
    );
  }

  const extra = config.shiki?.transformers;
  if (extra) {
    for (const transformer of extra) {
      if (typeof transformer === "function") {
        transformers.push(transformer(config));
      } else {
        transformers.push(transformer);
      }
    }
  }

  return transformers;
};
