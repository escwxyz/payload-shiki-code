import {
  type BundledTheme,
  bundledThemes,
  bundledThemesInfo,
  type ThemeInput,
} from "shiki";

export function extractThemeOptions() {
  const lightThemeOptions: Array<{ label: string; value: string }> = [];
  const darkThemeOptions: Array<{ label: string; value: string }> = [];

  for (const themeInfo of bundledThemesInfo) {
    const option = {
      value: themeInfo.id,
      label: themeInfo.displayName,
    };

    if (themeInfo.type === "light") {
      lightThemeOptions.push(option);
    } else {
      darkThemeOptions.push(option);
    }
  }

  lightThemeOptions.sort((a, b) => a.label.localeCompare(b.label));
  darkThemeOptions.sort((a, b) => a.label.localeCompare(b.label));

  return {
    light: lightThemeOptions,
    dark: darkThemeOptions,
  };
}

/**
 * Load a theme by name
 */
export async function loadTheme(name: BundledTheme): Promise<ThemeInput> {
  if (name in bundledThemes) {
    const themeModule = await bundledThemes[name]();
    return themeModule.default;
  }
  throw new Error(`Theme "${name}" not found in bundled themes`);
}
