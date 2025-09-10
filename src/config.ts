import type { Block } from "payload";
import { trimCode } from "./hooks/trim-code.js";
import { updateBlockName } from "./hooks/update-block-name.js";
import { PluginStateManager } from "./PluginStateManager.js";
import { getFilteredLanguageOptions } from "./utils/langs.js";
import { extractThemeOptions } from "./utils/themes.js";
import { validateFileName } from "./validations/validate-file-name.js";
import { validateNotationRange } from "./validations/validate-notation-range.js";

export const createBlockConfig = (): Block => {
  const stateManager = PluginStateManager.getInstance();
  const context = stateManager.getContext();

  const {
    blockSlug = "code",
    blockInterfaceName = "CodeBlock",
    displayOptions = {},
    shiki = {},
    languages = ["text" as const],
    // TODO: blockConfig
  } = context.config;

  const {
    lineNumbers: showLineNumbers = true,
    showLanguage: showLanguageLabel = true,
    wrapLines: wrap = false,
  } = displayOptions;

  const {
    themes = {
      light: "github-light",
      dark: "github-dark",
    },
  } = shiki;

  const filteredLanguageOptions = getFilteredLanguageOptions(languages);

  const themeOptions = extractThemeOptions();

  return {
    slug: blockSlug,
    interfaceName: blockInterfaceName,
    fields: [
      {
        type: "tabs",
        tabs: [
          {
            label: "Code",
            fields: [
              {
                type: "select",
                name: "language",
                label: "Language",
                options: filteredLanguageOptions,
                required: true,
                admin: {
                  description:
                    "Languages available are specified in the plugin config",
                },
              },
              {
                type: "text",
                name: "fileName",
                label: "File Name",
                required: false,
                validate: validateFileName,
                hooks: {
                  afterChange: [updateBlockName],
                },
              },
              {
                type: "row",
                fields: [
                  {
                    type: "select",
                    name: "notationType",
                    label: "Notation Type",
                    interfaceName: "CodeNotationType",
                    options: [
                      {
                        label: "Add",
                        value: "add",
                      },
                      {
                        label: "Remove",
                        value: "remove",
                      },
                      {
                        label: "Highlight",
                        value: "highlight",
                      },
                    ],
                  },
                  {
                    type: "text",
                    name: "notationRange",
                    label: "Notation Range",
                    hasMany: true,
                    admin: {
                      description: "e.g. 1-5, 6-10, 12",
                    },
                    validate: validateNotationRange,
                  },
                ],
              },
              {
                type: "code",
                name: "code",
                label: false,
                required: true,
                admin: {
                  components: {
                    Field: {
                      path: "payload-shiki-code/admin#CodeFieldClient",
                    },
                  },
                },
                hooks: {
                  beforeChange: [trimCode],
                },
              },
            ],
          },
          {
            label: "Config",
            fields: [
              {
                type: "row",
                fields: [
                  {
                    name: "lightTheme",
                    type: "select",
                    label: "Light Theme",
                    options: themeOptions.light,
                    defaultValue: themes.light,
                  },
                  {
                    name: "darkTheme",
                    type: "select",
                    label: "Dark Theme",
                    options: themeOptions.dark,
                    defaultValue: themes.dark,
                  },
                ],
              },
              {
                type: "checkbox",
                name: "showLineNumbers",
                label: "Show Line Numbers",
                defaultValue: showLineNumbers,
                admin: {
                  description: "Show line numbers",
                },
              },
              {
                type: "checkbox",
                name: "showLanguageLabel",
                label: "Show Language Label",
                defaultValue: showLanguageLabel,
                admin: {
                  description:
                    "Show language label on the right top corner of the code block",
                },
              },
              {
                type: "checkbox",
                name: "wrap",
                label: "Wrap",
                admin: {
                  description:
                    "Wrap the code if it exceeds the container width",
                },
                defaultValue: wrap,
              },
            ],
          },
        ],
      },
    ],
  };
};
