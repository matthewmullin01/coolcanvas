import React, { useCallback, useEffect, useState } from "react";
import Canvas from "./components/canvas/Canvas";
import Dog from "./assets/dog.png";
import Cat from "./assets/cat.png";
import { loadImage } from "./utils/imageUtils";

const IMAGE_URIS = [Cat, Dog];

function App() {
  const [images, setImages] = useState<HTMLImageElement[]>();

  const getImages = useCallback(async () => {
    const i = await Promise.all(IMAGE_URIS.map((uri) => loadImage(uri)));
    setImages(i);
  }, []);

  useEffect(() => {
    getImages();
  }, [getImages]);

  // Potential Cool Idea -
  // Rather than have an images prop, let <Canvas /> accept children.
  // Convert the children into Canvas Renderable data - eg CanvasImageSource
  return <>{images && <Canvas images={images} />}</>;
}

export default App;
