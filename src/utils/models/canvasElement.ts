import { DragState, Vector2D } from ".";

/**
 * A utility class to wrap element rendered in the canvas.
 * Manages internal state of the element - ie position, width, height etc
 */
// As we are using dynamic getters, the process of updating positions and sizes dynamically is a lot easier.
export class CanvasElement {
  canvasImageSource: CanvasImageSource;
  center: Vector2D;

  get width() {
    return +this.canvasImageSource.width;
  }
  get height() {
    return +this.canvasImageSource.height;
  }

  get edges() {
    return {
      left: this.center.x - this.width / 2,
      right: this.center.x + this.width / 2,
      top: this.center.y - this.height / 2,
      bottom: this.center.y + this.height / 2,
    };
  }

  // Not used currently but may come in handy when doing rotations etc
  get corners() {
    return {
      topLeft: new Vector2D(this.edges.left, this.edges.top),
      bottomLeft: new Vector2D(this.edges.left, this.edges.bottom),
      topRight: new Vector2D(this.edges.right, this.edges.top),
      bottomRight: new Vector2D(this.edges.right, this.edges.bottom),
    };
  }

  // Maintains the drag state of the element, and provides useful offset information
  private _dragState: DragState = new DragState();
  get dragState(): DragState {
    return this._dragState;
  }

  constructor(canvasImageSource: CanvasImageSource, center: Vector2D) {
    this.canvasImageSource = canvasImageSource;
    this.center = center;
  }

  /**
   * Checks whether a provided point is within the CanvasElement bounds.
   * @param {Vector2D} point
   * @return {boolean} Whether point is within the CanvasElement
   */
  public containsPoint(point: Vector2D) {
    return point.x <= this.edges.right && point.x >= this.edges.left && point.y >= this.edges.top && point.y <= this.edges.bottom;
  }

  /** Sets the dragState. Also calculates offset from CanvasElement center.  */
  public setDragging(isDragging: boolean, point?: Vector2D) {
    const draggingOffset = point ? point.subtract(this.center) : undefined;
    this._dragState = new DragState(isDragging, draggingOffset);
  }
}
