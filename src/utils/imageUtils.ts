/**
 *
 * Returns a HTMLImageElement from a URI
 *
 * @param src string uri of image - local disk or Web URL
 * @returns {HTMLImageElement} HTMLImageElement
 */
export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => {
      resolve(image);
    });
    image.addEventListener("error", reject);
    image.src = src;
  });
};
