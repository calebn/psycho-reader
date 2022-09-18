import React, { PropsWithRef, useEffect, useRef } from "react";

interface CanvasProps
  extends PropsWithRef<{
    width?: number;
    height?: number;
    src: string;
    alt?: string;
    layout?: string;
  }> {}

const Canvas = (props: CanvasProps) => {
  const { width, height, src, alt, layout, ...other } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    console.log("useEffect canvas start");

    let ctx: CanvasRenderingContext2D | null = null;

    if (canvasRef.current) {
      ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          console.log("useEffect canvas drawImage ", img);
          ctx?.drawImage(img, 500, 500);
        };
      }
    }

    const ref = canvasRef.current;

    return () => {
      if (ref && ctx) {
        ctx.clearRect(0, 0, ref.width, ref.height);
      }
    };
  }, [src]);

  return (
    <>
      <canvas ref={canvasRef} {...other} />
    </>
  );
};

export default Canvas;
