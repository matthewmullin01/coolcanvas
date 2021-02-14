// If other states are added we can look to extract shared state info into a superclass and have sub state types wit their respective supplementary information

import { Vector2D } from ".";

/**
 * Utility to keep supplementary information about the Drag State
 *
 */
export class DragState {
  readonly isBeingDragged: boolean;
  readonly draggingOffset: Vector2D | null;

  constructor(isBeingDragged: boolean = false, draggingOffset: Vector2D | null = null) {
    this.isBeingDragged = isBeingDragged;
    this.draggingOffset = draggingOffset;
  }
}
