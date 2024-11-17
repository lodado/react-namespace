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
    return <Story />
  },
]

export default preview;
