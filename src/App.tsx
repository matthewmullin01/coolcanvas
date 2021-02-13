import React from "react";
import "./App.scss";
import Canvas from "./containers/canvas/Canvas";
import Dog from "./assets/dog.png";
import Cat from "./assets/cat.png";

function App() {
  const images = [Dog, Cat];

  return <Canvas imageUris={images} />;
}

export default App;
