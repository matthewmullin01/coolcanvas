import React, { useCallback, useEffect, useState } from "react";
import "./App.scss";
import Canvas from "./containers/canvas/Canvas";
import Dog from "./assets/dog.png";
import Cat from "./assets/cat.png";
import { loadImage } from "./utils/imageUtils";

const IMAGE_URIS = [Dog, Cat];

function App() {
  const [images, setImages] = useState<HTMLImageElement[]>();

  const getImages = useCallback(async () => {
    const i = await Promise.all(IMAGE_URIS.map((uri) => loadImage(uri)));
    setImages(i);
  }, []);

  useEffect(() => {
    getImages();
  }, [getImages]);

  return <>{images && <Canvas images={images} />}</>;
}

export default App;
