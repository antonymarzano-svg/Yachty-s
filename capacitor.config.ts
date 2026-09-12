import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.yachtys.app",
  appName: "Yachty'S",
  webDir: "dist",
  backgroundColor: "#071224",
  ios: {
    contentInset: "always",
  },
  server: {
    androidScheme: "https",
  },
};

export default config;
