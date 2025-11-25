import type { StorybookConfig } from "@storybook/react-vite";
import { resolve } from "path";

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    // Resolve workspace packages
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        "@cosmo/core-schema": resolve(__dirname, "../packages/core-schema/src"),
        "@cosmo/validator": resolve(__dirname, "../packages/validator/src"),
        "@cosmo/renderer-web": resolve(__dirname, "../packages/renderer-web/src"),
      },
    };
    return config;
  },
};

export default config;
