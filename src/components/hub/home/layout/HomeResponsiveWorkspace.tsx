// src/components/hub/home/layout/HomeResponsiveWorkspace.tsx - Router visual que delega layouts de Arsenal por breakpoint.
"use client";

import { useEffect, useState } from "react";
import { HomeDesktopWorkspace } from "@/components/hub/home/layout/HomeDesktopWorkspace";
import { HomeMobileWorkspace } from "@/components/hub/home/layout/HomeMobileWorkspace";
import { isMobileLayoutViewport } from "@/components/internal/layout-breakpoints";
import { IHomeWorkspaceProps } from "@/components/hub/home/layout/home-workspace-types";

export function HomeResponsiveWorkspace(props: IHomeWorkspaceProps) {
  const [isMobileLayout, setIsMobileLayout] = useState<boolean>(() =>
    typeof window === "undefined" ? false : isMobileLayoutViewport(window.innerWidth),
  );

  useEffect(() => {
    const updateLayoutMode = (): void => setIsMobileLayout(isMobileLayoutViewport(window.innerWidth));
    updateLayoutMode();
    window.addEventListener("resize", updateLayoutMode);
    return () => window.removeEventListener("resize", updateLayoutMode);
  }, []);

  if (isMobileLayout) return <HomeMobileWorkspace {...props} />;
  return <HomeDesktopWorkspace {...props} />;
}
