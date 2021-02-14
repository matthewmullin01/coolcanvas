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

  const resize = useCallback(() => {
    if (!canvas.current) return;
    const { innerWidth } = window;
    canvas.current.adjustCanvasSize(innerWidth, Math.floor((innerWidth / 16) * 9));
    canvas.current.canvasElements.forEach(handleImageOverflow);
    canvas.current.render();
  }, []);

  // Debounce limits the number of calls in a given time range. This may prevent unnecessary calls to the render method.
  // Debounce needs to maintain its reference in memory. The eslint-disable allows us to maintain a reference where usually useCallbacks won't
  // Could also rather look into limiting the canvas.render() method - ie Similar to setting a fixed framerate in games
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceResize = useCallback(
    debounce(() => resize(), 30),
    []
  );

  const initCanvas = useCallback(() => {
    canvas.current = new CanvasWrapper(canvasRef.current, props.images.map(initCanvasElements));
    (() => resize)();
  }, [props.images, resize]);

  // --------------------
  // --- Mouse Events ---
  // --------------------

  // Potential Improvement -
  // Rather handle mouse event in parent or even root.
  // Why? When mouse moves off canvas the image doesn't react to mouse events anymore.
  const onMouseDown = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!canvas.current) return;
    const cursorPos = getRelativeCursorPosition(event);

    // To manage z-index we can order canvas.current.canvasElements depending on some constraint
    const topMostClickedElement = canvas.current.canvasElements.find((el) => el.containsPoint(cursorPos));
    if (topMostClickedElement) {
      topMostClickedElement.setDragging(true, cursorPos);
    }
    canvas.current.render();
  };

  const onMouseUp = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!canvas.current) return;
    if (canvas.current.elementBeingDragged) canvas.current.elementBeingDragged.setDragging(false);
    canvas.current.render();
  };

  const onMouseMove = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!canvas.current) return;
    const elementBeingDragged = canvas.current.elementBeingDragged;
    if (!elementBeingDragged) return;
    if (!elementBeingDragged.dragState.draggingOffset) throw Error('Element being dragged without "draggingOffset" set');
    const cursorPos = getRelativeCursorPosition(event);

    elementBeingDragged.center = cursorPos.subtract(elementBeingDragged.dragState.draggingOffset);

    handleImageOverflow(elementBeingDragged);

    canvas.current.render();
  };

  /**
   *  Prevents image from overflowing off the canvas edges.
   *  Note - canvas.render() method must be called after.
   */
  const handleImageOverflow = (element: CanvasElement) => {
    if (!canvas.current) return;
    const canvasWidth = canvas.current.canvas.width;
    const canvasHeight = canvas.current.canvas.height;
    if (element.edges.left < 0) element.center.x = element.width / 2;
    if (element.edges.right > canvasWidth) element.center.x = canvasWidth - element.width / 2;
    if (element.edges.top < 0) element.center.y = element.height / 2;
    if (element.edges.bottom > canvasHeight) element.center.y = canvasHeight - element.height / 2;
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
