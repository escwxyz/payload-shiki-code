import type { SerializedBlockNode } from "@payloadcms/richtext-lexical";
import type { JSXConverters } from "@payloadcms/richtext-lexical/react";
import { CodeBlock } from "../components/CodeServer.js";
import { PluginStateManager } from "../PluginStateManager.js";
import type { CodeBlockData } from "../types.js";

/**
 * Create JSX converters for the code block
 *
 * This allows the code block to be rendered in the Lexical richtext editor
 */
export const createCodeBlockJSXConverter = (
  className?: string
): JSXConverters<SerializedBlockNode> => {
  const stateManager = PluginStateManager.getInstance();
  const context = stateManager.getContext();
  const { blockSlug = "code" } = context.config;

  return {
    blocks: {
      [blockSlug]: ({ node }: { node: SerializedBlockNode<CodeBlockData> }) => {
        return <CodeBlock className={className} data={node.fields} />;
      },
    },
  };
};
