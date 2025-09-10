import type {
  DefaultNodeTypes,
  DefaultTypedEditorState,
  SerializedBlockNode,
} from "@payloadcms/richtext-lexical";
import {
  RichText as ConvertRichText,
  type JSXConvertersFunction,
} from "@payloadcms/richtext-lexical/react";

import { createCodeBlockJSXConverter } from "payload-shiki-code/converters";

import type { CodeBlock as CodeBlockType } from "../../payload-types.ts";

type NodeTypes = DefaultNodeTypes | SerializedBlockNode<CodeBlockType>;

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  ...createCodeBlockJSXConverter("test"), // extra classnames to the code block component
});

type Props = {
  data: DefaultTypedEditorState;
} & React.HTMLAttributes<HTMLDivElement>;

export default function RichText(props: Props) {
  const { className, ...rest } = props;
  return (
    <ConvertRichText
      className="prose md:prose-md dark:prose-invert max-w-none"
      converters={jsxConverters}
      {...rest}
    />
  );
}
