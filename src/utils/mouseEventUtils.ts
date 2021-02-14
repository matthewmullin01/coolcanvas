import { Vector2D } from "./models";

/**
 *
 * Get Vector2D cursor position relative to the currentTarget
 *
 * @param event MouseEvent Down or Up
 */
export const getRelativeCursorPosition = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
  const xPos = event.pageX - (event.currentTarget.offsetLeft || 0);
  const yPos = event.pageY - (event.currentTarget.offsetTop || 0);
  const relativePos = new Vector2D(xPos, yPos);
  return relativePos;
};
