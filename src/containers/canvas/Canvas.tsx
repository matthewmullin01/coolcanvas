import { FunctionComponent, useCallback, useEffect, useRef } from "react";
import { useWindowSize } from "../../utils/hooks/useWindowSize";
import { loadImage } from "../../utils/imageUtils";
import { debounce } from "lodash";
import "./Canvas.scss";

export interface CanvasProps {
  imageUris: string[];
}

// TODO pass images/elements to render
const Canvas: FunctionComponent<CanvasProps> = (props: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null as any);
  const windowSize = useWindowSize();

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

  // Debounce needs to maintain its memory reference. The eslint-disable allows us to maintain a reference where usually useCallbacks wont
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceResize = useCallback(
    debounce(() => {
      adjustCanvasSize();
      render();
    }, 500),
    []
  );

  // Window Resize Handler
  useEffect(() => {
    if (!canvasRef.current) return;
    debounceResize();
  }, [windowSize, debounceResize]);

  useEffect(() => {
    if (!canvasRef.current) return;
    adjustCanvasSize();
    render();
  }, [adjustCanvasSize, render]);

  return <canvas ref={canvasRef}></canvas>;
};

export default Canvas;
