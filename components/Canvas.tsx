import React, { MouseEvent, PropsWithRef, useEffect, useState } from "react";

interface BaseImageProps {
  width: number;
  height: number;
  src: string;
  alt?: string;
  layout?: "fixed" | "fill" | "intrinsic" | "responsive" | undefined;
  objectPosition: string;
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
        let scaleX = current.width / comicImage.width;
        let scaleY = current.height / comicImage.height;
        setScale(Math.min(scaleX, scaleY));

        // get the coordinates on the canvas of where to start the image clip
        // this will scale to fit the image on the canvas, nice and centered
        let x = current.width / 2 - (comicImage.width / 2) * scale;
        let y = current.height / 2 - (comicImage.height / 2) * scale;

        //this helps to scale the canvas for higher dpi displays,
        //i.e. pixelRatio > 1  like Retina displays or phones
        const pixelRatio = window.devicePixelRatio;
        ctx.canvas.width = window.innerWidth * pixelRatio;
        ctx.canvas.height = window.innerHeight * pixelRatio;
        ctx.canvas.style.width = window.innerWidth + "px";
        ctx.canvas.style.height = window.innerHeight + "px";

        ctx.drawImage(
          comicImage,
          x,
          y,
          comicImage.width * scale, //scales the image down to fit the canvas
          comicImage.height * scale //scales the image down to fit the canvas
        );
      }
    };

    return () => {
      if (current && ctx) {
        ctx.clearRect(0, 0, current.width, current.height);
      }
    };
  }, [canvasRef, scale, src]);

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
