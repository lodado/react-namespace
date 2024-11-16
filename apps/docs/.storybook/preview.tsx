import { DocsContainer } from "@storybook/addon-docs";
import { useDarkMode } from "storybook-dark-mode";

import React, { useEffect } from "react";

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  darkMode: {},

  tags: ["autodocs"],
};

export const decorators = [
  (Story: any) => {
    const isDarkMode = useDarkMode();
    useEffect(() => {
      document.documentElement.setAttribute(
        "data-theme",
        isDarkMode ? "dark" : "light"
      );
      document.body.style.backgroundColor = isDarkMode ? "#000" : "#fff";
    }, [isDarkMode]);

    return <Story />;
  },
];

export default preview;
