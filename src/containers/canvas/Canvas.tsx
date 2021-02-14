import { FunctionComponent, useCallback, useEffect, useRef, useState } from "react";
import { useWindowSize } from "../../utils/hooks/useWindowSize";
import { debounce } from "lodash";
import "./Canvas.scss";
import { CanvasElement, Vector2D } from "../../utils/models";
import { CanvasWrapper } from "../../utils/models/canvasWrapper";

export interface CanvasProps {
  images: HTMLImageElement[];
}

const Canvas: FunctionComponent<CanvasProps> = (props: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null as any);
  const onWindowResize = useWindowSize();
  const canvas = useRef<CanvasWrapper>();

  const initCanvasElements = (image: HTMLImageElement): CanvasElement => {
    const center = new Vector2D(image.width / 2, image.height / 2);
    return new CanvasElement(image, center);
  };

  const resize = () => {
    console.log("Resizing");
    if (!canvas.current) return;
    const { innerWidth } = window;
    canvas.current.adjustCanvasSize(innerWidth, Math.floor((innerWidth / 16) * 9));
    canvas.current.render();
  };

  // Debounce limits the number of calls in a given time range. This may prevent unnecessary calls to the render method.
  // Debounce needs to maintain its reference in memory. The eslint-disable allows us to maintain a reference where usually useCallbacks won't
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceResize = useCallback(
    debounce(() => resize(), 100),
    []
  );

  const initCanvas = useCallback(() => {
    console.log("Init");
    canvas.current = new CanvasWrapper(canvasRef.current, props.images.map(initCanvasElements));
    (() => resize)();
  }, [props.images]);

  // Mouse Events
  const onMouseDown = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const xPos = event.pageX - (event.currentTarget.offsetLeft || 0);
    const yPos = event.pageY - (event.currentTarget.offsetTop || 0);
    const relativePos = new Vector2D(xPos, yPos);

    canvas.current?.canvasElements.forEach((el) => {
      console.log(el.containsPoint(relativePos));
    });

    console.log(xPos, yPos);
  };

  // --------------------
  // --- Side Effects ---
  // --------------------

  // Init
  useEffect(() => initCanvas(), [initCanvas]);

  // Window Resize Handler
  useEffect(() => debounceResize, [debounceResize, onWindowResize]);

  return <canvas ref={canvasRef} onMouseDown={onMouseDown}></canvas>;
};

export default Canvas;
