/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export type ThemeColors = {
  text: string;
  background: string;
  primary: string;
  secondary: string;
  accent: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  gradientStart: string;
  gradientEnd: string;
  cardBg: string;
  border: string;
};

export const Colors: { light: ThemeColors; dark: ThemeColors } = {
  light: {
    text: '#000000',
    background: '#F0F0F0',
    primary: '#0C28FD',
    secondary: '#FFFFFF',
    accent: '#0C28FD',
    tint: '#0C28FD',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0C28FD',
    gradientStart: '#0C28FD',
    gradientEnd: '#06168D',
    cardBg: '#FFFFFF',
    border: '#E0E0E0',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    primary: '#0C28FD',
    secondary: '#1C1C1E',
    accent: '#0C28FD',
    tint: '#0C28FD',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#0C28FD',
    gradientStart: '#0C28FD',
    gradientEnd: '#06168D',
    cardBg: '#1C1C1E',
    border: '#2C2C2E',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
