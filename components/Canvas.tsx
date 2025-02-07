import React, { MouseEvent, PropsWithRef, useEffect, useState } from "react";
import Page from "./Page";
import { getImageToCanvasScale, getCanvasDimension, getDrawImagePropsFromPage } from "../utils/CanvasHelper";
import { Dimension } from "./DimensionType";

interface BaseImageProps {
  width: number;
  height: number;
  src: string;
  alt?: string;
  layout?: "fixed" | "fill" | "intrinsic" | "responsive" | undefined;
  objectPosition: string;
  page: Page;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

interface CanvasProps extends PropsWithRef<BaseImageProps> {}

const Canvas = (props: CanvasProps) => {
  const {
    canvasRef,
    width,
    height,
    src,
    alt,
    layout,
    objectPosition,
    page,
    ...other
  } = props;
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    console.log("useEffect canvas start");
    console.log(`src ${src}`);
    let current: HTMLCanvasElement | null = canvasRef?.current;

    let ctx: CanvasRenderingContext2D | null | undefined =
      current?.getContext("2d");
    const comicImage = new Image();

    comicImage.src = src;

    comicImage.onload = () => {
      const aspectRatio = comicImage.width / comicImage.height;
      if (ctx && current) {
        ctx.canvas.height = getCanvasDimension(Dimension.Height);
        ctx.canvas.width = getCanvasDimension(Dimension.Width);
        ctx.canvas.style.width = window.innerWidth + "px";
        ctx.canvas.style.height = window.innerHeight + "px";

        const {offsetX, offsetY, scaledWidth, scaledHeight} = getDrawImagePropsFromPage(page, current);

        // this will scale to fit the image on the canvas, nice and centered
        setScale(getImageToCanvasScale(comicImage.width, comicImage.height, current));

        console.log('comicImage.width',comicImage.width);
        console.log('comicImage.height',comicImage.height);
        console.log('current.height',current.height);
        console.log('current.height',current.height);

        ctx.drawImage(
          comicImage,
          offsetX,
          offsetY,
          scaledWidth, //scales the image up/down to fit the canvas
          scaledHeight //scales the image up/down to fit the canvas
        );
      }
    };

    return () => {
      if (current && ctx) {
        ctx.clearRect(0, 0, current.width, current.height);
      }
    };
  }, [canvasRef, page, scale, src]);

  /**
   * Click to zoom functionality
   *
   * @param event
   */
  function handleOnClick(event: MouseEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      console.log(`x: ${x} y: ${y}`);
    }
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={handleOnClick}
        {...other}
      />
    </>
  );
};

export default Canvas;
