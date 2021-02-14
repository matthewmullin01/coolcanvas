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

  constructor(canvas: HTMLCanvasElement, canvasElements: CanvasElement[]) {
    this.canvas = canvas;
    this.canvasElements = canvasElements;
  }

  adjustCanvasSize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  drawImages() {
    this.canvasElements.forEach((element) => {
      const imageRect = new Path2D();
      imageRect.rect(0, 0, element.width, element.height);
      this.canvas
        .getContext("2d")!
        .drawImage(element.canvasImageSource, element.edges.left, element.edges.top, element.width, element.height);
    });
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawImages();
  }
}
