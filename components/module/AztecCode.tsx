import React from "react";
import bwipjs from "bwip-js";

export type AztecCodeProps = { code: string };

export default function AztecCode({ code }: AztecCodeProps) {
  const containerRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (container) {
      let canvas = bwipjs.toCanvas(container, {
        bcid: "azteccode",
        text: code,
        includetext: true,
        textxalign: "center",
        scale: 20,
      });
    }
  }, [code]);
  return <canvas ref={containerRef} style={{ maxWidth: "100%", minWidth: "100%" }} />;
}
