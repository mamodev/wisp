import { useEffect, useRef } from "react";
import { HEX } from "../../types/Utils";

export type ColoredLogoProps = {
  logoImg: string;
  color: HEX;
};

export default function ColoredLogo({ logoImg, color }: ColoredLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let image = new Image();
    image.src = logoImg;

    image.onload = () => {
      let canvas = canvasRef.current;
      if (!canvas) return;

      let w = (canvas.width = image.width);
      let h = (canvas.height = image.height);
      let ctx = canvas.getContext("2d");
      if (!ctx) return console.error("Coundn't get te canvas context to write the colored logo!");

      ctx.fillStyle = color;
      ctx.drawImage(image, 0, 0);

      ctx.globalCompositeOperation = "source-in";

      ctx.fillRect(0, 0, w, h);
    };
  }, [logoImg, color]);

  return <canvas ref={canvasRef} style={{ width: "50%" }} />;
}
