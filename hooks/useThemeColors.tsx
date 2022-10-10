import { ThemeColors } from "../types/components/Theme";
import React from "react";

export default function useThemeColors({
  primary,
  secondary,
  primary_constrast_text,
}: ThemeColors) {
  React.useEffect(() => {
    const bodyQuery = document.getElementsByClassName("page_root");
    const body = bodyQuery[0] as HTMLBodyElement | undefined;

    if (body) {
      const oldPrimary = body.style.getPropertyValue("--color-primary");
      const oldSecondary = body.style.getPropertyValue("--color-secondary");
      const oldPrimary_contrast_text = body.style.getPropertyValue("--color-primary-contrast_text");

      primary && body.style.setProperty("--color-primary", primary);
      primary_constrast_text &&
        body.style.setProperty("--color-primary-contrast_text", primary_constrast_text);
      secondary && body.style.setProperty("--color-secondary", secondary);

      return () => {
        body.style.setProperty("--color-primary", oldPrimary);
        body.style.setProperty("--color-secondary", oldSecondary);
        body.style.setProperty("--color-primary-contrast_text", oldPrimary_contrast_text);
      };
    }
  }, [primary, primary_constrast_text, secondary]);
}
