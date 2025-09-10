import type { ShikiTransformer } from "shiki";
import { PluginStateManager } from "../PluginStateManager.js";
import type { CodeBlockData } from "../types.js";
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
  const stateManager = PluginStateManager.getInstance();
  const pluginContext = stateManager.getContext();
  const { config } = pluginContext;

  const displayOptions = {
    lineNumbers: true,
    showLanguage: true,
    wrapLines: false,
    copyButton: true,
    startLineNumber: 1,
    containerClasses: [],
    preClasses: [],
    codeClasses: [],
    ...config.displayOptions,
  };

  const shikiOptions = {
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
    highlighterOptions: {},
    codeToHastOptions: {},
    transformers: [],
    engine: "oniguruma" as const,
    ...config.shiki,
  };

  const styleOptions = {
    borderColor: "#e1e4e8",
    borderRadius: "6px",
    padding: "1rem",
    fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    fontSize: "14px",
    lineHeight: "1.5",
    ...config.styleOptions,
  };

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
    ...config.notationOptions,
  };

  const {
    language,
    code,
    fileName,
    lightTheme,
    darkTheme,
    showLineNumbers = displayOptions.lineNumbers,
    showLanguageLabel = displayOptions.showLanguage,
    wrap: wrapFromData,
    notationType,
    notationRange,
    startLineNumber = displayOptions.startLineNumber,
  } = data;

  const wrapEnabled =
    typeof wrapFromData === "boolean" ? wrapFromData : displayOptions.wrapLines;

  const themes = {
    light: lightTheme || shikiOptions.themes.light,
    dark: darkTheme || shikiOptions.themes.dark,
  };

  if (config.hooks?.beforeRender) {
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
    wrap: wrapEnabled,
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
