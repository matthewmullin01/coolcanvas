import { FunctionComponent, useCallback, useEffect, useRef } from "react";
import { useWindowSize } from "../../utils/hooks/useWindowSize";
import { debounce } from "lodash";
import "./Canvas.scss";
import { CanvasElement, Vector2D } from "../../utils/models";

export interface CanvasProps {
  images: HTMLImageElement[];
}

const Canvas: FunctionComponent<CanvasProps> = (props: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null as any);
  const windowSize = useWindowSize();

  const initCanvasElements = (image: HTMLImageElement): CanvasElement => {
    const center = new Vector2D(image.width / 2, image.height / 2);
    return new CanvasElement(image, center);
  };

  const canvasElements = props.images.map(initCanvasElements);

  const adjustCanvasSize = useCallback(() => {
    const { innerWidth } = window;
    canvasRef.current.width = innerWidth;
    canvasRef.current.height = Math.floor((innerWidth / 16) * 9);
  }, []);

  const drawImages = useCallback(async () => {
    canvasElements.forEach((element) => {
      const imageRect = new Path2D();
      imageRect.rect(0, 0, element.width, element.height);
      console.log(element.edges, element.corners);

      canvasRef.current
        .getContext("2d")!
        .drawImage(element.canvasImageSource, element.edges.left, element.edges.top, element.width, element.height);
    });
  }, [canvasElements]);

  const render = useCallback(() => {
    canvasRef.current.getContext("2d")!.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    drawImages();
  }, [drawImages]);

  // Debounce needs to maintain its reference in memory. The eslint-disable allows us to maintain a reference where usually useCallbacks won't
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceResize = useCallback(
    debounce(() => {
      adjustCanvasSize();
      render();
    }, 500),
    []
  );

  // Mouse Events
  const onMouseDown = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const context = canvasRef.current!.getContext("2d")!;

    const xPos = event.pageX - (event.currentTarget.offsetLeft || 0);
    const yPos = event.pageY - (event.currentTarget.offsetTop || 0);
    const relativePos = new Vector2D(xPos, yPos);

    canvasElements.forEach((el) => {
      console.log(el.containsPoint(relativePos));
    });

    console.log(xPos, yPos);
  };

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

  return <canvas ref={canvasRef} onMouseDown={onMouseDown}></canvas>;
};

export default Canvas;
