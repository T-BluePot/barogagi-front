/// <reference types="@vitest/browser/providers/playwright" />

declare module "@common/IconBox" {
  import * as React from "react";
  const IconBox: React.FC<{ children: React.ReactNode }>;
  export default IconBox;
}
