import { Colors } from "../types/components/Utils";
import { HSL, RGB } from "../types/Utils";

export function componentToHex(c: number): string {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex([r, g, b]: RGB): string {
  [r, g, b] = [Math.floor(r), Math.floor(g), Math.floor(b)];
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function hexToRgb(hex: string): RGB {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0];
}

export function RGBToHSL([r, g, b]: RGB): HSL {
  r /= 255;
  g /= 255;
  b /= 255;
  const l = Math.max(r, g, b);
  const s = l - Math.min(r, g, b);
  const h = s ? (l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s) : 0;
  return [
    60 * h < 0 ? 60 * h + 360 : 60 * h,
    100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
    (100 * (2 * l - s)) / 2,
  ];
}

export function HSLToRGB([h, s, l]: HSL): RGB {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [255 * f(0), 255 * f(8), 255 * f(4)];
}

function padZero(str: string, len?: number) {
  len = len || 2;
  var zeros = new Array(len).join("0");
  return (zeros + str).slice(-len);
}

export function invertColor(hex: string): string {
  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error("Invalid HEX color.");
  }
  // invert color components
  var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
    g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
    b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
  // pad each with zeros and return
  return "#" + padZero(r.toString()) + padZero(g) + padZero(b);
}

export function composeClasses(...params: string[]): string {
  return params.join(" ");
}

const getCss = (str: string) => {
  return `var(--color-${str})`;
};

export function getCssColor(color: Colors): string {
  switch (color) {
    case Colors.primary:
      return getCss("primary");
    case Colors.secodary:
      return getCss("secondary");
    case Colors.success:
      return getCss("success");
    case Colors.error:
      return getCss("error");
    case Colors.warning:
      return getCss("warning");
  }
}

export function cssUm(val: string | number | undefined) {
  return typeof val === "number" ? `${val}px` : val;
}

export function isValidEmail(email: string): boolean {
  var emailReg = new RegExp(
    /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
  );
  return emailReg.test(email);
}
