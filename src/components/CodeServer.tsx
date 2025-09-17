import type { ShikiTransformer } from "shiki";
import { getPluginConfig } from "../store.js";
import type {
  CodeBlockData,
  DisplayOptions,
  NotationOptions,
  ShikiOptions,
  StyleOptions,
} from "../types.js";
import {
  DEFAULT_DISPLAY_OPTIONS,
  DEFAULT_NOTATION_OPTIONS,
  DEFAULT_SHIKI_OPTIONS,
  DEFAULT_STYLE_OPTIONS,
} from "../utils/defaults.js";
import { getHighlighter } from "../utils/highlighter.js";
import { loadLanguage } from "../utils/langs.js";
import { buildCssVariables } from "../utils/style.js";
import { buildTransformers } from "../utils/transformers.js";
import {
  type CopyButtonProps,
  CopyButton as DefaultCopyButton,
} from "./CopyButtonClient.js";
import "./styles.css";

export type CodeBlockProps = {
  data: CodeBlockData;
  className?: string;
  CopyButton?: React.ComponentType<Omit<CopyButtonProps, "code">>;
};

export const CodeBlock = async ({
  data,
  className,
  CopyButton: CustomCopyButton,
}: CodeBlockProps) => {
  const config = getPluginConfig();

  if (!config) {
    throw new Error("Plugin configuration not found");
  }

  const displayOptions: DisplayOptions = {
    ...DEFAULT_DISPLAY_OPTIONS,
    ...config?.displayOptions,
  };

  const shikiOptions: ShikiOptions = {
    ...DEFAULT_SHIKI_OPTIONS,
    ...config?.shiki,
  };

  const styleOptions: StyleOptions = {
    ...DEFAULT_STYLE_OPTIONS,
    ...config?.styleOptions,
  };

  const notationOptions: NotationOptions = {
    ...DEFAULT_NOTATION_OPTIONS,
    ...config?.notationOptions,
  };

  const {
    language,
    code,
    fileName,
    lightTheme,
    darkTheme,
    showLineNumbers = displayOptions.lineNumbers,
    showLanguageLabel = displayOptions.showLanguage,
    notationType,
    notationRange,
    startLineNumber = displayOptions.startLineNumber,
  } = data;

  const themes = {
    light: lightTheme || shikiOptions.themes?.light,
    dark: darkTheme || shikiOptions.themes?.dark,
  };

  if (config?.hooks?.beforeRender) {
    await config.hooks.beforeRender(code, language, data);
  }

  const highlighter = await getHighlighter();

  // Ensure language is loaded (fallback for languages not in config)
  await loadLanguage(language);

  const transformers: ShikiTransformer[] = buildTransformers(config, {
    fileName,
    showLanguageLabel,
    showLineNumbers,
    language,
    startLineNumber,
    notationType,
    notationRange,
  });

  const html = highlighter.codeToHtml(code, {
    lang: language,
    themes,
    defaultColor: "light-dark()", // Only this can support server side dark / light mode
    cssVariablePrefix: "--shiki-",
    transformers,
    ...shikiOptions.codeToHastOptions,
  });

  if (config.hooks?.afterRender) {
    await config.hooks.afterRender(html, code, language);
  }

  const containerClasses = [
    "shiki-container",
    ...(displayOptions.containerClasses || []),
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  const cssVars: React.CSSProperties = buildCssVariables(
    styleOptions,
    notationOptions
  );

  const CopyButton = CustomCopyButton || DefaultCopyButton;

  return (
    <div className={containerClasses} style={{ ...cssVars }}>
      {displayOptions.copyButton && <CopyButton code={code} />}
      <div
        className="shiki-content"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: unset
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};
