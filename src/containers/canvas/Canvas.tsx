import { FunctionComponent, useCallback, useEffect, useRef } from "react";
import { loadImage } from "../../utils/imageUtils";
import "./Canvas.scss";

export interface CanvasProps {
  imageUris: string[];
}

const Canvas: FunctionComponent<CanvasProps> = (props: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null as any);

  const adjustCanvasSize = useCallback(() => {
    const { innerWidth } = window;
    canvasRef.current.width = innerWidth;
    canvasRef.current.height = Math.floor((innerWidth / 16) * 9);
  }, []);

  const drawImages = useCallback(async () => {
    const images = await Promise.all(props.imageUris.map((uri) => loadImage(uri)));
    images.forEach((image) => {
      const imageRect = new Path2D();
      imageRect.rect(0, 0, image.width, image.height);
      canvasRef.current.getContext("2d")!.drawImage(image, 0, 0, image.width, image.height);
    });
  }, [props.imageUris]);

  const render = useCallback(() => {
    canvasRef.current.getContext("2d")!.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    drawImages();
  }, [drawImages]);

  useEffect(() => {
    if (!canvasRef.current) return;
    adjustCanvasSize();
    render();
  }, [adjustCanvasSize, render]);

  return <canvas ref={canvasRef}></canvas>;
};

export default Canvas;
