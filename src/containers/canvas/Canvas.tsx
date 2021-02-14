import { FunctionComponent, useCallback, useEffect, useRef } from "react";
import { useWindowSize } from "../../utils/hooks/useWindowSize";
import { debounce } from "lodash";
import "./Canvas.scss";
import { CanvasWrapper, CanvasElement, Vector2D } from "../../utils/models";
import { getRelativeCursorPosition } from "../../utils/mouseEventUtils";

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

  // --------------------
  // --- Mouse Events ---
  // --------------------
  const onMouseDown = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!canvas.current) return;
    const cursorPos = getRelativeCursorPosition(event);

    // To manage z-index we can order canvas.current.canvasElements depending on some constraint
    const topMostClickedElement = canvas.current.canvasElements.find((el) => el.containsPoint(cursorPos));
    if (topMostClickedElement) {
      topMostClickedElement.isBeingDragged = true;
    }
  };

  const onMouseUp = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!canvas.current) return;

    canvas.current.canvasElements.forEach((el) => {
      el.isBeingDragged = false;

      //   if (el.containsPoint(relativePos) && el.isBeingDragged) {
      //     el.isBeingDragged = false;
      //   }
    });
  };

  const onMouseMove = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!canvas.current) return;
    const elementBeingDragged = canvas.current.elementBeingDragged;
    if (!elementBeingDragged) return;
    const cursorPos = getRelativeCursorPosition(event);

    elementBeingDragged.center = cursorPos;
    canvas.current.render();
    console.log("Dragging");

    // canvas.current.canvasElements.forEach((el) => {
    //   console.log(el.isBeingDragged);
    // });
  };

  // --------------------
  // --- Side Effects ---
  // --------------------

  // Init
  useEffect(() => initCanvas(), [initCanvas]);

  // Window Resize Handler
  useEffect(() => debounceResize, [debounceResize, onWindowResize]);

  return <canvas ref={canvasRef} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseMove={onMouseMove}></canvas>;
};

export default Canvas;
