import { CanvasElement } from ".";

/**
 * A wrapper for the canvas to track the state of the canvas - including elements that are rendered within
 */
export class CanvasWrapper {
  canvas: HTMLCanvasElement;
  canvasElements: CanvasElement[];

  get context() {
    return this.canvas.getContext("2d")!;
  }

  /** Returns CanvasElement being dragged, otherwise undefined if none   */
  get elementBeingDragged() {
    return this.canvasElements.find((el) => el.dragState.isBeingDragged);
  }

  constructor(canvas: HTMLCanvasElement, canvasElements: CanvasElement[]) {
    this.canvas = canvas;
    this.canvasElements = canvasElements;
  }

  adjustCanvasSize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  private drawImages() {
    // Reversing order as to paint the last element first. This comes across more intuitively on the UI
    for (let i = this.canvasElements.length - 1; i >= 0; i--) {
      const element = this.canvasElements[i];
      if (element.dragState.isBeingDragged) {
        this.drawBorder(element);
      }
      this.drawImage(element);
    }
  }

  private drawImage(element: CanvasElement) {
    const imageRect = new Path2D();
    imageRect.rect(510, 0, element.width, element.height);
    this.context.drawImage(element.canvasImageSource, element.edges.left, element.edges.top, element.width, element.height);
  }

  private drawBorder(element: CanvasElement) {
    const BORDER_WIDTH = 2;
    this.context.fillStyle = "green";
    this.context.fillRect(
      element.edges.left - BORDER_WIDTH,
      element.edges.top - BORDER_WIDTH,
      element.width + BORDER_WIDTH * 2,
      element.height + BORDER_WIDTH * 2
    );
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawImages();
  }
}
