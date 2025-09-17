import type { SerializedBlockNode } from "@payloadcms/richtext-lexical";
import { CodeBlock } from "../components/CodeServer.js";
import { getPluginConfig } from "../store.js";
import type { CodeBlockData } from "../types.js";

/**
 * Create JSX converters for the code block
 *
 * This allows the code block to be rendered in the Lexical richtext editor.
 * Returns only the code block converter object - users should merge this with their existing converters.
 */
export const createCodeBlockJSXConverter = (className?: string) => {
  const config = getPluginConfig();
  const { blockSlug = "code" } = config || {};

  // Return just the code block converter object
  return {
    blocks: {
      [blockSlug]: ({ node }: { node: SerializedBlockNode<CodeBlockData> }) => {
        return <CodeBlock className={className} data={node.fields} />;
      },
    },
  };
};

/**
 * Helper function to merge code block converter with existing converters
 */
export const mergeCodeBlockConverter = (
  existingConverters: { blocks: { [x: string]: unknown } },
  className?: string
) => {
  const codeBlockConverter = createCodeBlockJSXConverter(className);

  return {
    ...existingConverters,
    blocks: {
      ...existingConverters.blocks,
      ...codeBlockConverter.blocks,
    },
  };
};
