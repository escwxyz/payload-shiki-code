import type { ShikiTransformer } from "shiki/core";
import { PluginStateManager } from "../PluginStateManager.js";
/**
 * Create a line notation transformer based on Payload field data
 * This handles the notation ranges specified in the block fields
 */
export const createLineNotationTransformer = ({
  notationType,
  notationRange,
}: {
  notationType: "add" | "remove" | "highlight";
  notationRange: string[];
}): ShikiTransformer => {
  // Parse all ranges to get line numbers
  const lineNumbers = new Set<number>();

  for (const range of notationRange) {
    const trimmedRange = range.trim();
    if (trimmedRange.includes("-")) {
      // Handle range like "1-5"
      const [start, end] = trimmedRange
        .split("-")
        .map((n) => Number.parseInt(n.trim(), 10));
      if (!(Number.isNaN(start) || Number.isNaN(end))) {
        for (let i = start; i <= end; i++) {
          lineNumbers.add(i);
        }
      }
    } else {
      // Handle single line number
      const lineNum = Number.parseInt(trimmedRange, 10);
      if (!Number.isNaN(lineNum)) {
        lineNumbers.add(lineNum);
      }
    }
  }

  // Get notation options from state manager
  const stateManager = PluginStateManager.getInstance();
  const context = stateManager.getContext();
  const notationOptions = {
    style: "border" as const,
    highlight: {
      backgroundColor: "rgba(255, 255, 0, 0.1)",
      className: "highlighted",
    },
    add: {
      backgroundColor: "rgba(0, 255, 0, 0.1)",
      className: "added",
    },
    remove: {
      backgroundColor: "rgba(255, 0, 0, 0.1)",
      className: "removed",
    },
    ...context.config.notationOptions,
  };
  const config = notationOptions[notationType];
  const markerClass = config?.className || notationType;
  const notationStyle = notationOptions.style || "border";

  return {
    name: "line-notation",
    line(node, line) {
      // line is 1-indexed
      if (lineNumbers.has(line)) {
        this.addClassToHast(node, markerClass);

        // Add notation data attributes for CSS styling
        node.properties = {
          ...node.properties,
          "data-notation-style": notationStyle,
        };

        // TODO: Symbol notation will be supported in a future release
        // For symbol style, add the symbol as a data attribute
        // if (notationStyle === "symbol" && "symbol" in config && config.symbol) {
        // 	node.properties["data-notation-symbol"] = config.symbol;
        // }

        // TODO: Symbol notation will be supported in a future release
        // Symbol style will handle background differently via CSS
        if (config?.backgroundColor) {
          const currentStyle = node.properties?.style || "";
          node.properties.style =
            `${currentStyle} background-color: ${config.backgroundColor};`.trim();
        }
      }
      return node;
    },
    code(node) {
      if (notationType === "add" || notationType === "remove") {
        this.addClassToHast(node, "has-diff"); // TODO: currently not used
      }
      this.addClassToHast(node, `notation-${notationStyle}`); // TODO: currently not used
      return node;
    },
  };
};
