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
          100: { value: "#fcecc9" },
          200: { value: "#fad78d" },
          300: { value: "#f7bd52" },
          400: { value: "#f49f1e" },
          500: { value: "#ee8212" },
          600: { value: "#d35f0c" },
          700: { value: "#af410e" },
          800: { value: "#8e3212" },
          900: { value: "#752a12" },
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
            value: { base: "{colors.brand.500}", _dark: "{colors.brand.600}" },
          },
          contrast: {
            value: { base: "{colors.brand.100}", _dark: "{colors.brand.900}" },
          },
          fg: {
            value: { base: "{colors.brand.700}", _dark: "{colors.brand.300}" },
          },
          muted: {
            value: { base: "{colors.brand.100}", _dark: "{colors.brand.900}" },
          },
          subtle: {
            value: { base: "{colors.brand.200}", _dark: "{colors.brand.800}" },
          },
          emphasized: {
            value: { base: "{colors.brand.300}", _dark: "{colors.brand.600}" },
          },
          focusRing: {
            value: { base: "{colors.brand.500}", _dark: "{colors.brand.400}" },
          },
        },
      },
    },
  },
});

const system = createSystem(defaultConfig, config);

export default system;
