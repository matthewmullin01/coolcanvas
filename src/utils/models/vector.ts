/**
 * Wraps x and y coordinates into a single entity.
 * Utility methods for vector maths added as well.
 */
export class Vector2D {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  subtract(point: Vector2D) {
    return new Vector2D(this.x - point.x, this.y - point.y);
  }

  add(point: Vector2D) {
    return new Vector2D(this.x + point.x, this.y + point.y);
  }
}
