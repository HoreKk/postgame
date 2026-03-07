import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        body: { value: '"JetBrains Mono Variable", monospace' },
        heading: { value: '"JetBrains Mono Variable", monospace' },
      },
      colors: {
        brand: {
          500: { value: "#bb4d00" },
          600: { value: "#973c00" },
          foreground: { value: "#fffbeb" },
        },
        stone: {
          50: { value: "#ffffff" },
          200: { value: "#f5f5f4" },
          300: { value: "#f4f4f5" },
          600: { value: "#27272a" },
          700: { value: "#292524" },
          800: { value: "#1c1917" },
          900: { value: "#0c0a09" },
          950: { value: "#fafaf9" },
        },
        sand: {
          400: { value: "#79716b" },
          600: { value: "#a6a09b" },
          900: { value: "#18181b" },
        },
      },
    },
    semanticTokens: {
      colors: {
        secondary: {
          bg: {
            value: { base: "{colors.stone.300}", _dark: "{colors.stone.600}" },
          },
          fg: {
            value: { base: "{colors.sand.900}", _dark: "{colors.stone.950}" },
          },
        },
        primary: {
          solid: {
            value: { base: "{colors.brand.500}", _dark: "{colors.brand.500}" },
          },
          contrast: { value: "{colors.brand.foreground}" },
          fg: {
            value: { base: "{colors.brand.500}", _dark: "{colors.brand.600}" },
          },
          muted: {
            value: { base: "{colors.stone.200}", _dark: "{colors.stone.700}" },
          },
          subtle: {
            value: { base: "{colors.stone.300}", _dark: "{colors.stone.600}" },
          },
          emphasized: {
            value: { base: "{colors.brand.500}", _dark: "{colors.brand.600}" },
          },
          focusRing: {
            value: { base: "{colors.brand.500}", _dark: "{colors.brand.600}" },
          },
        },
      },
    },
  },
});

const system = createSystem(defaultConfig, config);

export default system;
